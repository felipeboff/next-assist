import type { AuthGateway } from "@/modules/identity/application/ports/auth-gateway";
import {
  checkCredentials,
  type Credentials,
  type CredentialsProblems,
} from "@/modules/identity/domain/credentials";
import type { SignInFailure } from "@/modules/identity/domain/sign-in-failure";

export type SignInResult =
  | { status: "signed-in" }
  | { status: "invalid"; problems: CredentialsProblems }
  | { status: "failed"; failure: SignInFailure };

export type SignIn = (input: Credentials) => Promise<SignInResult>;

type SignInDependencies = Readonly<{
  authGateway: AuthGateway;
}>;

export function makeSignIn({ authGateway }: SignInDependencies): SignIn {
  return async (input) => {
    const check = checkCredentials(input);
    if (!check.ok) {
      return { status: "invalid", problems: check.problems };
    }

    const outcome = await authGateway.signIn(check.credentials);
    return outcome.ok ? { status: "signed-in" } : { status: "failed", failure: outcome.failure };
  };
}
