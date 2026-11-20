"use client";

import { createContext, use, type ReactNode } from "react";
import type { TicketService } from "@/modules/tickets/application/ports/ticket-service";

export type TicketsDependencies = Readonly<{ ticketService: TicketService }>;

const TicketsDependenciesContext = createContext<TicketsDependencies | null>(null);

export function TicketsDependenciesProvider({
  value,
  children,
}: {
  value: TicketsDependencies;
  children: ReactNode;
}) {
  return <TicketsDependenciesContext value={value}>{children}</TicketsDependenciesContext>;
}

export function useTicketsDependencies(): TicketsDependencies {
  const dependencies = use(TicketsDependenciesContext);
  if (!dependencies) {
    throw new Error("useTicketsDependencies must be used inside TicketsDependenciesProvider");
  }
  return dependencies;
}
