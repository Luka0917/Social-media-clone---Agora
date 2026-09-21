import { defineRelations, sql } from "drizzle-orm";
import {
    text,
    timestamp,
    boolean,
    index,
    uniqueIndex,
    pgEnum,
    uuid,
    integer, 
    pgTable
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const sessions = pgTable(
    "sessions",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const accounts = pgTable(
    "accounts",
    {
        id: text("id").primaryKey(),
        issuer: text("issuer").notNull(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        uniqueIndex("account_issuer_accountId_uidx").on(
            table.issuer,
            table.accountId,
        ),
        index("account_userId_idx").on(table.userId),
    ],
);

export const verifications = pgTable(
    "verifications",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const authRelatoins = defineRelations({ users, sessions, accounts },
    (r) => ({
        users: {
            session: r.many.sessions(),
            account: r.many.accounts(),
        },
        sessions: {
            user: r.one.users({
                from: r.sessions.userId,
                to: r.users.id,
            }),
        },
        accounts: {
            user: r.one.users({
                from: r.accounts.userId,
                to: r.users.id,
            })
        }
    })
)

export const statusEnum = pgEnum("status", [
    "single",
    "in_a_relationship",
    "engaged",
    "married",
    "in_a_civil_union",
    "its_complicated",
    "in_a_domestic_partnership",
    "in_an_open_relationship",
    "widowed",
    "separated",
    "divorced"
]);
export const genderEnum = pgEnum("gender", ["male", "female", "other"])
export const userProfiles = pgTable("user_profiles", {
    id: text("id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
    username: text("username").notNull().unique().default(sql`'user' || floor(random() * (99999999 - 10000000 + 1) + 10000000)::text`),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    bio: text("bio"),
    pfp: text("pfp"),
    background: text("background"),
    status: statusEnum("status"),
    occupation: text("occupation"),
    education: text("education"),
    note: text("note"),
    lastNoteCreatedAt: timestamp("last_note_created_at"),
    dateOfBirth: timestamp("date_of_birth"),
    gender: genderEnum("gender"),
});

// ============================================================
// POSTS
// ============================================================

export const postTypeEnum = pgEnum("post_type", [
    "text",
    "photo",
    "video",
]);

export const posts = pgTable(
    "posts",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        authorId: text("author_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        type: postTypeEnum("type").notNull(),

        content: text("content"),

        commentsDisabled: boolean("comments_disabled")
            .notNull()
            .default(false),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        index("posts_authorId_idx").on(table.authorId),
        index("posts_type_idx").on(table.type),
        index("posts_createdAt_idx").on(table.createdAt),
    ],
);


// ============================================================
// POST MEDIA
// ============================================================

export const mediaTypeEnum = pgEnum("media_type", [
    "image",
    "video",
]);

export const postMedia = pgTable(
    "post_media",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        postId: uuid("post_id")
            .notNull()
            .references(() => posts.id, {
                onDelete: "cascade",
            }),

        type: mediaTypeEnum("type").notNull(),

        url: text("url").notNull(),

        position: integer("position")
            .notNull()
            .default(0),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        index("postMedia_postId_idx").on(table.postId),
    ],
);


// ============================================================
// POST LIKES
// ============================================================

export const postLikes = pgTable(
    "post_likes",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        postId: uuid("post_id")
            .notNull()
            .references(() => posts.id, {
                onDelete: "cascade",
            }),

        userId: text("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        uniqueIndex("postLikes_postId_userId_uidx").on(
            table.postId,
            table.userId,
        ),

        index("postLikes_userId_idx").on(table.userId),
        index("postLikes_postId_idx").on(table.postId),
    ],
);


// ============================================================
// POST REPOSTS
// ============================================================

export const postReposts = pgTable(
    "post_reposts",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        postId: uuid("post_id")
            .notNull()
            .references(() => posts.id, {
                onDelete: "cascade",
            }),

        userId: text("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        uniqueIndex("postReposts_postId_userId_uidx").on(
            table.postId,
            table.userId,
        ),

        index("postReposts_userId_idx").on(table.userId),
        index("postReposts_postId_idx").on(table.postId),
    ],
);


// ============================================================
// COMMENTS
// ============================================================

export const comments = pgTable(
    "comments",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        postId: uuid("post_id")
            .notNull()
            .references(() => posts.id, {
                onDelete: "cascade",
            }),

        userId: text("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        content: text("content").notNull(),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        index("comments_postId_idx").on(table.postId),
        index("comments_userId_idx").on(table.userId),
    ],
);


// ============================================================
// POST RELATIONS
// ============================================================

export const postRelations = defineRelations(
    {
        users,
        userProfiles,
        posts,
        postMedia,
        postLikes,
        postReposts,
        comments,
    },
    (r) => ({
        users: {
            posts: r.many.posts(),
            likes: r.many.postLikes(),
            reposts: r.many.postReposts(),
            comments: r.many.comments(),
            profile: r.one.userProfiles({
                from: r.users.id,
                to: r.userProfiles.id,
            }),
        },

        userProfiles: {
            user: r.one.users({
                from: r.userProfiles.id,
                to: r.users.id,
            }),
        },

        posts: {
            author: r.one.users({
                from: r.posts.authorId,
                to: r.users.id,
            }),
            media: r.many.postMedia(),
            likes: r.many.postLikes(),
            reposts: r.many.postReposts(),
            comments: r.many.comments(),
        },

        postMedia: {
            post: r.one.posts({
                from: r.postMedia.postId,
                to: r.posts.id,
            }),
        },

        postLikes: {
            post: r.one.posts({
                from: r.postLikes.postId,
                to: r.posts.id,
            }),
            user: r.one.users({
                from: r.postLikes.userId,
                to: r.users.id,
            }),
        },

        postReposts: {
            post: r.one.posts({
                from: r.postReposts.postId,
                to: r.posts.id,
            }),
            user: r.one.users({
                from: r.postReposts.userId,
                to: r.users.id,
            }),
        },

        comments: {
            post: r.one.posts({
                from: r.comments.postId,
                to: r.posts.id,
            }),
            user: r.one.users({
                from: r.comments.userId,
                to: r.users.id,
            }),
        },
    }),
);