import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ConsoleConversation } from "@/modules/conversations/domain/console-list";
import type { ConsoleThread } from "@/modules/conversations/domain/console-thread";
import { ConsoleScreen } from "@/modules/conversations/presentation/screens/console-screen";
import {
  ScreenProviders,
  fakeAnalystConsole,
  fakeTicketService,
} from "@/modules/conversations/presentation/testing/screen-providers";
import type { Ticket } from "@/modules/tickets/client";

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }) }));

const rafael = { id: "rafael", name: "Rafael Nunes", email: "rafael.nunes@nexo.com.br" };
const at = new Date();

const ana: ConsoleConversation = {
  id: "conversation-ana",
  employee: { email: "ana.souza@nexo.com.br", name: "Ana Souza", department: "Financeiro", online: true },
  status: "waiting-analyst",
  attendant: null,
  transfer: { reason: "overdue", confidence: null, team: "Suporte N2", at, respondBy: at },
  ticketCode: "INC-20311",
  lastActivityAt: at,
  preview: { from: "employee", text: "Quero falar com um analista." },
  typing: false,
  unread: 2,
};
const thread: ConsoleThread = {
  conversation: ana,
  entries: [{ kind: "employee", id: "1", text: "Quero falar com um analista.", at }],
};

describe("ConsoleScreen", () => {
  it("shows the loading state while the conversations load", () => {
    render(
      <ScreenProviders
        analystConsole={fakeAnalystConsole({
          list: vi.fn(() => new Promise<ConsoleConversation[]>(() => {})),
        })}
      >
        <ConsoleScreen analyst={rafael} />
      </ScreenProviders>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Carregando conversas…");
  });

  it("shows the tickets panel loading while the employee's tickets load", async () => {
    const analystConsole = fakeAnalystConsole({
      list: vi.fn(() => Promise.resolve([ana])),
      thread: vi.fn(() => Promise.resolve(thread)),
    });
    render(
      <ScreenProviders
        analystConsole={analystConsole}
        ticketService={fakeTicketService({ listByRequester: vi.fn(() => new Promise<Ticket[]>(() => {})) })}
      >
        <ConsoleScreen analyst={rafael} />
      </ScreenProviders>,
    );
    const panel = await screen.findByRole("complementary", { name: "Chamados do funcionário" });
    expect(within(panel).getByRole("status")).toHaveTextContent("Carregando chamados…");
  });

  it("says when there is no conversation to open", async () => {
    render(
      <ScreenProviders>
        <ConsoleScreen analyst={rafael} />
      </ScreenProviders>,
    );
    expect(await screen.findByText("Nenhuma conversa aqui.")).toBeInTheDocument();
    expect(screen.getByText("Selecione uma conversa para ver o histórico.")).toBeInTheDocument();
  });

  it("explains a failed take-over and keeps the conversation waiting", async () => {
    const user = userEvent.setup();
    const takeOver = vi.fn(() => Promise.reject(new Error("down")));
    render(
      <ScreenProviders
        analystConsole={fakeAnalystConsole({
          list: vi.fn(() => Promise.resolve([ana])),
          thread: vi.fn(() => Promise.resolve(thread)),
          takeOver,
        })}
      >
        <ConsoleScreen analyst={rafael} />
      </ScreenProviders>,
    );

    await user.click(await screen.findByRole("button", { name: "Assumir atendimento" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível assumir o atendimento agora. Tente de novo.",
    );
    expect(screen.getByText("Ana espera um atendente")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Assumir atendimento" })).toBeEnabled();
    expect(takeOver).toHaveBeenCalledWith(
      { id: "rafael", name: "Rafael Nunes", team: "Suporte N2" },
      "conversation-ana",
    );
  });
});
