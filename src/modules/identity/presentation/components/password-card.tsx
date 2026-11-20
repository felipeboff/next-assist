"use client";

import { KeyRound, Mail, RotateCcwKey } from "lucide-react";
import { useState } from "react";
import { useIdentityDependencies } from "@/modules/identity/presentation/identity-dependencies";
import { profileTexts } from "@/modules/identity/presentation/profile-texts";
import { Alert, Box, Button, Icon, Stack, Text } from "@/shared/presentation/ui";

type ResetState = "idle" | "sending" | "sent" | "failed";

/** The password: how old it is, and a reset link sent to the corporate e-mail (mocked, AD-003). */
export function PasswordCard({ email, age }: { email: string; age: string }) {
  const { requestPasswordReset } = useIdentityDependencies();
  const [state, setState] = useState<ResetState>("idle");

  async function reset() {
    setState("sending");
    try {
      await requestPasswordReset(email);
      setState("sent");
    } catch {
      setState("failed");
    }
  }

  return (
    <Box surface="canvas" border="line-soft" radius="xl" shadow="card" clip>
      <Box paddingX="2xl" paddingY="xl">
        <Stack direction="row" align="center" gap="lg">
          <Box surface="subtle" radius="full" padding="sm">
            <Icon icon={KeyRound} size="md" tone="secondary" />
          </Box>
          <Stack gap="none" grow>
            <Text size="md" weight="semibold">
              {profileTexts.password}
            </Text>
            <Text size="sm" tone="muted">
              {age}
            </Text>
          </Stack>
          <Button
            variant="secondary"
            iconStart={RotateCcwKey}
            loading={state === "sending"}
            loadingLabel={profileTexts.sending}
            onClick={reset}
          >
            {state === "sent" ? profileTexts.resend : profileTexts.reset}
          </Button>
        </Stack>
      </Box>
      {state === "failed" ? (
        <Box paddingX="2xl" paddingY="sm">
          <Alert>{profileTexts.resetFailed}</Alert>
        </Box>
      ) : null}
      <Box surface="subtle" paddingX="2xl" paddingY="md">
        <Stack direction="row" align="center" gap="sm">
          <Icon icon={Mail} size="sm" tone={state === "sent" ? "success" : "muted"} />
          <Text
            size="xs"
            tone={state === "sent" ? "success" : "muted"}
            role={state === "sent" ? "status" : undefined}
          >
            {state === "sent" ? profileTexts.sent(email) : profileTexts.willSend(email)}
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}
