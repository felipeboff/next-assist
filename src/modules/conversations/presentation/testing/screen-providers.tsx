import type { ReactNode } from "react";
import { vi } from "vitest";
import type { AnalystConsole } from "@/modules/conversations/application/ports/analyst-console";
import type { EmployeeChat } from "@/modules/conversations/application/ports/employee-chat";
import type { ChatConversation } from "@/modules/conversations/domain/chat";
import { ConversationsDependenciesProvider } from "@/modules/conversations/presentation/conversations-dependencies";
import { IdentityDependenciesProvider } from "@/modules/identity/client";
import { TicketsDependenciesProvider, type TicketService } from "@/modules/tickets/client";

export function emptyConversation(overrides: Partial<ChatConversation> = {}): ChatConversation {
  return {
    state: "with-agent",
    entries: [],
    sentCount: 0,
    awaitingReplyId: null,
    suggestions: [],
    ...overrides,
  };
}

export function fakeEmployeeChat(overrides: Partial<EmployeeChat> = {}): EmployeeChat {
  const rejectAll = () => Promise.reject(new Error("not stubbed"));
  return {
    open: vi.fn(() => Promise.resolve(emptyConversation())),
    send: vi.fn(rejectAll),
    answer: vi.fn(rejectAll),
    pickTicket: vi.fn(rejectAll),
    confirmDraft: vi.fn(rejectAll),
    cancelDraft: vi.fn(rejectAll),
    editDraft: vi.fn(rejectAll),
    ...overrides,
  };
}

export function fakeAnalystConsole(overrides: Partial<AnalystConsole> = {}): AnalystConsole {
  const rejectAll = () => Promise.reject(new Error("not stubbed"));
  return {
    list: vi.fn(() => Promise.resolve([])),
    thread: vi.fn(rejectAll),
    takeOver: vi.fn(rejectAll),
    handBack: vi.fn(rejectAll),
    close: vi.fn(rejectAll),
    reply: vi.fn(rejectAll),
    subscribe: vi.fn(() => () => {}),
    ...overrides,
  };
}

export function fakeTicketService(overrides: Partial<TicketService> = {}): TicketService {
  const rejectAll = () => Promise.reject(new Error("not stubbed"));
  return {
    listByRequester: vi.fn(() => Promise.resolve([])),
    findByCode: vi.fn(rejectAll),
    create: vi.fn(rejectAll),
    addNote: vi.fn(rejectAll),
    updateStatus: vi.fn(rejectAll),
    ...overrides,
  };
}

/** The providers `main/client-providers.tsx` mounts, with fakes in place of the mocks. */
export function ScreenProviders({
  employeeChat = fakeEmployeeChat(),
  analystConsole = fakeAnalystConsole(),
  ticketService = fakeTicketService(),
  children,
}: {
  employeeChat?: EmployeeChat;
  analystConsole?: AnalystConsole;
  ticketService?: TicketService;
  children: ReactNode;
}) {
  return (
    <IdentityDependenciesProvider
      value={{ signIn: vi.fn(), signOut: vi.fn(() => Promise.resolve()), requestPasswordReset: vi.fn() }}
    >
      <TicketsDependenciesProvider value={{ ticketService }}>
        <ConversationsDependenciesProvider value={{ employeeChat, analystConsole }}>
          {children}
        </ConversationsDependenciesProvider>
      </TicketsDependenciesProvider>
    </IdentityDependenciesProvider>
  );
}
