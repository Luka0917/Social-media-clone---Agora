import { PutObjectCommand } from "@aws-sdk/client-s3";
import env from "../config/env.ts";
import S3 from "../config/S3.config.ts";
import { db } from '../db/db.ts';
import { userProfiles } from "../db/schema.ts";
import { eq } from 'drizzle-orm';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NotFoundError } from "../lib/Errors.ts";

const getPresignedUrl = async (userId: string, contentType: string, folder: "avatars" | "banners") => {
    if(!contentType.startsWith('image/')) throw new Error('Invalid file!');
    const fileExtension = contentType.split('/')[1];
    const r2Key = `public/${folder}/${folder === 'avatars' ? 'original' : ''}/${userId}.${fileExtension}`;
    const command = new PutObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: r2Key,
        ContentType: contentType
    });
    const presignUrl = await getSignedUrl(S3, command, { expiresIn: 60 });
    const publicUrl = `${env.WORKER_URL}/${env.BUCKET_NAME}/${r2Key}`;
    return { presignUrl, publicUrl };
};

export const UserService = {
    getAvatarPresignedUrl: (userId: string, contentType: string) =>
      getPresignedUrl(userId, contentType, "avatars"),

    getBannerPresignedUrl: (userId: string, contentType: string) =>
      getPresignedUrl(userId, contentType, "banners"),

    saveAvatar: async (userId: string, publicUrl: string) => {
      await db.update(userProfiles).set({ pfp: publicUrl }).where(eq(userProfiles.id, userId));
    },

    saveBanner: async (userId: string, publicUrl: string) => {
      await db.update(userProfiles).set({ background: publicUrl }).where(eq(userProfiles.id, userId));
    },

    setupProfile: async (userId: string, data: { username?: string, firstName: string, lastName: string }) => {
      const [profile] = await db
        .update(userProfiles)
        .set(data)
        .where(eq(userProfiles.id, userId))
        .returning();

      if(!profile) throw new NotFoundError('Profile not found!');

      return profile;
    }
};