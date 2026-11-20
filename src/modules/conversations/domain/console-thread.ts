import type { AgentDecision } from "@/modules/conversations/domain/agent-reply";
import type { ConsoleConversation } from "@/modules/conversations/domain/console-list";

export type ConsoleEventKind = "transferred" | "taken-over" | "handed-back" | "closed";

export type ConsoleEntry =
  | Readonly<{ kind: "employee"; id: string; text: string; at: Date }>
  | Readonly<{ kind: "agent"; id: string; text: string; decision: AgentDecision; at: Date }>
  | Readonly<{
      kind: "analyst";
      id: string;
      text: string;
      analyst: Readonly<{ name: string; team: string }>;
      at: Date;
    }>
  | Readonly<{
      kind: "event";
      id: string;
      event: ConsoleEventKind;
      /** The team for a transfer; the analyst for the others, or null when nobody had taken over. */
      actor: string | null;
      at: Date;
    }>;

export type ConsoleThread = Readonly<{ conversation: ConsoleConversation; entries: readonly ConsoleEntry[] }>;

export function lastEventOf(thread: ConsoleThread): Extract<ConsoleEntry, { kind: "event" }> | null {
  const events = thread.entries.filter((entry) => entry.kind === "event");
  return events.at(-1) ?? null;
}
