import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ChatConversation } from "@/modules/conversations/domain/chat";
import { ChatScreen } from "@/modules/conversations/presentation/screens/chat-screen";
import {
  ScreenProviders,
  emptyConversation,
  fakeEmployeeChat,
} from "@/modules/conversations/presentation/testing/screen-providers";

const ana = { email: "ana.souza@nexo.com.br", name: "Ana Souza" };
const at = new Date("2026-11-20T13:00:00.000Z");

function withQuestion(sentCount: number): ChatConversation {
  return emptyConversation({
    sentCount,
    awaitingReplyId: "reply",
    entries: [
      { kind: "employee", id: "message", text: "Meu notebook não conecta na VPN.", at },
      {
        kind: "agent",
        id: "reply",
        at,
        reply: {
          decision: { understood: "VPN fora", actions: [], confidence: 0.9, reason: "Regra" },
          parts: [
            {
              kind: "question",
              text: "Vou abrir um chamado.",
              prompt: "Quem está sendo afetado?",
              options: ["Só eu", "Não sei"],
              chosen: null,
            },
          ],
        },
      },
    ],
  });
}

function renderChat(employeeChat = fakeEmployeeChat()) {
  render(
    <ScreenProviders employeeChat={employeeChat}>
      <ChatScreen employee={ana} />
    </ScreenProviders>,
  );
  return employeeChat;
}

describe("ChatScreen", () => {
  it("shows the loading state while the conversation opens", () => {
    renderChat(fakeEmployeeChat({ open: vi.fn(() => new Promise<ChatConversation>(() => {})) }));
    expect(screen.getByRole("status")).toHaveTextContent("Carregando sua conversa…");
  });

  it("explains when the conversation cannot be opened", async () => {
    renderChat(fakeEmployeeChat({ open: vi.fn(() => Promise.reject(new Error("down"))) }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível abrir sua conversa agora. Recarregue a página para tentar de novo.",
    );
  });

  it("keeps a failed send out of the count and resends it once with Tentar de novo", async () => {
    const user = userEvent.setup();
    const sent = emptyConversation({
      sentCount: 1,
      entries: [{ kind: "employee", id: "1", text: "Oi", at }],
    });
    const send = vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(sent);
    renderChat(fakeEmployeeChat({ send }));

    await user.type(await screen.findByLabelText("Mensagem para o Nexo Assist"), "Oi{Enter}");

    expect(await screen.findByText("Não foi possível enviar.")).toBeInTheDocument();
    expect(screen.getByText("Oi")).toBeInTheDocument();
    expect(screen.getByText("0/30 mensagens nesta sessão")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tentar de novo" }));

    expect(await screen.findByText("1/30 mensagens nesta sessão")).toBeInTheDocument();
    expect(screen.getAllByText("Oi")).toHaveLength(1);
    expect(screen.queryByText("Não foi possível enviar.")).not.toBeInTheDocument();
    expect(send).toHaveBeenCalledTimes(2);
    expect(send).toHaveBeenLastCalledWith(ana, "Oi");
  });

  it("allows the 30th message with 29 sent (limit of 30 messages)", async () => {
    renderChat(fakeEmployeeChat({ open: vi.fn(() => Promise.resolve(withQuestion(29))) }));

    expect(await screen.findByText("29/30 mensagens nesta sessão")).toBeInTheDocument();
    expect(screen.getByLabelText("Mensagem para o Nexo Assist")).toBeEnabled();
    expect(screen.getByRole("button", { name: "Só eu" })).toBeEnabled();
  });

  it("locks the field and the quick options at 30 sent (limit of 30 messages)", async () => {
    renderChat(fakeEmployeeChat({ open: vi.fn(() => Promise.resolve(withQuestion(30))) }));

    expect(await screen.findByText("30/30 mensagens nesta sessão")).toBeInTheDocument();
    const field = screen.getByLabelText("Mensagem para o Nexo Assist");
    expect(field).toBeDisabled();
    expect(field).toHaveAttribute("placeholder", "Você chegou ao limite de 30 mensagens nesta sessão.");
    expect(screen.getByRole("button", { name: "Só eu" })).toBeDisabled();
  });

  it("says an action failed and keeps the draft to confirm again", async () => {
    const user = userEvent.setup();
    const confirmDraft = vi.fn(() => Promise.reject(new Error("down")));
    const withDraft = emptyConversation({
      sentCount: 2,
      entries: [
        {
          kind: "agent",
          id: "draft",
          at,
          reply: {
            decision: { understood: "VPN fora", actions: [], confidence: 0.8, reason: "Regra" },
            parts: [
              {
                kind: "ticket-draft",
                draft: {
                  id: "D-381",
                  status: "awaiting-confirmation",
                  kind: "INC",
                  title: "VPN não conecta no notebook — erro 809",
                  description: "Erro 809 desde ontem.",
                  category: "network",
                  priority: "high",
                  affected: "only-me",
                  respondBy: at,
                  ticketCode: null,
                },
              },
            ],
          },
        },
      ],
    });
    renderChat(fakeEmployeeChat({ open: vi.fn(() => Promise.resolve(withDraft)), confirmDraft }));

    await user.click(await screen.findByRole("button", { name: /Confirmar/ }));

    expect(await screen.findByText("Não foi possível concluir agora. Tente de novo.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Confirmar/ })).toBeEnabled();
    expect(confirmDraft).toHaveBeenCalledWith(ana, "draft");
  });
});
