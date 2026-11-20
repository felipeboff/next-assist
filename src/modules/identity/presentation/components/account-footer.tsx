"use client";

import { LogOut } from "lucide-react";
import { useSignOut } from "@/modules/identity/presentation/use-sign-out";
import { Avatar, Button, Stack, Text } from "@/shared/presentation/ui";

/** Who is signed in, at the bottom of the sidebar, and the way out. */
export function AccountFooter({ name, email }: { name: string; email: string }) {
  const { signOut, pending } = useSignOut();
  return (
    <Stack gap="sm">
      <Stack direction="row" align="center" gap="sm">
        <Avatar name={name} size="sm" tone="blue" />
        <Stack gap="none">
          <Text size="sm" weight="semibold">
            {name}
          </Text>
          <Text size="2xs" tone="muted" truncate>
            {email}
          </Text>
        </Stack>
      </Stack>
      <Stack direction="row">
        <Button variant="ghost" size="sm" iconStart={LogOut} loading={pending} onClick={signOut}>
          Sair
        </Button>
      </Stack>
    </Stack>
  );
}
