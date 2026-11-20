import {
  Box,
  Brand,
  Heading,
  MessageBubble,
  Stack,
  Stat,
  StatGroup,
  StatusDot,
  Tag,
  Text,
} from "@/shared/presentation/ui";

export function LoginShowcase() {
  return (
    <Stack fillHeight justify="between" gap="5xl">
      <Brand tone="on-ink" />

      <Stack gap="3xl">
        <Stack gap="lg">
          <Text size="xs" tone="on-ink-subtle">
            Service desk de TI da Nexo
          </Text>
          <Heading level={2} size="display-lg" tone="on-ink" measure="lg">
            Seu problema de TI, resolvido em uma conversa.
          </Heading>
          <Text size="lg" tone="on-ink-muted" measure="md">
            Descreva o que está acontecendo. O assistente consulta seus chamados, busca na central de ajuda e
            chama um analista quando precisa.
          </Text>
        </Stack>

        <Box
          surface="ink-raised"
          border="ink-line"
          radius="xl"
          padding="lg"
          width="card"
          centered
          aria-hidden
        >
          <Stack gap="md">
            <MessageBubble from="user" inverse>
              Meu notebook não conecta na VPN. Erro 809.
            </MessageBubble>
            <Stack gap="sm" align="start">
              <Stack direction="row" gap="sm" align="baseline" wrap>
                <Text as="span" size="xs" weight="semibold" tone="on-ink-soft">
                  Nexo Assist
                </Text>
                <Text as="span" size="xs" tone="on-ink-faint">
                  consultou seus chamados · criou um chamado
                </Text>
              </Stack>
              <MessageBubble from="assistant" inverse>
                Pronto: abri o chamado com prioridade alta. Um analista fala com você em até 4 h úteis.
              </MessageBubble>
              <Tag dot="warning">
                <Text as="span" size="2xs" weight="semibold">
                  INC-20517
                </Text>
                <Text as="span" size="2xs" tone="muted">
                  Rede e VPN · Alta · em até 4 h
                </Text>
              </Tag>
            </Stack>
          </Stack>
        </Box>
      </Stack>

      <StatGroup label="O service desk em números">
        <Stat value="8 s" label="primeira resposta, em média" />
        <Stat value="72%" label="resolvidos sem fila" />
        <Stat value="6" label="analistas online agora" indicator={<StatusDot tone="success" />} />
      </StatGroup>
    </Stack>
  );
}
