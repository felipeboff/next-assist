export type { TicketDesk } from "@/modules/conversations/application/ports/ticket-desk";
export { makeConversationsClientModule } from "@/modules/conversations/composition.client";
export type { TicketSnapshot } from "@/modules/conversations/domain/ticket-snapshot";
export {
  ConversationsDependenciesProvider,
  type ConversationsDependencies,
} from "@/modules/conversations/presentation/conversations-dependencies";
