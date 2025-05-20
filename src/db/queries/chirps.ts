import { eq, and, asc, desc } from 'drizzle-orm';
import { db } from '../index.js';
import { NewChirp, chirps } from '../schema.js';


export async function createChirp(chirp: NewChirp) {
  const [result] = await db.insert(chirps).values(chirp).onConflictDoNothing().returning();
  return result;
}

export async function getAllChirps(filters: any, sort_order: string) {
  let result = []
  if (sort_order === "asc") {
    result = await db.select().from(chirps).where(filters.length ? and(...filters) : undefined).orderBy(asc(chirps.createdAt));
  }
  else {
    result = await db.select().from(chirps).where(filters.length ? and(...filters) : undefined).orderBy(desc(chirps.createdAt));
  }
return result;
}

// export async function getAllChirpsByAuthor(authorId: string) {
//   let result
//   if (authorId = "") {
//     const result = await db.select().from(chirps);
//   } else {
//     const result = await db.select().from(chirps).where(eq(chirps.userId,authorId));
//   }
//   return result;
// }

export async function getChirp(chirp_id: string) {
  const result = await db.select().from(chirps).where(eq(chirps.id, chirp_id));
  if (result.length === 0) {
    return 
  }
  return result[0];
}

export async function deleteChirp (chirpID: string) {
  console.log("starting deletion")
  const result = await db.delete(chirps).where(eq(chirps.id, chirpID)).returning()
  console.log("deleted: ", result)
  return result.length > 0
}