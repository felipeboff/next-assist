"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useIdentityDependencies } from "@/modules/identity/presentation/identity-dependencies";

/** Signs out and goes to the login page. */
export function useSignOut(): { signOut: () => void; pending: boolean } {
  const { signOut } = useIdentityDependencies();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return {
    pending,
    signOut: () =>
      startTransition(async () => {
        await signOut();
        router.replace("/login");
        router.refresh();
      }),
  };
}
