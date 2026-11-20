import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/shared/infrastructure/env";

const globalForDb = globalThis as typeof globalThis & { nexoPgPool?: Pool };

export const pool: Pool = globalForDb.nexoPgPool ?? new Pool({ connectionString: env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  globalForDb.nexoPgPool = pool;
}

export const db = drizzle({ client: pool });

export type Database = typeof db;
