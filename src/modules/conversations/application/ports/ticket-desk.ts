import type {
  NewTicketRequest,
  TicketPriority,
  TicketSnapshot,
} from "@/modules/conversations/domain/ticket-snapshot";

/**
 * What the conversations context needs from the ticket system (AD-005). `main/` adapts the
 * tickets module into it; nothing here knows how tickets are stored.
 */
export interface TicketDesk {
  /** The employee's open tickets, newest opening first. Never someone else's (Annex A). */
  listOpen(email: string): Promise<readonly TicketSnapshot[]>;
  find(email: string, code: string): Promise<TicketSnapshot | null>;
  create(email: string, ticket: NewTicketRequest): Promise<TicketSnapshot>;
  addNote(email: string, code: string, note: string): Promise<TicketSnapshot>;
  /** An analyst took the case over: the ticket is now being attended. */
  startService(code: string): Promise<void>;
  /** When a ticket of this priority opened at `from` gets its first response (Annex A). */
  deadlineFor(priority: TicketPriority, from: Date): Date;
}
