export const ticketKinds = ["INC", "REQ"] as const;
/** INC: something stopped or does not work. REQ: a request for access, equipment or software. */
export type TicketKind = (typeof ticketKinds)[number];

export const ticketCategories = ["access", "network", "hardware", "software", "email", "other"] as const;
export type TicketCategory = (typeof ticketCategories)[number];

export const ticketPriorities = ["critical", "high", "medium", "low"] as const;
export type TicketPriority = (typeof ticketPriorities)[number];

export const ticketStatuses = [
  "waiting-analyst",
  "in-progress",
  "in-service",
  "approved",
  "resolved",
] as const;
export type TicketStatus = (typeof ticketStatuses)[number];

export type Ticket = Readonly<{
  code: string;
  kind: TicketKind;
  title: string;
  description: string;
  category: TicketCategory;
  /** A finer label under the category, such as "Notebook" under hardware. */
  subcategory: string | null;
  priority: TicketPriority;
  status: TicketStatus;
  requesterEmail: string;
  openedAt: Date;
  /** The last update by the service desk, or the opening when there is none yet. */
  updatedAt: Date;
  notes: readonly string[];
}>;

export class TicketNotFoundError extends Error {
  constructor(readonly code: string) {
    super(`Ticket ${code} not found for this requester`);
    this.name = "TicketNotFoundError";
  }
}

export function isOpen(ticket: Pick<Ticket, "status">): boolean {
  return ticket.status !== "resolved";
}

/** Open tickets first, then closed ones; the most recently updated first inside each group. */
export function orderForPanel<T extends Pick<Ticket, "status" | "updatedAt">>(tickets: readonly T[]): T[] {
  return [...tickets].sort((a, b) => {
    const group = Number(!isOpen(a)) - Number(!isOpen(b));
    return group !== 0 ? group : b.updatedAt.getTime() - a.updatedAt.getTime();
  });
}
