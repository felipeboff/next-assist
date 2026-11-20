"use client";

import { createContext, use, type ReactNode } from "react";
import type { AnalystConsole } from "@/modules/conversations/application/ports/analyst-console";
import type { EmployeeChat } from "@/modules/conversations/application/ports/employee-chat";

export type ConversationsDependencies = Readonly<{
  employeeChat: EmployeeChat;
  analystConsole: AnalystConsole;
}>;

const ConversationsDependenciesContext = createContext<ConversationsDependencies | null>(null);

export function ConversationsDependenciesProvider({
  value,
  children,
}: {
  value: ConversationsDependencies;
  children: ReactNode;
}) {
  return <ConversationsDependenciesContext value={value}>{children}</ConversationsDependenciesContext>;
}

export function useConversationsDependencies(): ConversationsDependencies {
  const dependencies = use(ConversationsDependenciesContext);
  if (!dependencies) {
    throw new Error("useConversationsDependencies must be used inside ConversationsDependenciesProvider");
  }
  return dependencies;
}
