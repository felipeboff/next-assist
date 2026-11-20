import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { userRoles } from "@/modules/identity/domain/user-role";
import { account, session, user, verification } from "@/modules/identity/infrastructure/identity.schema";
import { db } from "@/shared/infrastructure/db/client";
import { env } from "@/shared/infrastructure/env";

/**
 * Challenge rule (PRD, Screen 1): the login accepts the seeded employees with any password.
 * Sign-up is disabled, so only seeded accounts can sign in; their stored hash is never compared.
 */
async function acceptAnyPassword(): Promise<boolean> {
  return true;
}

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    password: { verify: acceptAnyPassword },
  },
  user: {
    additionalFields: {
      role: {
        type: [...userRoles],
        required: true,
        defaultValue: "employee",
        input: false,
      },
    },
  },
  plugins: [nextCookies()],
});

export type Auth = typeof auth;
