import { describe, expect, it } from "vitest";
import { makeTicketsClientModule } from "@/modules/tickets/composition.client";

describe("tickets browser composition", () => {
  it("serves the sample tickets of each requester, dated from the clock", async () => {
    const now = new Date("2026-11-20T13:00:00.000Z");
    const { ticketService } = makeTicketsClientModule(() => now);

    const ana = await ticketService.listByRequester("ana.souza@nexo.com.br");
    const example = await ticketService.listByRequester("employee@example.com");

    expect(ana.map((ticket) => ticket.code)).toContain("INC-20311");
    expect(example.map((ticket) => ticket.title)).toEqual(ana.map((ticket) => ticket.title));
    await expect(ticketService.listByRequester("ninguem@nexo.com.br")).resolves.toEqual([]);
  });

  it("uses the real clock by default", async () => {
    const tickets = await makeTicketsClientModule().ticketService.listByRequester("ana.souza@nexo.com.br");
    expect(tickets.length).toBeGreaterThan(0);
  });
});
