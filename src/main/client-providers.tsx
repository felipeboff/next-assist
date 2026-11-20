"use client";

import type { ReactNode } from "react";
import { createTicketDesk } from "@/main/ticket-desk";
import {
  ConversationsDependenciesProvider,
  makeConversationsClientModule,
} from "@/modules/conversations/client";
import { IdentityDependenciesProvider, makeIdentityClientModule } from "@/modules/identity/client";
import { TicketsDependenciesProvider, makeTicketsClientModule } from "@/modules/tickets/client";

const identity = makeIdentityClientModule();
// In-memory mocks (AD-003): they start from the sample data on every page load.
const tickets = makeTicketsClientModule();
const conversations = makeConversationsClientModule({ ticketDesk: createTicketDesk(tickets.ticketService) });

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <IdentityDependenciesProvider value={identity}>
      <TicketsDependenciesProvider value={tickets}>
        <ConversationsDependenciesProvider value={conversations}>
          {children}
        </ConversationsDependenciesProvider>
      </TicketsDependenciesProvider>
    </IdentityDependenciesProvider>
  );
}
