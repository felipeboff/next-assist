import { firstNameOf, type CurrentUser } from "@/modules/identity/domain/current-user";
import { SignOutButton } from "@/modules/identity/presentation/components/sign-out-button";
import { Box, Brand, Heading, Stack, Text } from "@/shared/presentation/ui";

export function WelcomeScreen({ user }: { user: CurrentUser }) {
  return (
    <Box as="main" paddingX="2xl" paddingY="5xl">
      <Box width="form" centered>
        <Stack gap="4xl">
          <Brand />
          <Stack gap="2xl" align="start">
            <Stack gap="md">
              <Heading level={1} size="display-md">
                Olá, {firstNameOf(user)}.
              </Heading>
              <Text size="md" tone="muted" measure="md">
                Você entrou como {user.email}. O atendimento com o Nexo Assist chega na próxima etapa.
              </Text>
            </Stack>
            <SignOutButton />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
