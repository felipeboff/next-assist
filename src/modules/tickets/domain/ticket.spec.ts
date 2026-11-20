import { describe, expect, it } from "vitest";
import { TicketNotFoundError, isOpen, orderForPanel } from "@/modules/tickets/domain/ticket";

const day = (n: number) => new Date(Date.UTC(2026, 10, n, 12));

describe("isOpen", () => {
  it("treats every status but resolved as open", () => {
    expect(isOpen({ status: "waiting-analyst" })).toBe(true);
    expect(isOpen({ status: "approved" })).toBe(true);
    expect(isOpen({ status: "resolved" })).toBe(false);
  });
});

describe("orderForPanel", () => {
  it("lists open tickets first and closed ones after, newest first inside each group", () => {
    const tickets = [
      { code: "closed-old", status: "resolved", updatedAt: day(1) },
      { code: "open-old", status: "approved", updatedAt: day(5) },
      { code: "closed-new", status: "resolved", updatedAt: day(9) },
      { code: "open-new", status: "in-progress", updatedAt: day(8) },
    ] as const;

    expect(orderForPanel(tickets).map((ticket) => ticket.code)).toEqual([
      "open-new",
      "open-old",
      "closed-new",
      "closed-old",
    ]);
  });
});

describe("TicketNotFoundError", () => {
  it("carries the code it did not find", () => {
    const error = new TicketNotFoundError("INC-1");
    expect(error.code).toBe("INC-1");
    expect(error.name).toBe("TicketNotFoundError");
  });
});
