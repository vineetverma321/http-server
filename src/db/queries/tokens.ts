import { eq, and, gt, isNull } from 'drizzle-orm';
import { db } from '../index.js';
import { NewRefreshToken, refreshTokens } from '../schema.js';

export async function createRefreshToken(refresh_token: NewRefreshToken) {
  const [result] = await db.insert(refreshTokens).values(refresh_token).onConflictDoNothing().returning();
  return result;
}

export async function getUserFromRefreshToken(token: string) {
  const [result] = await db.select().from(refreshTokens).where(and(eq(refreshTokens.token, token),isNull(refreshTokens.revokedAt),gt(refreshTokens.expiresAt, new Date())));
  return result.userId;
}

export async function revokeToken(token: string) {
    console.log("starting revocation")
  const [result] = await db.update(refreshTokens).set({revokedAt: new Date(),updatedAt: new Date()}).where(eq(refreshTokens.token, token));
  return result;
}
