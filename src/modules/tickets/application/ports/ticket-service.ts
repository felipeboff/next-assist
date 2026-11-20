import type {
  Ticket,
  TicketCategory,
  TicketKind,
  TicketPriority,
  TicketStatus,
} from "@/modules/tickets/domain/ticket";

export type NewTicket = Readonly<{
  kind: TicketKind;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  requesterEmail: string;
}>;

/** The simulated ticket system, separate from the agent (PRD). */
export interface TicketService {
  /** The requester's tickets, newest opening first. Nobody else's (Annex A, privacy). */
  listByRequester(email: string): Promise<readonly Ticket[]>;
  findByCode(email: string, code: string): Promise<Ticket | null>;
  create(ticket: NewTicket): Promise<Ticket>;
  /** Adds the requester's information; throws `TicketNotFoundError` for someone else's ticket. */
  addNote(email: string, code: string, note: string): Promise<Ticket>;
  /** The service desk changes the status, which counts as an update. */
  updateStatus(code: string, status: TicketStatus): Promise<Ticket>;
}
