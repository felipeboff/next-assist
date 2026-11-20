import type { AnalystConsole } from "@/modules/conversations/application/ports/analyst-console";
import type { TicketDesk } from "@/modules/conversations/application/ports/ticket-desk";
import type { ConsoleAnalyst, ConsoleConversation } from "@/modules/conversations/domain/console-list";
import type { ConsoleEntry, ConsoleThread } from "@/modules/conversations/domain/console-thread";
import {
  InvalidHandoffError,
  applyHandoff,
  type HandoffAction,
} from "@/modules/conversations/domain/handoff";

/** A sample conversation, and what its employee answers to the analyst's first message. */
export type SampleConversation = Readonly<{
  conversation: ConsoleConversation;
  entries: readonly ConsoleEntry[];
  scriptedAnswer: string | null;
}>;

export class ConversationNotFoundError extends Error {
  constructor(readonly conversationId: string) {
    super(`Conversation ${conversationId} not found`);
    this.name = "ConversationNotFoundError";
  }
}

type Options = Readonly<{
  conversations: readonly SampleConversation[];
  ticketDesk: Pick<TicketDesk, "startService">;
  clock: () => Date;
  /** How long a sample employee takes to answer the analyst. */
  answerDelayMs: number;
}>;

type Stored = { conversation: ConsoleConversation; entries: ConsoleEntry[]; scriptedAnswer: string | null };

/** The analyst console kept in memory (AD-003): sample conversations that forget on reload. */
export function createInMemoryAnalystConsole({
  conversations,
  ticketDesk,
  clock,
  answerDelayMs,
}: Options): AnalystConsole {
  const store = new Map<string, Stored>(
    conversations.map((sample) => [
      sample.conversation.id,
      {
        conversation: sample.conversation,
        entries: [...sample.entries],
        scriptedAnswer: sample.scriptedAnswer,
      },
    ]),
  );
  const listeners = new Set<() => void>();
  let sequence = 0;
  const nextId = () => `console-entry-${++sequence}`;

  function stored(conversationId: string): Stored {
    const found = store.get(conversationId);
    if (!found) {
      throw new ConversationNotFoundError(conversationId);
    }
    return found;
  }

  function threadOf(item: Stored): ConsoleThread {
    return { conversation: item.conversation, entries: [...item.entries] };
  }

  function notify(): void {
    listeners.forEach((listener) => listener());
  }

  function handOff(analyst: ConsoleAnalyst, conversationId: string, action: HandoffAction): Stored {
    const item = stored(conversationId);
    const { conversation } = item;
    const next = applyHandoff(
      { status: conversation.status, attendantId: conversation.attendant?.id ?? null },
      action,
      analyst.id,
    );
    const now = clock();
    const event = { "take-over": "taken-over", "hand-back": "handed-back", close: "closed" } as const;
    item.entries.push({
      kind: "event",
      id: nextId(),
      event: event[action],
      actor: action === "hand-back" && conversation.status === "waiting-analyst" ? null : analyst.name,
      at: now,
    });
    item.conversation = {
      ...conversation,
      status: next.status,
      attendant: next.attendantId ? { id: analyst.id, name: analyst.name } : null,
      unread: action === "take-over" ? 0 : conversation.unread,
      lastActivityAt: now,
    };
    return item;
  }

  return {
    async list() {
      return [...store.values()].map((item) => item.conversation);
    },

    async thread(conversationId) {
      return threadOf(stored(conversationId));
    },

    async takeOver(analyst, conversationId) {
      const { conversation } = stored(conversationId);
      // Checked first, committed last: a ticket system failure leaves the conversation waiting (AC 53).
      applyHandoff(
        { status: conversation.status, attendantId: conversation.attendant?.id ?? null },
        "take-over",
        analyst.id,
      );
      if (conversation.ticketCode) {
        await ticketDesk.startService(conversation.ticketCode);
      }
      const item = handOff(analyst, conversationId, "take-over");
      notify();
      return threadOf(item);
    },

    async handBack(analyst, conversationId) {
      const item = handOff(analyst, conversationId, "hand-back");
      notify();
      return threadOf(item);
    },

    async close(analyst, conversationId) {
      const item = handOff(analyst, conversationId, "close");
      notify();
      return threadOf(item);
    },

    async reply(analyst, conversationId, text) {
      const item = stored(conversationId);
      const message = text.trim();
      const { conversation } = item;
      if (conversation.status !== "with-analyst" || conversation.attendant?.id !== analyst.id) {
        throw new InvalidHandoffError("take-over", conversation.status);
      }
      if (!message) {
        return threadOf(item);
      }
      const now = clock();
      item.entries.push({
        kind: "analyst",
        id: nextId(),
        text: message,
        analyst: { name: analyst.name, team: analyst.team },
        at: now,
      });
      item.conversation = {
        ...conversation,
        preview: { from: "analyst", text: message },
        lastActivityAt: now,
      };

      const answer = item.scriptedAnswer;
      if (answer) {
        item.scriptedAnswer = null;
        setTimeout(() => {
          const at = clock();
          item.entries.push({ kind: "employee", id: nextId(), text: answer, at });
          item.conversation = {
            ...item.conversation,
            preview: { from: "employee", text: answer },
            lastActivityAt: at,
          };
          notify();
        }, answerDelayMs);
      }
      notify();
      return threadOf(item);
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
