export type { TicketService } from "@/modules/tickets/application/ports/ticket-service";
export { makeTicketsClientModule } from "@/modules/tickets/composition.client";
export { isOverdue, responseDeadline } from "@/modules/tickets/domain/sla";
export { isOpen, type Ticket } from "@/modules/tickets/domain/ticket";
export {
  EmployeeTicketsPanel,
  type ConversationTicketEvent,
  type EmployeeTicketsPanelProps,
} from "@/modules/tickets/presentation/components/employee-tickets-panel";
export {
  categoryPath,
  categoryText,
  deadlineText,
  priorityText,
  priorityTone,
  statusText,
  statusTone,
} from "@/modules/tickets/presentation/ticket-texts";
export {
  TicketsDependenciesProvider,
  type TicketsDependencies,
} from "@/modules/tickets/presentation/tickets-dependencies";
