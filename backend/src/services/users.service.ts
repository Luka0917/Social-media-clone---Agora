import { GetObjectCommand, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import env from "../config/env.ts";
import S3 from "../config/S3.config.ts";
import { db } from '../db/db.ts';
import { userProfiles } from "../db/schema.ts";
import { eq } from 'drizzle-orm';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BadRequestError, NotFoundError } from "../lib/Errors.ts";

const AVATAR_THUMB_SIZE = 128;

const getPresignedUrl = async (userId: string, contentType: string, folder: "avatars" | "banners") => {
    if(!contentType.startsWith('image/')) throw new BadRequestError('Invalid file!');
    const fileExtension = contentType.split('/')[1];
    const r2Key = folder === 'avatars'
      ? `public/${folder}/original/${userId}.${fileExtension}`
      : `public/${folder}/${userId}.${fileExtension}`;
    const command = new PutObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: r2Key,
        ContentType: contentType
    });
    const presignUrl = await getSignedUrl(S3, command, { expiresIn: 60 });
    const publicUrl = `${env.WORKER_URL}/${env.BUCKET_NAME}/${r2Key}`;
    return { presignUrl, publicUrl };
};

const uploadToR2 = async (r2Key: string, body: Buffer, contentType: string) => {
  const command = new PutObjectCommand({
    Bucket: env.BUCKET_NAME,
    Key: r2Key,
    Body: body,
    ContentType: contentType,
  });
  await S3.send(command);
};

const fetchFromR2 = async (r2Key: string): Promise<Buffer> => {
  const command = new GetObjectCommand({ Bucket: env.BUCKET_NAME, Key: r2Key });
  const response = await S3.send(command);
  const chunks: Uint8Array[] = [];
  for await (const chunk of response.Body as any){
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

const generateAvatarThumb = async (originalKey: string, contentType: string) => {
  const originalBuffer = await fetchFromR2(originalKey);

  const thumbBuffer = await sharp(originalBuffer)
    .resize(AVATAR_THUMB_SIZE, AVATAR_THUMB_SIZE, { fit: "cover" })
    .toBuffer();

  const fileExtension = contentType.split('/')[1];
  const thumbKey = originalKey.replace('/original/', '/small/');
  const finalThumbKey = thumbKey !== originalKey ? thumbKey : `public/avatars/small/${originalKey.split('/').pop()}`;

  await uploadToR2(finalThumbKey, thumbBuffer, contentType);

  return `${env.WORKER_URL}/${env.BUCKET_NAME}/${finalThumbKey}`;
};

const extractR2key = (url: string) => {
  const prefix = `${env.WORKER_URL}/${env.BUCKET_NAME}/`;
  const withoutQuery = url.split('?')[0];
  return withoutQuery?.startsWith(prefix) ? withoutQuery.slice(prefix.length) : null;
};

const deleteFromR2 = async (r2Key: string) => {
  const command = new DeleteObjectCommand({ Bucket: env.BUCKET_NAME, Key: r2Key });
  await S3.send(command);
};

const saveMedia = async (userId: string, publicUrl: string, field: 'avatar' | 'banner', contentType?: string) => {
  const [existing] = field === 'avatar'
    ? await db.select({ current: userProfiles.avatar, currentThumb: userProfiles.avatarSmall }).from(userProfiles).where(eq(userProfiles.id, userId))
    : await db.select({ current: userProfiles.banner }).from(userProfiles).where(eq(userProfiles.id, userId));

  const bustedUrl = `${publicUrl}?v=${Date.now()}`;

  if(field === 'avatar'){
    if(!contentType) throw new BadRequestError('contentType is required for avatar uploads!');

    const originalKey = extractR2key(publicUrl);
    if(!originalKey) throw new BadRequestError('Invalid avatar URL!');

    const thumbUrl = await generateAvatarThumb(originalKey, contentType);
    const bustedThumbUrl = `${thumbUrl}?v=${Date.now()}`;

    await db.update(userProfiles)
      .set({ avatar: bustedUrl, avatarSmall: bustedThumbUrl })
      .where(eq(userProfiles.id, userId));

    if(existing && 'currentThumb' in existing && existing.currentThumb){
      const oldThumbKey = extractR2key(existing.currentThumb as string);
      const newThumbKey = extractR2key(thumbUrl);
      if(oldThumbKey && oldThumbKey !== newThumbKey){
        await deleteFromR2(oldThumbKey).catch(err =>
          console.error(`Failed to delete old avatar thumb from R2:`, err)
        );
      }
    }
  }else{
    await db.update(userProfiles).set({ banner: bustedUrl }).where(eq(userProfiles.id, userId));
  }

  if(existing?.current){
    const oldKey = extractR2key(existing.current);
    const newKey = extractR2key(publicUrl);
    if(oldKey && oldKey !== newKey){
      await deleteFromR2(oldKey).catch(err =>
        console.error(`Failed to delete old ${field} from R2:`, err)
      );
    }
  }
};

type UpdatableProfileFields = Partial<{
  username: string,
  firstName: string,
  lastName: string,
  bio: string | null,
  status: typeof userProfiles.status.enumValues[number] | null,
  occupation: string | null,
  education: string | null,
  dateOfBirth: Date | null,
  gender: typeof userProfiles.gender.enumValues[number] | null
}>;

export const UserService = {
    getAvatarPresignedUrl: (userId: string, contentType: string) =>
      getPresignedUrl(userId, contentType, "avatars"),

    getBannerPresignedUrl: (userId: string, contentType: string) =>
      getPresignedUrl(userId, contentType, "banners"),

    saveAvatar: (userId: string, publicUrl: string, contentType: string) => saveMedia(userId, publicUrl, 'avatar', contentType),

    saveBanner: (userId: string, publicUrl: string) => saveMedia(userId, publicUrl, 'banner'),

    setupProfile: async (userId: string, data: { username?: string, firstName: string, lastName: string }) => {
      const [profile] = await db
        .update(userProfiles)
        .set(data)
        .where(eq(userProfiles.id, userId))
        .returning();

      if(!profile) throw new NotFoundError('Profile not found!');

      return profile;
    },

    updateProfile: async (userId: string, data: UpdatableProfileFields) => {
      const [profile] = await db
        .update(userProfiles)
        .set(data)
        .where(eq(userProfiles.id, userId))
        .returning();

      if(!profile) throw new NotFoundError('Profile not found!');

      return profile;
    },

    getProfile: async (userId: string) => {
      const [profile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.id, userId));

      if(!profile) throw new NotFoundError('Profile not found!');

      return profile;
    }
};