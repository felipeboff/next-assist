/**
 * A ticket as the conversations context sees it: a copy taken from the ticket service, with its
 * deadline already computed there. Tickets are owned by the tickets module (AD-005).
 */
export type TicketKind = "INC" | "REQ";
export type TicketCategory = "access" | "network" | "hardware" | "software" | "email" | "other";
export type TicketPriority = "critical" | "high" | "medium" | "low";
export type TicketStatus = "waiting-analyst" | "in-progress" | "in-service" | "approved" | "resolved";

export type TicketSnapshot = Readonly<{
  code: string;
  kind: TicketKind;
  title: string;
  description: string;
  category: TicketCategory;
  subcategory: string | null;
  priority: TicketPriority;
  status: TicketStatus;
  openedAt: Date;
  updatedAt: Date;
  /** When the next response is due, from the last update. */
  respondBy: Date;
  overdue: boolean;
}>;

export type NewTicketRequest = Readonly<{
  kind: TicketKind;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
}>;
