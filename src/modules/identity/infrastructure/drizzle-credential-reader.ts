import { and, eq } from "drizzle-orm";
import type { CredentialReader } from "@/modules/identity/application/ports/credential-reader";
import { account } from "@/modules/identity/infrastructure/identity.schema";
import type { Database } from "@/shared/infrastructure/db/client";

export function createDrizzleCredentialReader(db: Database): CredentialReader {
  return {
    async passwordChangedAt(userId) {
      const [row] = await db
        .select({ updatedAt: account.updatedAt })
        .from(account)
        .where(and(eq(account.userId, userId), eq(account.providerId, "credential")))
        .limit(1);
      return row?.updatedAt ?? null;
    },
  };
}
