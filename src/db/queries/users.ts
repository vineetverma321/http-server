import { and, eq } from 'drizzle-orm';
import { db } from '../index.js';
import { NewUser, users, UserResponse } from '../schema.js';

export async function createUser(user: NewUser): Promise<UserResponse>{
  const [result] = await db.insert(users).values(user).onConflictDoNothing().returning();
  const {password, ...UserResponse} = result
  return UserResponse;
}

export async function findUser(email:string){
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}

export async function updateUser(id: string, pwd: string, mail: string): Promise<UserResponse> {
  console.log("starting update")
  const [result] = await db.update(users).set({password:pwd, email: mail}).where(eq(users.id, id)).returning()
  const {password, ...user_no_pwd} = result
  console.log(password, user_no_pwd)
  return user_no_pwd
}

export async function turnChirpyRed(id: string) {
  const result = await db.update(users).set({isChirpyRed: true}).where(eq(users.id, id)).returning()
  return result.length > 0
}