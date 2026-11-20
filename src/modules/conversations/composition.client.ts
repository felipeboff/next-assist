import type { TicketDesk } from "@/modules/conversations/application/ports/ticket-desk";
import { createInMemoryAnalystConsole } from "@/modules/conversations/infrastructure/in-memory-analyst-console";
import { sampleConversations } from "@/modules/conversations/infrastructure/sample-conversations";
import { createScriptedAgent } from "@/modules/conversations/infrastructure/scripted-agent";
import type { ConversationsDependencies } from "@/modules/conversations/presentation/conversations-dependencies";

type Options = Readonly<{ ticketDesk: TicketDesk; clock?: () => Date }>;

/**
 * The conversations context in the browser. Until the Mastra agent and the server exist, the agent
 * is scripted and the console keeps sample conversations in memory (AD-003).
 */
export function makeConversationsClientModule({
  ticketDesk,
  clock = () => new Date(),
}: Options): ConversationsDependencies {
  return {
    employeeChat: createScriptedAgent({ ticketDesk, clock, delayMs: 900 }),
    analystConsole: createInMemoryAnalystConsole({
      conversations: sampleConversations(clock()),
      ticketDesk,
      clock,
      answerDelayMs: 2000,
    }),
  };
}
