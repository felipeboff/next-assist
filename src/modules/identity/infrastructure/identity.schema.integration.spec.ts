import { count, eq } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/pg-core";
import { beforeEach, describe, expect, it } from "vitest";
import { account, session, user, verification } from "@/modules/identity/infrastructure/identity.schema";
import { resetIdentityTables } from "@/modules/identity/infrastructure/testing/identity-database";
import { db } from "@/shared/infrastructure/db/client";

const ana = { id: "user-ana", name: "Ana Souza", email: "ana.souza@nexo.com.br" };

beforeEach(async () => {
  await resetIdentityTables(db);
});

describe("identity tables", () => {
  it("tie sessions and accounts to their user, removed with it, and index the lookups", () => {
    for (const table of [session, account]) {
      const config = getTableConfig(table);
      const [foreignKey] = config.foreignKeys;
      const reference = foreignKey.reference();

      expect(reference.foreignTable).toBe(user);
      expect(reference.foreignColumns).toEqual([user.id]);
      expect(foreignKey.onDelete).toBe("cascade");
      expect(config.indexes.map((index) => index.config.name)).toEqual([`${config.name}_user_id_idx`]);
    }
    expect(getTableConfig(verification).indexes.map((index) => index.config.name)).toEqual([
      "verification_identifier_idx",
    ]);
  });

  it("delete a user's sessions and accounts together with the user", async () => {
    await db.insert(user).values(ana);
    await db.insert(session).values({
      id: "session-1",
      token: "token-1",
      expiresAt: new Date(Date.now() + 60_000),
      userId: ana.id,
    });
    await db
      .insert(account)
      .values({ id: "account-1", accountId: ana.id, providerId: "credential", userId: ana.id });

    await db.delete(user).where(eq(user.id, ana.id));

    expect(await db.select({ total: count() }).from(session)).toEqual([{ total: 0 }]);
    expect(await db.select({ total: count() }).from(account)).toEqual([{ total: 0 }]);
  });

  it("default a new user to employee and move updatedAt forward when the row changes", async () => {
    const past = new Date("2026-01-01T00:00:00Z");
    await db.insert(user).values({ ...ana, createdAt: past, updatedAt: past });

    await db.update(user).set({ name: "Ana S." }).where(eq(user.id, ana.id));

    const [row] = await db.select().from(user).where(eq(user.id, ana.id));
    expect(row.role).toBe("employee");
    expect(row.emailVerified).toBe(false);
    expect(row.updatedAt.getTime()).toBeGreaterThan(past.getTime());
  });
});
