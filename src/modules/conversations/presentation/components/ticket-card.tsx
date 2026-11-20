import type { TicketSnapshot } from "@/modules/conversations/domain/ticket-snapshot";
import { ticketCardTexts } from "@/modules/conversations/presentation/conversation-texts";
import { categoryPath, priorityText, priorityTone, statusText, statusTone } from "@/modules/tickets/client";
import { formatDayMonthTime, formatDaysAgo } from "@/shared/presentation/format-date";
import { Box, DescriptionList, Divider, Stack, StatusLabel, Text } from "@/shared/presentation/ui";

/** A ticket as the agent shows it in the chat. */
export function TicketCard({ ticket, now }: { ticket: TicketSnapshot; now: Date }) {
  return (
    <Box surface="canvas" border="line-soft" radius="xl" shadow="card" paddingX="lg" paddingY="lg">
      <Stack gap="md">
        <Stack gap="xs">
          <Stack direction="row" justify="between" align="center" gap="md">
            <Text as="span" size="sm" tone="muted">
              {ticketCardTexts.ticket} · {ticket.code}
            </Text>
            <StatusLabel tone={statusTone[ticket.status]} size="sm">
              {statusText[ticket.status]}
            </StatusLabel>
          </Stack>
          <Text size="xl" weight="semibold">
            {ticket.title}
          </Text>
          <Text size="sm" tone="secondary">
            {ticket.description}
          </Text>
        </Stack>
        <Divider tone="line-subtle" />
        <DescriptionList
          columns={4}
          items={[
            { label: ticketCardTexts.category, value: categoryPath(ticket.category, ticket.subcategory) },
            {
              label: ticketCardTexts.priority,
              value: (
                <StatusLabel tone={priorityTone[ticket.priority]} size="md" text="plain">
                  {priorityText[ticket.priority]}
                </StatusLabel>
              ),
            },
            { label: ticketCardTexts.openedAt, value: formatDayMonthTime(ticket.openedAt) },
            {
              label: ticketCardTexts.updatedAt,
              value: (
                <Text as="span" size="md" tone={ticket.overdue ? "warning" : "default"}>
                  {formatDaysAgo(ticket.updatedAt, now)}{" "}
                  <Text as="span" size="sm" tone="muted">
                    · {ticket.overdue ? ticketCardTexts.overdue : ticketCardTexts.onTime}
                  </Text>
                </Text>
              ),
            },
          ]}
        />
      </Stack>
    </Box>
  );
}
