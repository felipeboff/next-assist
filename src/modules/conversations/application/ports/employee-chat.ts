import type { ChatConversation, ChatEmployee } from "@/modules/conversations/domain/chat";
import type { DraftEdit } from "@/modules/conversations/domain/ticket-draft";

/**
 * The employee's side of the conversation with the Nexo Assist agent. Every command answers with
 * the whole conversation as it is afterwards, the agent's reply included.
 */
export interface EmployeeChat {
  open(employee: ChatEmployee): Promise<ChatConversation>;
  /** Throws `MessageLimitReachedError` past the session limit, whatever the screen allows. */
  send(employee: ChatEmployee, text: string): Promise<ChatConversation>;
  /** Answers a question of the reply `entryId` with one of its quick options. */
  answer(employee: ChatEmployee, entryId: string, option: string): Promise<ChatConversation>;
  pickTicket(employee: ChatEmployee, entryId: string, code: string): Promise<ChatConversation>;
  confirmDraft(employee: ChatEmployee, entryId: string): Promise<ChatConversation>;
  cancelDraft(employee: ChatEmployee, entryId: string): Promise<ChatConversation>;
  editDraft(employee: ChatEmployee, entryId: string, edit: DraftEdit): Promise<ChatConversation>;
}
