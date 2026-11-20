import { describe, expect, it } from "vitest";
import { isOverdue } from "@/modules/tickets/domain/sla";
import { TicketNotFoundError } from "@/modules/tickets/domain/ticket";
import { createInMemoryTicketService } from "@/modules/tickets/infrastructure/in-memory-ticket-service";
import { sampleTickets } from "@/modules/tickets/infrastructure/sample-tickets";
import { localDate } from "@/shared/domain/local-time";

const ana = "ana.souza@nexo.com.br";
const bruno = "bruno.carvalho@nexo.com.br";

// Every weekday and hour, so the sample situations do not depend on when the app runs.
const instants = Array.from({ length: 7 * 6 }, (_, i) =>
  localDate(2026, 10, 16 + Math.floor(i / 6), 1 + (i % 6) * 4),
);

function service(now = localDate(2026, 10, 20, 10, 0)) {
  return createInMemoryTicketService({ tickets: sampleTickets(now), clock: () => now });
}

describe("in-memory ticket service", () => {
  it("lists only the requester's tickets, newest opening first", async () => {
    const tickets = await service().listByRequester(ana);

    expect(tickets.map((ticket) => ticket.code)).toEqual([
      "INC-20311",
      "INC-20298",
      "REQ-10442",
      "INC-19877",
      "INC-19410",
    ]);
    expect(tickets.every((ticket) => ticket.requesterEmail === ana)).toBe(true);
  });

  it("does not show a ticket to someone who did not open it", async () => {
    const tickets = service();

    await expect(tickets.findByCode(bruno, "INC-20311")).resolves.toBeNull();
    await expect(tickets.findByCode(ana, "INC-20311")).resolves.toMatchObject({
      title: "Notebook lento após atualização do Windows",
    });
    await expect(tickets.addNote(bruno, "INC-20311", "intruso")).rejects.toThrow(TicketNotFoundError);
  });

  it("keeps INC-20311 overdue and Ana's other open tickets within their deadline at any time", () => {
    for (const now of instants) {
      const overdue = sampleTickets(now)
        .filter((ticket) => ticket.requesterEmail === ana && isOverdue(ticket, now))
        .map((ticket) => ticket.code);
      expect(overdue, now.toISOString()).toEqual(["INC-20311"]);
    }
  });

  it("creates a ticket with the next code of its kind, waiting for an analyst", async () => {
    const now = localDate(2026, 10, 20, 10, 0);
    const created = await service(now).create({
      kind: "INC",
      title: "VPN não conecta no notebook — erro 809",
      description: "Erro 809 desde ontem.",
      category: "network",
      priority: "high",
      requesterEmail: ana,
    });

    expect(created).toMatchObject({
      code: "INC-20520",
      status: "waiting-analyst",
      openedAt: now,
      updatedAt: now,
      notes: [],
    });
  });

  it("numbers the first ticket of a kind it has never seen after 10000", async () => {
    const empty = createInMemoryTicketService({ tickets: [], clock: () => new Date() });
    const created = await empty.create({
      kind: "REQ",
      title: "t",
      description: "d",
      category: "other",
      priority: "low",
      requesterEmail: ana,
    });
    expect(created.code).toBe("REQ-10001");
  });

  it("adds the requester's note without counting it as an update", async () => {
    const tickets = service();
    const before = await tickets.findByCode(ana, "INC-20311");
    const updated = await tickets.addNote(ana, "INC-20311", "Aconteceu de novo hoje.");

    expect(updated.notes).toEqual(["Aconteceu de novo hoje."]);
    expect(updated.updatedAt).toEqual(before?.updatedAt);
    await expect(tickets.listByRequester(ana)).resolves.toContainEqual(updated);
  });

  it("updates the status as a service desk update", async () => {
    const now = localDate(2026, 10, 20, 10, 12);
    const updated = await service(now).updateStatus("INC-20311", "in-service");

    expect(updated).toMatchObject({ status: "in-service", updatedAt: now });
    await expect(service().updateStatus("INC-1", "in-service")).rejects.toThrow(TicketNotFoundError);
  });
});
