import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "src/db/schema.ts",
    out: "src/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: "postgres://krsna:@localhost:5432/krsna?sslmode=disable",
    }
});