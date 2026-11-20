import "server-only";
import { redirect } from "next/navigation";
import { findCurrentUser, type CurrentUser, type UserRole } from "@/modules/identity";

/** Each role's home: employees talk to the agent, analysts work the console. */
const homeOf: Record<UserRole, string> = { employee: "/", analyst: "/console" };

/**
 * The real session check of the protected area. Every page under (protected) calls it (or reads
 * through a module that checks the session itself): the layout guard only redirects, it does not
 * stop a page from rendering (Next.js docs, "Layouts and auth checks").
 */
export async function requireUser(): Promise<CurrentUser> {
  const user = await findCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/** Like `requireUser`, and sends a user of another role to their own home. */
export async function requireRole(role: UserRole): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.role !== role) {
    redirect(homeOf[user.role]);
  }
  return user;
}
