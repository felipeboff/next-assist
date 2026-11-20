import type { ConsoleAnalyst, ConsoleConversation } from "@/modules/conversations/domain/console-list";
import type { ConsoleThread } from "@/modules/conversations/domain/console-thread";

/** The analyst's side: every conversation, its history and the hand-over actions. */
export interface AnalystConsole {
  list(): Promise<readonly ConsoleConversation[]>;
  thread(conversationId: string): Promise<ConsoleThread>;
  takeOver(analyst: ConsoleAnalyst, conversationId: string): Promise<ConsoleThread>;
  handBack(analyst: ConsoleAnalyst, conversationId: string): Promise<ConsoleThread>;
  close(analyst: ConsoleAnalyst, conversationId: string): Promise<ConsoleThread>;
  reply(analyst: ConsoleAnalyst, conversationId: string, text: string): Promise<ConsoleThread>;
  /** Calls back whenever something changes outside a command (an employee writes, for one). */
  subscribe(listener: () => void): () => void;
}
