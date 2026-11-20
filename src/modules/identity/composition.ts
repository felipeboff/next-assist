import "server-only";
import { toNextJsHandler } from "better-auth/next-js";
import type { CurrentUser } from "@/modules/identity/domain/current-user";
import { auth } from "@/modules/identity/infrastructure/better-auth";
import { createBetterAuthSessionReader } from "@/modules/identity/infrastructure/better-auth-session-reader";
import { createDrizzleCredentialReader } from "@/modules/identity/infrastructure/drizzle-credential-reader";
import { db } from "@/shared/infrastructure/db/client";

const sessionReader = createBetterAuthSessionReader();
const credentialReader = createDrizzleCredentialReader(db);

export function findCurrentUser(): Promise<CurrentUser | null> {
  return sessionReader.readCurrentUser();
}

export function findPasswordChangedAt(userId: string): Promise<Date | null> {
  return credentialReader.passwordChangedAt(userId);
}

export const authRouteHandlers = toNextJsHandler(auth);
