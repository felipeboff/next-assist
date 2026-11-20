import { makeSignIn } from "@/modules/identity/application/use-cases/sign-in";
import { authClient } from "@/modules/identity/infrastructure/better-auth-client";
import { createBetterAuthGateway } from "@/modules/identity/infrastructure/better-auth-gateway";
import type { IdentityDependencies } from "@/modules/identity/presentation/identity-dependencies";

export function makeIdentityClientModule(): IdentityDependencies {
  const authGateway = createBetterAuthGateway(authClient);
  return {
    signIn: makeSignIn({ authGateway }),
    signOut: () => authGateway.signOut(),
  };
}
