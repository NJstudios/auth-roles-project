import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql", // <-- tell drizzle-kit we're using Postgres
  dbCredentials: {
    url: process.env.DATABASE_URL!, // <-- use `url`, not `connectionString`
  },
});
