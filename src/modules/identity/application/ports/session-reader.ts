import type { CurrentUser } from "@/modules/identity/domain/current-user";

export interface SessionReader {
  readCurrentUser(): Promise<CurrentUser | null>;
}
