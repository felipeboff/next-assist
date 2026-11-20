import type { PasswordReset } from "@/modules/identity/application/ports/password-reset";

/**
 * Stand-in until an e-mail service exists (AD-003): it takes a moment, like a real request, and
 * sends nothing.
 */
export function createMockPasswordReset({ delayMs }: { delayMs: number }): PasswordReset {
  return {
    request: () => new Promise((resolve) => setTimeout(resolve, delayMs)),
  };
}
