import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client, Pool } from "pg";

async function createDatabaseIfMissing(databaseUrl: string): Promise<void> {
  const target = new URL(databaseUrl);
  const name = decodeURIComponent(target.pathname.slice(1));
  const server = new URL(databaseUrl);
  server.pathname = "/postgres";

  const client = new Client({ connectionString: server.toString() });
  await client.connect();
  try {
    const existing = await client.query("select 1 from pg_database where datname = $1", [name]);
    if (existing.rowCount === 0) {
      await client.query(`create database "${name.replaceAll('"', '""')}"`);
    }
  } finally {
    await client.end();
  }
}

export default async function setup(): Promise<void> {
  const databaseUrl = process.env.INTEGRATION_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("Integration tests need DATABASE_URL (see .env.example) and a running PostgreSQL.");
  }

  await createDatabaseIfMissing(databaseUrl);

  const pool = new Pool({ connectionString: databaseUrl });
  try {
    await migrate(drizzle({ client: pool }), { migrationsFolder: "drizzle" });
  } finally {
    await pool.end();
  }
}
