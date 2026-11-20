import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { findCurrentUser } from "@/modules/identity";

async function RedirectWhenSignedIn() {
  if (await findCurrentUser()) {
    redirect("/");
  }
  return null;
}

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <RedirectWhenSignedIn />
      </Suspense>
      {children}
    </>
  );
}
