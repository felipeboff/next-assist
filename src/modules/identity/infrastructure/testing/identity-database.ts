import { sql } from "drizzle-orm";
import type { Database } from "@/shared/infrastructure/db/client";

export async function resetIdentityTables(db: Database): Promise<void> {
  await db.execute(sql`truncate table "user", session, account, verification restart identity cascade`);
}

/** Turns the Set-Cookie headers of a BetterAuth response into the Cookie header of the next request. */
export function cookieHeaderFrom(response: Response): string {
  return response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(";")[0])
    .join("; ");
}
