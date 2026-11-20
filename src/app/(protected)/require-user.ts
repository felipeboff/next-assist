import "server-only";
import { redirect } from "next/navigation";
import { findCurrentUser, type CurrentUser } from "@/modules/identity";

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
