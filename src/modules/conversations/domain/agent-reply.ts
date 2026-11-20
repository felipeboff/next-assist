import type { TicketDraft, TicketUpdateDraft } from "@/modules/conversations/domain/ticket-draft";
import type { TicketSnapshot } from "@/modules/conversations/domain/ticket-snapshot";

/** One thing the agent did for this reply, and what came out of it. */
export type AgentAction = Readonly<{ label: string; outcome: string }>;

/**
 * Why the reply is what it is (AD-002): what the agent understood, what it did, how sure it was
 * (0 to 1) and why. Every reply carries one, so every reply can be explained.
 */
export type AgentDecision = Readonly<{
  understood: string;
  actions: readonly AgentAction[];
  confidence: number;
  reason: string;
}>;

export type TextPart = Readonly<{ kind: "text"; text: string }>;

/** Text with quick options; `chosen` is the option the employee answered with. */
export type QuestionPart = Readonly<{
  kind: "question";
  text: string;
  prompt: string | null;
  options: readonly string[];
  chosen: string | null;
}>;

export type TicketPickerPart = Readonly<{
  kind: "ticket-picker";
  tickets: readonly TicketSnapshot[];
  picked: string | null;
}>;

export type TicketPart = Readonly<{ kind: "ticket"; ticket: TicketSnapshot }>;

export type TicketDraftPart = Readonly<{ kind: "ticket-draft"; draft: TicketDraft }>;

export type TicketUpdatePart = Readonly<{ kind: "ticket-update"; draft: TicketUpdateDraft }>;

export type AgentPart =
  TextPart | QuestionPart | TicketPickerPart | TicketPart | TicketDraftPart | TicketUpdatePart;

/** The agent reply contract (AD-006): the decision and what the chat renders, in order. */
export type AgentReply = Readonly<{ decision: AgentDecision; parts: readonly AgentPart[] }>;

export type ConfidenceLevel = "high" | "medium" | "low";

export function confidencePercent(confidence: number): number {
  return Math.round(confidence * 100);
}

/** Named from the percentage shown beside it, so "80%" always reads "alta" and "50%" "média". */
export function confidenceLevel(confidence: number): ConfidenceLevel {
  const percent = confidencePercent(confidence);
  if (percent >= 80) {
    return "high";
  }
  return percent >= 50 ? "medium" : "low";
}

/** The reply as plain text, for places that show no cards (the analyst console, previews). */
export function replyText(reply: AgentReply): string {
  return reply.parts
    .flatMap((part) => (part.kind === "text" || part.kind === "question" ? [part.text] : []))
    .join("\n");
}
