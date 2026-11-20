import { afterAll } from "vitest";

afterAll(async () => {
  const globalForDb = globalThis as typeof globalThis & {
    nexoPgPool?: { ended: boolean; end(): Promise<void> };
  };
  const pool = globalForDb.nexoPgPool;
  if (pool && !pool.ended) {
    await pool.end();
  }
  delete globalForDb.nexoPgPool;
});
