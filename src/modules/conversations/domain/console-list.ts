import { confidencePercent } from "@/modules/conversations/domain/agent-reply";
import type { ConversationStatus } from "@/modules/conversations/domain/handoff";
import { normalizeForMatch } from "@/modules/conversations/domain/text-match";
import { MINUTE_MS } from "@/shared/domain/local-time";

/** Why the agent handed the conversation over (Annex A). */
export type TransferReason = "employee-request" | "critical" | "overdue" | "low-confidence";

export type ConsoleEmployee = Readonly<{ email: string; name: string; department: string; online: boolean }>;

export type ConsoleAnalyst = Readonly<{ id: string; name: string; team: string }>;

export type ConsoleConversation = Readonly<{
  id: string;
  employee: ConsoleEmployee;
  status: ConversationStatus;
  attendant: Readonly<{ id: string; name: string }> | null;
  transfer: Readonly<{
    reason: TransferReason;
    confidence: number | null;
    team: string;
    at: Date;
    /** When an analyst must first answer. */
    respondBy: Date;
  }> | null;
  ticketCode: string | null;
  lastActivityAt: Date;
  preview: Readonly<{ from: "employee" | "agent" | "analyst"; text: string }> | null;
  typing: boolean;
  unread: number;
}>;

export const consoleFilters = ["all", "for-you", "with-agent", "mine"] as const;
export type ConsoleFilter = (typeof consoleFilters)[number];

export function matchesFilter(
  conversation: ConsoleConversation,
  filter: ConsoleFilter,
  analystId: string,
): boolean {
  switch (filter) {
    case "all":
      return true;
    case "for-you":
      return conversation.status === "waiting-analyst";
    case "with-agent":
      return conversation.status === "with-agent";
    case "mine":
      return conversation.status === "with-analyst" && conversation.attendant?.id === analystId;
  }
}

export function filterConversations<T extends ConsoleConversation>(
  conversations: readonly T[],
  filter: ConsoleFilter,
  analystId: string,
): T[] {
  return conversations.filter((conversation) => matchesFilter(conversation, filter, analystId));
}

export function countByFilter(
  conversations: readonly ConsoleConversation[],
  analystId: string,
): Record<ConsoleFilter, number> {
  return Object.fromEntries(
    consoleFilters.map((filter) => [filter, filterConversations(conversations, filter, analystId).length]),
  ) as Record<ConsoleFilter, number>;
}

/** Employee name or ticket code containing the term, ignoring case and accents. */
export function searchConversations<T extends ConsoleConversation>(
  conversations: readonly T[],
  term: string,
): T[] {
  const needle = normalizeForMatch(term);
  if (!needle) {
    return [...conversations];
  }
  return conversations.filter((conversation) =>
    [conversation.employee.name, conversation.ticketCode ?? ""].some((field) =>
      normalizeForMatch(field).includes(needle),
    ),
  );
}

function attentionGroup(status: ConversationStatus): number {
  if (status === "waiting-analyst" || status === "with-analyst") {
    return 0;
  }
  return status === "with-agent" ? 1 : 2;
}

/** Conversations that need a person first, then the agent's, then the finished ones; newest first. */
export function orderConversations<T extends ConsoleConversation>(conversations: readonly T[]): T[] {
  return [...conversations].sort((a, b) => {
    const group = attentionGroup(a.status) - attentionGroup(b.status);
    return group !== 0 ? group : b.lastActivityAt.getTime() - a.lastActivityAt.getTime();
  });
}

export type StatusLine =
  | Readonly<{ kind: "transferred-ticket"; code: string }>
  | Readonly<{ kind: "transferred-contact"; minutes: number }>
  | Readonly<{ kind: "agent-asked-help"; confidencePercent: number }>
  | Readonly<{ kind: "agent-attending" }>
  | Readonly<{ kind: "you-attending" }>
  | Readonly<{ kind: "analyst-attending"; name: string }>
  | Readonly<{ kind: "resolved" }>
  | Readonly<{ kind: "closed" }>;

/** The line under a conversation in the list: why it is where it is. */
export function statusLineOf(conversation: ConsoleConversation, analystId: string, now: Date): StatusLine {
  switch (conversation.status) {
    case "waiting-analyst": {
      const { transfer, ticketCode } = conversation;
      if (transfer?.reason === "low-confidence" && transfer.confidence !== null) {
        return { kind: "agent-asked-help", confidencePercent: confidencePercent(transfer.confidence) };
      }
      if (ticketCode) {
        return { kind: "transferred-ticket", code: ticketCode };
      }
      const left = transfer ? transfer.respondBy.getTime() - now.getTime() : 0;
      return { kind: "transferred-contact", minutes: Math.max(0, Math.ceil(left / MINUTE_MS)) };
    }
    case "with-analyst":
      return conversation.attendant?.id === analystId
        ? { kind: "you-attending" }
        : { kind: "analyst-attending", name: conversation.attendant?.name ?? "" };
    case "with-agent":
      return { kind: "agent-attending" };
    case "resolved-by-agent":
      return { kind: "resolved" };
    case "closed":
      return { kind: "closed" };
  }
}
