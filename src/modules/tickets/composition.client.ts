import { createInMemoryTicketService } from "@/modules/tickets/infrastructure/in-memory-ticket-service";
import { sampleTickets } from "@/modules/tickets/infrastructure/sample-tickets";
import type { TicketsDependencies } from "@/modules/tickets/presentation/tickets-dependencies";

/** The ticket system in the browser: in memory, from the sample data, until the real one (AD-003). */
export function makeTicketsClientModule(clock: () => Date = () => new Date()): TicketsDependencies {
  return { ticketService: createInMemoryTicketService({ tickets: sampleTickets(clock()), clock }) };
}
