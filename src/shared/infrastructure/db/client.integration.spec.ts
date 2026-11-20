import { sql } from "drizzle-orm";
import type { Pool } from "pg";
import { afterEach, describe, expect, it, vi } from "vitest";

const globalForDb = globalThis as typeof globalThis & { nexoPgPool?: Pool };

async function loadClient() {
  vi.resetModules();
  return import("@/shared/infrastructure/db/client");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("database client", () => {
  it("queries PostgreSQL through Drizzle", async () => {
    const { db } = await loadClient();

    const result = await db.execute(sql`select 1 as ok`);

    expect(result.rows).toEqual([{ ok: 1 }]);
  });

  it("keeps one pool across module reloads outside production", async () => {
    const first = (await loadClient()).pool;
    const second = (await loadClient()).pool;

    expect(second).toBe(first);
    expect(globalForDb.nexoPgPool).toBe(first);
  });

  it("does not keep the pool on the global object in production", async () => {
    const developmentPool = globalForDb.nexoPgPool;
    delete globalForDb.nexoPgPool;
    vi.stubEnv("NODE_ENV", "production");

    const { pool } = await loadClient();

    expect(globalForDb.nexoPgPool).toBeUndefined();
    await pool.end();
    globalForDb.nexoPgPool = developmentPool;
  });
});
