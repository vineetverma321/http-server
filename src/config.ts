// Load environment variables from .env file
// process.loadEnvFile('.env')
import dotenv from 'dotenv';
dotenv.config();
// process.loadEnvFile('../.env')

import type { MigrationConfig } from 'drizzle-orm/migrator';

// Helper function to safely get environment variables
function envOrThrow(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

type DBConfig = {
	fileserverHits: number,
  platform: string,
    db: {
      URL: string,
      migrationConfig: MigrationConfig
    },
    secret: string,
    port: number,
    polkaKey: string
}


const migrationConfig: MigrationConfig = {
  migrationsFolder: './src/db/migrations',
};

export const config: DBConfig = {
    fileserverHits: 0,
    platform: envOrThrow('PLATFORM'),
    db: {
      URL: envOrThrow('DB_URL'),
      migrationConfig: migrationConfig
    },
    secret: envOrThrow('SECRET'),
    port: Number(process.env.PORT),
    polkaKey: String(process.env.POLKA_KEY)
  }
