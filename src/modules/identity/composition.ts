import "server-only";
import { toNextJsHandler } from "better-auth/next-js";
import type { CurrentUser } from "@/modules/identity/domain/current-user";
import { auth } from "@/modules/identity/infrastructure/better-auth";
import { createBetterAuthSessionReader } from "@/modules/identity/infrastructure/better-auth-session-reader";

const sessionReader = createBetterAuthSessionReader();

export function findCurrentUser(): Promise<CurrentUser | null> {
  return sessionReader.readCurrentUser();
}

export const authRouteHandlers = toNextJsHandler(auth);
