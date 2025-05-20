import * as schema from './schema.js';
import { config } from '../config.js';

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const migrationClient = postgres(config.db.URL, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const conn = postgres(config.db.URL);
export const db = drizzle(conn, { schema });