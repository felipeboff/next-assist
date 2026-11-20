import { CheckCheck } from "lucide-react";
import { activityTime } from "@/modules/conversations/domain/activity-time";
import { statusLineOf, type ConsoleConversation } from "@/modules/conversations/domain/console-list";
import { consoleTexts, statusLineText } from "@/modules/conversations/presentation/conversation-texts";
import { monthName } from "@/shared/presentation/format-date";
import { Avatar, CountBadge, Icon, Stack, StatusLabel, Text } from "@/shared/presentation/ui";

function activityLabel(at: Date, now: Date): string {
  const time = activityTime(at, now);
  switch (time.kind) {
    case "now":
      return consoleTexts.now;
    case "today":
      return `${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(2, "0")}`;
    case "yesterday":
      return consoleTexts.yesterday.toLowerCase();
    case "date":
      return `${String(time.day).padStart(2, "0")} ${monthName(time.month)}`;
  }
}

export function ConversationListItem({
  conversation,
  analystId,
  now,
}: {
  conversation: ConsoleConversation;
  analystId: string;
  now: Date;
}) {
  const status = statusLineText(statusLineOf(conversation, analystId, now));
  const unread = conversation.unread > 0;
  const { preview } = conversation;

  return (
    <Stack direction="row" gap="md" align="start">
      <Avatar name={conversation.employee.name} size="lg" online={conversation.employee.online} />
      <Stack gap="none" grow>
        <Stack direction="row" justify="between" align="baseline" gap="sm">
          <Text as="span" size="md" weight="medium" truncate>
            {conversation.employee.name}
          </Text>
          <Text
            as="span"
            size="xs"
            tone={unread ? "primary" : "muted"}
            weight={unread ? "medium" : "regular"}
            nowrap
            tabular
          >
            {activityLabel(conversation.lastActivityAt, now)}
          </Text>
        </Stack>
        <Stack direction="row" justify="between" align="center" gap="sm">
          {conversation.typing ? (
            <Text as="span" size="sm" tone="success" italic>
              {consoleTexts.typing}
            </Text>
          ) : (
            <Stack direction="row" align="center" gap="xs" grow>
              {preview?.from === "agent" ? <Icon icon={CheckCheck} size="sm" tone="primary" /> : null}
              <Text as="span" size="sm" tone="muted" truncate>
                {preview ? `${preview.from === "agent" ? consoleTexts.agentPrefix : ""}${preview.text}` : ""}
              </Text>
            </Stack>
          )}
          <CountBadge count={conversation.unread} label={consoleTexts.unread} />
        </Stack>
        <StatusLabel tone={status.tone} size="xs">
          {status.text}
        </StatusLabel>
      </Stack>
    </Stack>
  );
}
