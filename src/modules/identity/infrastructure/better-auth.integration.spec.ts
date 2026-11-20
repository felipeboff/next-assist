import { count } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import { auth } from "@/modules/identity/infrastructure/better-auth";
import { user } from "@/modules/identity/infrastructure/identity.schema";
import { seedIdentity, seedPeople } from "@/modules/identity/infrastructure/identity.seed";
import { resetIdentityTables } from "@/modules/identity/infrastructure/testing/identity-database";
import { db } from "@/shared/infrastructure/db/client";

beforeEach(async () => {
  await resetIdentityTables(db);
  await seedIdentity(db);
});

describe("BetterAuth for Nexo Assist", () => {
  it("signs a seeded employee in with any password and returns the role", async () => {
    const result = await auth.api.signInEmail({
      body: { email: "ana.souza@nexo.com.br", password: `any-${Date.now()}` },
    });

    expect(result.token).toEqual(expect.any(String));
    expect(result.user).toMatchObject({
      name: "Ana Souza",
      email: "ana.souza@nexo.com.br",
      role: "employee",
    });
  });

  it("signs analysts in too", async () => {
    const result = await auth.api.signInEmail({ body: { email: "marina.lopes@nexo.com.br", password: "x" } });

    expect(result.user).toMatchObject({ role: "analyst" });
  });

  it("refuses an e-mail that is not in the seed data", async () => {
    await expect(
      auth.api.signInEmail({ body: { email: "visitante@nexo.com.br", password: "x" } }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it("does not let anyone sign up", async () => {
    await expect(
      auth.api.signUpEmail({
        body: { name: "Visitante", email: "visitante@nexo.com.br", password: "12345678" },
      }),
    ).rejects.toThrow();

    expect(await db.select({ total: count() }).from(user)).toEqual([{ total: seedPeople.length }]);
  });
});
