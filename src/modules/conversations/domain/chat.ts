import type { AgentReply } from "@/modules/conversations/domain/agent-reply";

export type ChatEmployee = Readonly<{ email: string; name: string }>;

export type ChatEntry =
  | Readonly<{ kind: "employee"; id: string; text: string; at: Date }>
  | Readonly<{ kind: "agent"; id: string; reply: AgentReply; at: Date }>
  | Readonly<{ kind: "event"; id: string; event: "transferred"; team: string; at: Date }>;

/** With the agent, or waiting for an analyst: then the agent stays silent (Annex A). */
export type ChatState = "with-agent" | "waiting-analyst";

export type ChatConversation = Readonly<{
  state: ChatState;
  entries: readonly ChatEntry[];
  /** Messages the employee sent in this session, counted against the limit. */
  sentCount: number;
  /** The reply whose question or ticket list the agent is waiting on; the others are settled. */
  awaitingReplyId: string | null;
  /** What an empty conversation offers to start with. */
  suggestions: readonly string[];
}>;

/** A command on a reply that no longer accepts it: answered, picked, settled or superseded. */
export class StaleChatActionError extends Error {
  constructor(readonly entryId: string) {
    super(`The reply ${entryId} no longer accepts this action`);
    this.name = "StaleChatActionError";
  }
}
