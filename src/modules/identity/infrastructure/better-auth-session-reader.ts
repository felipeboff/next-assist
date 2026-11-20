import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import type { SessionReader } from "@/modules/identity/application/ports/session-reader";
import type { CurrentUser } from "@/modules/identity/domain/current-user";
import { auth } from "@/modules/identity/infrastructure/better-auth";

export function createBetterAuthSessionReader(): SessionReader {
  const readCurrentUser = cache(async (): Promise<CurrentUser | null> => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return null;
    }
    const { id, name, email, role } = session.user;
    return { id, name, email, role };
  });

  return { readCurrentUser };
}
