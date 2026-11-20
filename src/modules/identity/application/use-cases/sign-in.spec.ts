import { describe, expect, it, vi } from "vitest";
import type { AuthGateway, SignInOutcome } from "@/modules/identity/application/ports/auth-gateway";
import { makeSignIn } from "@/modules/identity/application/use-cases/sign-in";

function fakeGateway(outcome: SignInOutcome): AuthGateway {
  return {
    signIn: vi.fn(async () => outcome),
    signOut: vi.fn(async () => undefined),
  };
}

describe("signIn", () => {
  it("does not call the gateway when the credentials are invalid", async () => {
    const authGateway = fakeGateway({ ok: true });
    const signIn = makeSignIn({ authGateway });

    const result = await signIn({ email: "", password: "", rememberMe: true });

    expect(result).toEqual({
      status: "invalid",
      problems: { email: "email.required", password: "password.required" },
    });
    expect(authGateway.signIn).not.toHaveBeenCalled();
  });

  it("sends the normalized credentials and reports success", async () => {
    const authGateway = fakeGateway({ ok: true });
    const signIn = makeSignIn({ authGateway });

    const result = await signIn({ email: " Ana.Souza@nexo.com.br", password: "123", rememberMe: false });

    expect(result).toEqual({ status: "signed-in" });
    expect(authGateway.signIn).toHaveBeenCalledWith({
      email: "ana.souza@nexo.com.br",
      password: "123",
      rememberMe: false,
    });
  });

  it("passes the gateway failure through", async () => {
    const signIn = makeSignIn({ authGateway: fakeGateway({ ok: false, failure: "unknown-employee" }) });

    const result = await signIn({ email: "visitante@nexo.com.br", password: "x", rememberMe: true });

    expect(result).toEqual({ status: "failed", failure: "unknown-employee" });
  });
});
