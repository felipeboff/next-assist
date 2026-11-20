import { db, pool } from "@/shared/infrastructure/db/client";
import { seedIdentity, seedPeople } from "@/modules/identity/infrastructure/identity.seed";

async function main(): Promise<void> {
  const created = await seedIdentity(db);
  console.log(`identity: ${seedPeople.length} people ensured (${created} new)`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
