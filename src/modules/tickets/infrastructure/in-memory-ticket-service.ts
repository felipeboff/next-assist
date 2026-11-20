import type { NewTicket, TicketService } from "@/modules/tickets/application/ports/ticket-service";
import { TicketNotFoundError, type Ticket, type TicketKind } from "@/modules/tickets/domain/ticket";

type Options = Readonly<{ tickets: readonly Ticket[]; clock: () => Date }>;

function nextCode(tickets: readonly Ticket[], kind: TicketKind): string {
  const numbers = tickets
    .filter((ticket) => ticket.kind === kind)
    .map((ticket) => Number(ticket.code.slice(kind.length + 1)));
  return `${kind}-${Math.max(10_000, ...numbers) + 1}`;
}

/** The ticket system kept in memory (AD-003): it starts from sample data and forgets on reload. */
export function createInMemoryTicketService({ tickets: initial, clock }: Options): TicketService {
  let tickets = [...initial];

  function replace(updated: Ticket): Ticket {
    tickets = tickets.map((ticket) => (ticket.code === updated.code ? updated : ticket));
    return updated;
  }

  function ownTicket(email: string, code: string): Ticket | null {
    return tickets.find((ticket) => ticket.code === code && ticket.requesterEmail === email) ?? null;
  }

  return {
    async listByRequester(email) {
      return tickets
        .filter((ticket) => ticket.requesterEmail === email)
        .sort((a, b) => b.openedAt.getTime() - a.openedAt.getTime());
    },

    async findByCode(email, code) {
      return ownTicket(email, code);
    },

    async create(input: NewTicket) {
      const now = clock();
      const ticket: Ticket = {
        ...input,
        code: nextCode(tickets, input.kind),
        subcategory: null,
        status: "waiting-analyst",
        openedAt: now,
        updatedAt: now,
        notes: [],
      };
      tickets = [...tickets, ticket];
      return ticket;
    },

    async addNote(email, code, note) {
      const ticket = ownTicket(email, code);
      if (!ticket) {
        throw new TicketNotFoundError(code);
      }
      // Information from the requester is not a service desk update: the deadline keeps running.
      return replace({ ...ticket, notes: [...ticket.notes, note] });
    },

    async updateStatus(code, status) {
      const ticket = tickets.find((candidate) => candidate.code === code);
      if (!ticket) {
        throw new TicketNotFoundError(code);
      }
      return replace({ ...ticket, status, updatedAt: clock() });
    },
  };
}
