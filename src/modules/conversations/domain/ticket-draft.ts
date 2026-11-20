import type {
  TicketCategory,
  TicketKind,
  TicketPriority,
} from "@/modules/conversations/domain/ticket-snapshot";

export const affectedScopes = ["only-me", "my-team", "whole-company", "unknown"] as const;
export type AffectedScope = (typeof affectedScopes)[number];

export type DraftStatus = "awaiting-confirmation" | "created" | "cancelled";

/** A ticket the agent proposes; Annex A: it is created only after the employee confirms. */
export type TicketDraft = Readonly<{
  id: string;
  status: DraftStatus;
  kind: TicketKind;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  affected: AffectedScope;
  respondBy: Date;
  /** The created ticket's code, once confirmed. */
  ticketCode: string | null;
}>;

/** New information for an open ticket, added only after the employee confirms. */
export type TicketUpdateDraft = Readonly<{
  status: DraftStatus;
  ticketCode: string;
  note: string;
}>;

export type DraftEdit = Readonly<{ title: string; description: string }>;

export type DraftEditProblem = "title.required" | "description.required";
export type DraftEditProblems = Partial<Record<"title" | "description", DraftEditProblem>>;

export type DraftEditCheck =
  Readonly<{ ok: true; edit: DraftEdit }> | Readonly<{ ok: false; problems: DraftEditProblems }>;

/** Annex A: every ticket needs a title and a description. */
export function validateDraftEdit(edit: DraftEdit): DraftEditCheck {
  const title = edit.title.trim();
  const description = edit.description.trim();
  const problems: DraftEditProblems = {
    ...(title ? {} : { title: "title.required" }),
    ...(description ? {} : { description: "description.required" }),
  };
  return Object.keys(problems).length > 0
    ? { ok: false, problems }
    : { ok: true, edit: { title, description } };
}

export class DraftAlreadySettledError extends Error {
  constructor(readonly status: DraftStatus) {
    super(`The draft is already ${status}`);
    this.name = "DraftAlreadySettledError";
  }
}

/** A draft is confirmed, cancelled or edited once, while it awaits confirmation. */
export function assertAwaitingConfirmation(draft: Pick<TicketDraft, "status">): void {
  if (draft.status !== "awaiting-confirmation") {
    throw new DraftAlreadySettledError(draft.status);
  }
}
