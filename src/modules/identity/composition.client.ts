import { makeSignIn } from "@/modules/identity/application/use-cases/sign-in";
import { authClient } from "@/modules/identity/infrastructure/better-auth-client";
import { createBetterAuthGateway } from "@/modules/identity/infrastructure/better-auth-gateway";
import { createMockPasswordReset } from "@/modules/identity/infrastructure/mock-password-reset";
import type { IdentityDependencies } from "@/modules/identity/presentation/identity-dependencies";

export function makeIdentityClientModule(): IdentityDependencies {
  const authGateway = createBetterAuthGateway(authClient);
  // No e-mail service yet: the reset request is mocked (AD-003).
  const passwordReset = createMockPasswordReset({ delayMs: 700 });
  return {
    signIn: makeSignIn({ authGateway }),
    signOut: () => authGateway.signOut(),
    requestPasswordReset: (email) => passwordReset.request(email),
  };
}
