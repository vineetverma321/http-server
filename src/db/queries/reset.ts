import { db } from '../index.js';
import { users } from '../schema.js';

export async function resetTable () {
    const [result] = await db.delete(users)
}