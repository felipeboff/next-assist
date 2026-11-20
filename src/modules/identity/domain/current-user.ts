import type { UserRole } from "@/modules/identity/domain/user-role";

export type CurrentUser = Readonly<{
  id: string;
  name: string;
  email: string;
  role: UserRole;
}>;

export function firstNameOf(user: Pick<CurrentUser, "name">): string {
  const [first] = user.name.trim().split(/\s+/);
  return first || user.name;
}
