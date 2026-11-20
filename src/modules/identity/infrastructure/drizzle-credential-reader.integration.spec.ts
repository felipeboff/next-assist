import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import { createDrizzleCredentialReader } from "@/modules/identity/infrastructure/drizzle-credential-reader";
import { account, user } from "@/modules/identity/infrastructure/identity.schema";
import { seedIdentity } from "@/modules/identity/infrastructure/identity.seed";
import { resetIdentityTables } from "@/modules/identity/infrastructure/testing/identity-database";
import { db } from "@/shared/infrastructure/db/client";

async function userIdOf(email: string): Promise<string> {
  const [row] = await db.select({ id: user.id }).from(user).where(eq(user.email, email));
  return row.id;
}

beforeEach(async () => {
  await resetIdentityTables(db);
  await seedIdentity(db);
});

describe("Drizzle credential reader", () => {
  it("reads the password age from the credential's last update", async () => {
    const userId = await userIdOf("ana.souza@nexo.com.br");
    const changedAt = new Date("2026-10-09T13:00:00.000Z");
    await db.update(account).set({ updatedAt: changedAt }).where(eq(account.userId, userId));

    await expect(createDrizzleCredentialReader(db).passwordChangedAt(userId)).resolves.toEqual(changedAt);
  });

  it("finds no date for a user without a password credential", async () => {
    const userId = await userIdOf("bruno.carvalho@nexo.com.br");
    await db.delete(account).where(eq(account.userId, userId));

    await expect(createDrizzleCredentialReader(db).passwordChangedAt(userId)).resolves.toBeNull();
  });
});
