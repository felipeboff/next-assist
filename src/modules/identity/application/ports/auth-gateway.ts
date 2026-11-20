import type { Credentials } from "@/modules/identity/domain/credentials";
import type { SignInFailure } from "@/modules/identity/domain/sign-in-failure";

export type SignInOutcome = { ok: true } | { ok: false; failure: SignInFailure };

export interface AuthGateway {
  signIn(credentials: Credentials): Promise<SignInOutcome>;
  signOut(): Promise<void>;
}
