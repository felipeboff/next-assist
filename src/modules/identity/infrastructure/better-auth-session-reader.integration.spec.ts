import { headers } from "next/headers";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { auth } from "@/modules/identity/infrastructure/better-auth";
import { createBetterAuthSessionReader } from "@/modules/identity/infrastructure/better-auth-session-reader";
import { seedIdentity } from "@/modules/identity/infrastructure/identity.seed";
import {
  cookieHeaderFrom,
  resetIdentityTables,
} from "@/modules/identity/infrastructure/testing/identity-database";
import { db } from "@/shared/infrastructure/db/client";

vi.mock("next/headers", () => ({ headers: vi.fn() }));

function requestHeaders(init?: HeadersInit) {
  vi.mocked(headers).mockResolvedValue(new Headers(init) as Awaited<ReturnType<typeof headers>>);
}

beforeEach(async () => {
  await resetIdentityTables(db);
  await seedIdentity(db);
});

describe("BetterAuth session reader", () => {
  it("finds nobody when the request has no session", async () => {
    requestHeaders();

    await expect(createBetterAuthSessionReader().readCurrentUser()).resolves.toBeNull();
  });

  it("reads the signed-in employee from the session cookie", async () => {
    const response = await auth.api.signInEmail({
      body: { email: "ana.souza@nexo.com.br", password: "x" },
      asResponse: true,
    });
    requestHeaders({ cookie: cookieHeaderFrom(response) });

    await expect(createBetterAuthSessionReader().readCurrentUser()).resolves.toEqual({
      id: expect.any(String),
      name: "Ana Souza",
      email: "ana.souza@nexo.com.br",
      role: "employee",
    });
  });
});
