"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useIdentityDependencies } from "@/modules/identity/presentation/identity-dependencies";
import { Button } from "@/shared/presentation/ui";

export function SignOutButton() {
  const { signOut } = useIdentityDependencies();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await signOut();
      router.replace("/login");
      router.refresh();
    });
  }

  return (
    <Button variant="secondary" iconStart={LogOut} loading={isPending} onClick={handleSignOut}>
      Sair
    </Button>
  );
}
