import { sql } from 'drizzle-orm';
import { boolean, pgTable, timestamp, varchar, uuid, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar('email', { length: 256 }).unique().notNull(),
  password: varchar('hashed_password', { length: 256 }).notNull().default("unset"),
  isChirpyRed: boolean('is_chirpy_red').notNull().default(false)
});

export const chirps = pgTable('chirps', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
  body: text('body').notNull(),
  userId: uuid('user_Id').references(() => users.id, {onDelete: 'cascade'}).notNull()
})

export const refreshTokens = pgTable('refresh_tokens', {
  token: text('token').primaryKey(),
  userId: uuid('user_Id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
  expiresAt: timestamp('expires_at').notNull(),
  revokedAt: timestamp('revoked_at')
})



export type NewUser = typeof users.$inferInsert;
export type NewChirp = typeof chirps.$inferInsert;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;

export type UserResponse = Omit < NewUser, "hashed_password" >;