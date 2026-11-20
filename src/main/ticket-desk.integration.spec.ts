import { describe, expect, it } from "vitest";
import { createTicketDesk } from "@/main/ticket-desk";
import { makeTicketsClientModule } from "@/modules/tickets/client";
import { localDate } from "@/shared/domain/local-time";

const ana = "ana.souza@nexo.com.br";
const bruno = "bruno.carvalho@nexo.com.br";
// Friday 20 Nov 2026, 22:00 in São Paulo: after hours, before a weekend.
const now = localDate(2026, 10, 20, 22, 0);

function desk() {
  const { ticketService } = makeTicketsClientModule(() => now);
  return createTicketDesk(ticketService, () => now);
}

describe("ticket desk over the tickets module (door 1)", () => {
  it("lists only the requester's open tickets, with the SLA deadline and overdue from the ticket rules", async () => {
    const open = await desk().listOpen(ana);

    expect(open.map((ticket) => ticket.code)).toEqual(["INC-20311", "INC-20298", "REQ-10442"]);
    // Média updated Sat 14 Nov 10:00 -> counts from Mon 08:00 -> due Wed 18 Nov 18:00, long past.
    expect(open[0]).toMatchObject({ respondBy: localDate(2026, 10, 18, 18, 0), overdue: true });
    expect(open.slice(1).every((ticket) => !ticket.overdue)).toBe(true);
    await expect(desk().listOpen(bruno)).resolves.toEqual([]);
  });

  it("finds a ticket only for the requester who opened it", async () => {
    const tickets = desk();
    await expect(tickets.find(bruno, "INC-20311")).resolves.toBeNull();
    await expect(tickets.find(ana, "INC-20311")).resolves.toMatchObject({
      code: "INC-20311",
      status: "waiting-analyst",
    });
  });

  it("gives drafts the Annex A deadline: Alta from Friday 22:00 is due Monday 12:00", () => {
    expect(desk().deadlineFor("high", now)).toEqual(localDate(2026, 10, 23, 12, 0));
    expect(desk().deadlineFor("critical", now)).toEqual(localDate(2026, 10, 20, 23, 0));
  });

  it("creates a ticket for the requester, notes on it and starts its service", async () => {
    const tickets = desk();
    const created = await tickets.create(ana, {
      kind: "INC",
      title: "VPN não conecta no notebook — erro 809",
      description: "Erro 809 desde ontem.",
      category: "network",
      priority: "high",
    });
    expect(created).toMatchObject({
      code: "INC-20520",
      status: "waiting-analyst",
      respondBy: localDate(2026, 10, 23, 12, 0),
      overdue: false,
    });

    await expect(tickets.addNote(ana, "INC-20520", "Ainda sem VPN.")).resolves.toMatchObject({
      code: "INC-20520",
    });

    await tickets.startService("INC-20311");
    await expect(tickets.find(ana, "INC-20311")).resolves.toMatchObject({ status: "in-service" });
  });

  it("uses the real clock by default", async () => {
    const { ticketService } = makeTicketsClientModule();
    await expect(createTicketDesk(ticketService).listOpen(ana)).resolves.toHaveLength(3);
  });
});
