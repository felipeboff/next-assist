import type { TicketDesk, TicketSnapshot } from "@/modules/conversations/client";
import {
  isOpen,
  isOverdue,
  responseDeadline,
  type Ticket,
  type TicketService,
} from "@/modules/tickets/client";

/**
 * Adapts the tickets module to the port the conversations context declares (AD-005): tickets
 * cross as snapshots, with their deadline computed by the ticket rules.
 */
export function createTicketDesk(service: TicketService, clock: () => Date = () => new Date()): TicketDesk {
  const snapshot = (ticket: Ticket): TicketSnapshot => ({
    code: ticket.code,
    kind: ticket.kind,
    title: ticket.title,
    description: ticket.description,
    category: ticket.category,
    subcategory: ticket.subcategory,
    priority: ticket.priority,
    status: ticket.status,
    openedAt: ticket.openedAt,
    updatedAt: ticket.updatedAt,
    respondBy: responseDeadline(ticket.priority, ticket.updatedAt),
    overdue: isOverdue(ticket, clock()),
  });

  return {
    async listOpen(email) {
      return (await service.listByRequester(email)).filter(isOpen).map(snapshot);
    },
    async find(email, code) {
      const ticket = await service.findByCode(email, code);
      return ticket ? snapshot(ticket) : null;
    },
    async create(email, request) {
      return snapshot(await service.create({ ...request, requesterEmail: email }));
    },
    async addNote(email, code, note) {
      return snapshot(await service.addNote(email, code, note));
    },
    async startService(code) {
      await service.updateStatus(code, "in-service");
    },
    deadlineFor: responseDeadline,
  };
}
