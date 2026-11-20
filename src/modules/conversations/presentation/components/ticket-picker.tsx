"use client";

import { useState } from "react";
import type { TicketSnapshot } from "@/modules/conversations/domain/ticket-snapshot";
import { ticketCardTexts } from "@/modules/conversations/presentation/conversation-texts";
import { statusText, statusTone } from "@/modules/tickets/client";
import { formatDayMonth } from "@/shared/presentation/format-date";
import { RadioList, Stack, StatusLabel, Text } from "@/shared/presentation/ui";

export type TicketPickerProps = {
  tickets: readonly TicketSnapshot[];
  picked: string | null;
  disabled: boolean;
  onPick: (code: string) => void;
};

/** The employee's open tickets to choose from; locked once one is picked. */
export function TicketPicker({ tickets, picked, disabled, onPick }: TicketPickerProps) {
  // Marks the row at once; the agent's answer then confirms it as `picked`.
  const [choice, setChoice] = useState<string | null>(null);
  return (
    <RadioList
      label={ticketCardTexts.pickerLabel}
      value={picked ?? choice}
      disabled={disabled || picked !== null}
      onChange={(code) => {
        setChoice(code);
        onPick(code);
      }}
      items={tickets.map((ticket) => ({
        value: ticket.code,
        content: (
          <Stack direction="row" align="center" gap="lg">
            <Stack direction="row" align="baseline" gap="md" grow>
              <Text as="span" size="sm" tone="muted" nowrap>
                {ticket.code}
              </Text>
              <Text as="span" size="md" truncate>
                {ticket.title}
              </Text>
            </Stack>
            <StatusLabel tone={statusTone[ticket.status]} size="sm" text="plain">
              <Text as="span" size="sm" tone="muted">
                {statusText[ticket.status]}
              </Text>
            </StatusLabel>
            <Text as="span" size="sm" tone="muted" nowrap tabular>
              {formatDayMonth(ticket.openedAt)}
            </Text>
          </Stack>
        ),
      }))}
    />
  );
}
