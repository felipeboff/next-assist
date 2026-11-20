import { headers } from "next/headers";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authRouteHandlers, findCurrentUser, findPasswordChangedAt } from "@/modules/identity/composition";
import { seedIdentity } from "@/modules/identity/infrastructure/identity.seed";
import {
  cookieHeaderFrom,
  resetIdentityTables,
} from "@/modules/identity/infrastructure/testing/identity-database";
import { db } from "@/shared/infrastructure/db/client";
import { env } from "@/shared/infrastructure/env";

vi.mock("next/headers", () => ({ headers: vi.fn() }));

function signInRequest(email: string): Request {
  return new Request(`${env.BETTER_AUTH_URL}/api/auth/sign-in/email`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: env.BETTER_AUTH_URL },
    body: JSON.stringify({ email, password: "123456" }),
  });
}

beforeEach(async () => {
  await resetIdentityTables(db);
  await seedIdentity(db);
});

describe("identity server composition", () => {
  it("signs in over HTTP and finds the employee on the next request", async () => {
    const response = await authRouteHandlers.POST(signInRequest("bruno.carvalho@nexo.com.br"));
    expect(response.status).toBe(200);

    vi.mocked(headers).mockResolvedValue(
      new Headers({ cookie: cookieHeaderFrom(response) }) as Awaited<ReturnType<typeof headers>>,
    );

    await expect(findCurrentUser()).resolves.toMatchObject({
      name: "Bruno Carvalho",
      email: "bruno.carvalho@nexo.com.br",
      role: "employee",
    });
  });

  it("answers 401 over HTTP for an e-mail that is not seeded", async () => {
    const response = await authRouteHandlers.POST(signInRequest("visitante@nexo.com.br"));

    expect(response.status).toBe(401);
    expect(response.headers.getSetCookie()).toEqual([]);
  });

  it("reads when the signed-in employee's password last changed", async () => {
    const response = await authRouteHandlers.POST(signInRequest("ana.souza@nexo.com.br"));
    vi.mocked(headers).mockResolvedValue(
      new Headers({ cookie: cookieHeaderFrom(response) }) as Awaited<ReturnType<typeof headers>>,
    );
    const user = await findCurrentUser();

    await expect(findPasswordChangedAt(user?.id ?? "")).resolves.toBeInstanceOf(Date);
  });

  it("serves the session endpoint over GET", async () => {
    const response = await authRouteHandlers.GET(new Request(`${env.BETTER_AUTH_URL}/api/auth/get-session`));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toBeNull();
  });
});
