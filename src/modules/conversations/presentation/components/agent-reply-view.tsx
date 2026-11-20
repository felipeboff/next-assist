"use client";

import { Check } from "lucide-react";
import type { ReactNode } from "react";
import type { AgentReply } from "@/modules/conversations/domain/agent-reply";
import type { DraftEdit } from "@/modules/conversations/domain/ticket-draft";
import { DecisionDetail } from "@/modules/conversations/presentation/components/decision-detail";
import { TicketCard } from "@/modules/conversations/presentation/components/ticket-card";
import {
  TicketDraftCard,
  TicketUpdateCard,
} from "@/modules/conversations/presentation/components/ticket-draft-card";
import { TicketPicker } from "@/modules/conversations/presentation/components/ticket-picker";
import { AGENT_NAME, decisionTexts } from "@/modules/conversations/presentation/conversation-texts";
import { Box, ChoiceChips, Disclosure, Icon, Stack, Text } from "@/shared/presentation/ui";

export type AgentReplyHandlers = {
  /** This reply's question or ticket list is the one the agent waits on. */
  interactive: boolean;
  busy: boolean;
  shortcut: { glyphs: string; spoken: string };
  onAnswer: (option: string) => void;
  onPick: (code: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onEdit: (edit: DraftEdit) => Promise<boolean>;
};

/** "Nexo Assist ✓ consultou seus chamados ✓ ..." - the toggle that opens the decision detail. */
function ActionsRow({ reply }: { reply: AgentReply }) {
  return (
    <Stack direction="row" align="center" gap="md" wrap>
      <Text as="span" size="sm" weight="semibold">
        {AGENT_NAME}
      </Text>
      {reply.decision.actions.map((action) => (
        <Stack key={action.label} direction="row" align="center" gap="xs">
          <Icon icon={Check} size="xs" tone="muted" />
          <Text as="span" size="sm" tone="muted">
            {action.label}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}

function ReplyCard({ children }: { children: ReactNode }) {
  return (
    <Box
      surface="canvas"
      border="line-soft"
      radius="xl"
      shadow="card"
      paddingX="lg"
      paddingY="md"
      width="reply"
    >
      {children}
    </Box>
  );
}

export function AgentReplyView({
  reply,
  now,
  handlers,
}: {
  reply: AgentReply;
  now: Date;
  handlers: AgentReplyHandlers;
}) {
  const { interactive, busy, shortcut, onAnswer, onPick, onConfirm, onCancel, onEdit } = handlers;
  return (
    <Stack gap="sm" align="stretch">
      <Disclosure summary={<ActionsRow reply={reply} />} hint={decisionTexts.showDetail}>
        <Stack paddingTop="sm">
          <DecisionDetail decision={reply.decision} />
        </Stack>
      </Disclosure>
      {reply.parts.map((part, index) => {
        const key = `${part.kind}-${index}`;
        switch (part.kind) {
          case "text":
            return (
              <ReplyCard key={key}>
                <Text size="md">{part.text}</Text>
              </ReplyCard>
            );
          case "question":
            return (
              <ReplyCard key={key}>
                <Stack gap="md">
                  <Text size="md">{part.text}</Text>
                  {part.prompt ? (
                    <Text size="md" weight="semibold">
                      {part.prompt}
                    </Text>
                  ) : null}
                  <ChoiceChips
                    label={part.prompt ?? part.text}
                    options={part.options}
                    chosen={part.chosen}
                    disabled={!interactive || busy}
                    onChoose={onAnswer}
                  />
                </Stack>
              </ReplyCard>
            );
          case "ticket-picker":
            return (
              <TicketPicker
                key={key}
                tickets={part.tickets}
                picked={part.picked}
                disabled={!interactive || busy}
                onPick={onPick}
              />
            );
          case "ticket":
            return <TicketCard key={key} ticket={part.ticket} now={now} />;
          case "ticket-draft":
            return (
              <TicketDraftCard
                key={key}
                draft={part.draft}
                now={now}
                busy={busy}
                shortcut={shortcut}
                onConfirm={onConfirm}
                onCancel={onCancel}
                onEdit={onEdit}
              />
            );
          case "ticket-update":
            return (
              <TicketUpdateCard
                key={key}
                draft={part.draft}
                busy={busy}
                shortcut={shortcut}
                onConfirm={onConfirm}
                onCancel={onCancel}
              />
            );
        }
      })}
    </Stack>
  );
}
