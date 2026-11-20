import { Check } from "lucide-react";
import {
  confidenceLevel,
  confidencePercent,
  type AgentDecision,
} from "@/modules/conversations/domain/agent-reply";
import {
  confidenceText,
  confidenceTone,
  decisionTexts,
} from "@/modules/conversations/presentation/conversation-texts";
import { Box, DescriptionList, Icon, Stack, StatusLabel, Text } from "@/shared/presentation/ui";

/** What the agent understood, did, how sure it was and why (AD-002). */
export function DecisionDetail({ decision }: { decision: AgentDecision }) {
  const level = confidenceLevel(decision.confidence);
  return (
    <Box surface="subtle" border="line-soft" radius="lg" paddingX="lg" paddingY="md" width="reply">
      <Stack gap="md">
        <DescriptionList
          columns={2}
          items={[
            { label: decisionTexts.understood, value: <Text size="sm">{decision.understood}</Text> },
            {
              label: decisionTexts.confidence,
              value: (
                <StatusLabel tone={confidenceTone[level]} size="sm">
                  {confidencePercent(decision.confidence)}% · {confidenceText[level]}
                </StatusLabel>
              ),
            },
          ]}
        />
        <Stack gap="xs">
          <Text size="xs" tone="muted">
            {decisionTexts.actions}
          </Text>
          {decision.actions.length === 0 ? (
            <Text size="sm" tone="secondary">
              {decisionTexts.noActions}
            </Text>
          ) : (
            <Stack as="ul" gap="xs">
              {decision.actions.map((action) => (
                <Stack as="li" key={action.label} direction="row" gap="sm" align="start">
                  <Box paddingY="xs">
                    <Icon icon={Check} size="xs" tone="success" />
                  </Box>
                  <Text size="sm">
                    <Text as="strong" size="sm" weight="medium">
                      {action.label}
                    </Text>{" "}
                    <Text as="span" size="sm" tone="secondary">
                      — {action.outcome}
                    </Text>
                  </Text>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
        <Stack gap="xs">
          <Text size="xs" tone="muted">
            {decisionTexts.reason}
          </Text>
          <Text size="sm" tone="secondary">
            {decision.reason}
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
}
