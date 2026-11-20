import { LoginForm } from "@/modules/identity/presentation/components/login-form";
import { LoginShowcase } from "@/modules/identity/presentation/components/login-showcase";
import { SERVICE_DESK_EXTENSION } from "@/modules/identity/presentation/login-texts";
import { Box, Brand, Link, SplitLayout, Stack, Text } from "@/shared/presentation/ui";

export function LoginScreen() {
  return (
    <SplitLayout
      aside={<LoginShowcase />}
      asideLabel="Sobre o Nexo Assist"
      brand={<Brand />}
      header={
        <Stack direction="row" gap="sm" align="baseline" wrap justify="end">
          <Text as="span" size="xs" tone="muted">
            Problema para entrar?
          </Text>
          <Link href={`tel:${SERVICE_DESK_EXTENSION}`} size="xs" weight="semibold">
            Ligue no ramal {SERVICE_DESK_EXTENSION}
          </Link>
        </Stack>
      }
      footer={
        <Stack direction="row" justify="between" gap="md" wrap>
          <Text size="2xs" tone="muted">
            © 2026 Nexo · Service desk de TI
          </Text>
          <Text size="2xs" tone="muted">
            Privacidade e uso de dados
          </Text>
        </Stack>
      }
    >
      <Box width="form">
        <LoginForm />
      </Box>
    </SplitLayout>
  );
}
