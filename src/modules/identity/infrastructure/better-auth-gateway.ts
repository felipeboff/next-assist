import type { AuthGateway } from "@/modules/identity/application/ports/auth-gateway";
import type { Credentials } from "@/modules/identity/domain/credentials";
import type { SignInFailure } from "@/modules/identity/domain/sign-in-failure";

export type SignInClient = {
  signIn: {
    email(credentials: Credentials): Promise<{ error: { status: number } | null }>;
  };
  signOut(): Promise<unknown>;
};

export function toSignInFailure(status: number | undefined): SignInFailure {
  if (status === 401) {
    return "unknown-employee";
  }
  if (status === 429) {
    return "rate-limited";
  }
  return "unavailable";
}

export function createBetterAuthGateway(client: SignInClient): AuthGateway {
  return {
    async signIn(credentials) {
      try {
        const { error } = await client.signIn.email(credentials);
        return error ? { ok: false, failure: toSignInFailure(error.status) } : { ok: true };
      } catch {
        return { ok: false, failure: "unavailable" };
      }
    },
    async signOut() {
      await client.signOut();
    },
  };
}
