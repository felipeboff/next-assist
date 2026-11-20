import { describe, expect, it } from "vitest";
import { makeConversationsClientModule } from "@/modules/conversations/composition.client";
import {
  createFakeTicketDesk,
  ticketSnapshot,
} from "@/modules/conversations/infrastructure/testing/fake-ticket-desk";

describe("conversations browser composition", () => {
  it("answers the employee through the scripted agent over the given ticket desk", async () => {
    const fake = createFakeTicketDesk([
      { ...ticketSnapshot({ code: "INC-1" }), requesterEmail: "ana.souza@nexo.com.br" },
    ]);
    const { employeeChat } = makeConversationsClientModule({ ticketDesk: fake.desk });

    const conversation = await employeeChat.send(
      { email: "ana.souza@nexo.com.br", name: "Ana Souza" },
      "Qual o status do meu chamado?",
    );

    expect(conversation.entries.at(-1)).toMatchObject({ kind: "agent" });
    expect(JSON.stringify(conversation.entries.at(-1))).toContain("INC-1");
  });

  it("serves the console's sample conversations and starts the ticket service on a take-over", async () => {
    const fake = createFakeTicketDesk();
    const { analystConsole } = makeConversationsClientModule({
      ticketDesk: fake.desk,
      clock: () => new Date(),
    });

    expect(await analystConsole.list()).toHaveLength(7);
    await analystConsole.takeOver({ id: "a", name: "Analista", team: "Suporte N2" }, "conversation-ana");
    expect(fake.started).toEqual(["INC-20311"]);
  });
});
