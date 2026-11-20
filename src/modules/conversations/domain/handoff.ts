export const conversationStatuses = [
  "with-agent",
  "waiting-analyst",
  "with-analyst",
  "resolved-by-agent",
  "closed",
] as const;
export type ConversationStatus = (typeof conversationStatuses)[number];

export type HandoffAction = "take-over" | "hand-back" | "close";

export type HandoffState = Readonly<{ status: ConversationStatus; attendantId: string | null }>;

export class InvalidHandoffError extends Error {
  constructor(
    readonly action: HandoffAction,
    readonly from: ConversationStatus,
  ) {
    super(`Cannot ${action} a conversation that is ${from}`);
    this.name = "InvalidHandoffError";
  }
}

/**
 * The hand-over rules of the console. An analyst takes over a conversation waiting for one or
 * still with the agent; hands back one that waits or that they attend; closes only one they
 * attend. Anything else is rejected.
 */
export function applyHandoff(state: HandoffState, action: HandoffAction, analystId: string): HandoffState {
  const attendedByMe = state.status === "with-analyst" && state.attendantId === analystId;

  if (action === "take-over" && (state.status === "waiting-analyst" || state.status === "with-agent")) {
    return { status: "with-analyst", attendantId: analystId };
  }
  if (action === "hand-back" && (state.status === "waiting-analyst" || attendedByMe)) {
    return { status: "with-agent", attendantId: null };
  }
  if (action === "close" && attendedByMe) {
    return { status: "closed", attendantId: analystId };
  }
  throw new InvalidHandoffError(action, state.status);
}
