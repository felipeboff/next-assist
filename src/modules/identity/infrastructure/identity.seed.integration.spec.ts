import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import { account, user } from "@/modules/identity/infrastructure/identity.schema";
import { seedIdentity, seedPeople } from "@/modules/identity/infrastructure/identity.seed";
import { resetIdentityTables } from "@/modules/identity/infrastructure/testing/identity-database";
import { db } from "@/shared/infrastructure/db/client";

const byEmail = (a: { email: string }, b: { email: string }) => a.email.localeCompare(b.email);

beforeEach(async () => {
  await resetIdentityTables(db);
});

describe("seedIdentity", () => {
  it("creates every seeded person with one hashed credential account", async () => {
    expect(await seedIdentity(db)).toBe(seedPeople.length);

    const users = await db.select({ name: user.name, email: user.email, role: user.role }).from(user);
    expect(users.sort(byEmail)).toEqual([...seedPeople].sort(byEmail));

    const accounts = await db.select().from(account);
    expect(accounts).toHaveLength(seedPeople.length);
    for (const credential of accounts) {
      expect(credential.providerId).toBe("credential");
      expect(credential.accountId).toBe(credential.userId);
      expect(credential.password).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
    }
  });

  it("can run again without duplicating anyone, restoring the seeded name and role", async () => {
    await seedIdentity(db);
    await db
      .update(user)
      .set({ name: "Outro nome", role: "analyst" })
      .where(eq(user.email, "ana.souza@nexo.com.br"));

    expect(await seedIdentity(db)).toBe(0);

    expect(await db.select().from(user)).toHaveLength(seedPeople.length);
    expect(await db.select().from(account)).toHaveLength(seedPeople.length);
    const [ana] = await db.select().from(user).where(eq(user.email, "ana.souza@nexo.com.br"));
    expect(ana).toMatchObject({ name: "Ana Souza", role: "employee" });
  });
});
