import { describe, expect, it, vi } from "vitest";
import {
  createBetterAuthGateway,
  toSignInFailure,
  type SignInClient,
} from "@/modules/identity/infrastructure/better-auth-gateway";

const credentials = { email: "ana.souza@nexo.com.br", password: "x", rememberMe: true };

function fakeClient(email: SignInClient["signIn"]["email"]): SignInClient {
  return { signIn: { email }, signOut: vi.fn(async () => undefined) };
}

describe("toSignInFailure", () => {
  it.each([
    [401, "unknown-employee"],
    [429, "rate-limited"],
    [500, "unavailable"],
    [0, "unavailable"],
    [undefined, "unavailable"],
  ] as const)("maps status %s to %s", (status, failure) => {
    expect(toSignInFailure(status)).toBe(failure);
  });
});

describe("createBetterAuthGateway", () => {
  it("reports success when BetterAuth answers without an error", async () => {
    const gateway = createBetterAuthGateway(fakeClient(async () => ({ error: null })));

    await expect(gateway.signIn(credentials)).resolves.toEqual({ ok: true });
  });

  it("maps a BetterAuth error to a sign-in failure", async () => {
    const gateway = createBetterAuthGateway(fakeClient(async () => ({ error: { status: 401 } })));

    await expect(gateway.signIn(credentials)).resolves.toEqual({ ok: false, failure: "unknown-employee" });
  });

  it("signs out through BetterAuth", async () => {
    const client = fakeClient(async () => ({ error: null }));
    const gateway = createBetterAuthGateway(client);

    await gateway.signOut();

    expect(client.signOut).toHaveBeenCalledOnce();
  });

  it("treats a thrown network error as unavailable", async () => {
    const gateway = createBetterAuthGateway(
      fakeClient(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );

    await expect(gateway.signIn(credentials)).resolves.toEqual({ ok: false, failure: "unavailable" });
  });
});
