import { describe, expect, it } from "vitest";
import { addBusinessHours, isOverdue, responseDeadline } from "@/modules/tickets/domain/sla";
import type { TicketPriority } from "@/modules/tickets/domain/ticket";
import { localDate } from "@/shared/domain/local-time";

// November 2026: Mon 16, Tue 17, Wed 18, Thu 19, Fri 20, Sat 21, Sun 22, Mon 23, Tue 24.
const at = (day: number, hours: number, minutes = 0) => localDate(2026, 10, day, hours, minutes);

describe("responseDeadline", () => {
  const examples: Array<[string, TicketPriority, Date, Date]> = [
    ["Alta from Mon 09:43 ends Mon 13:43", "high", at(16, 9, 43), at(16, 13, 43)],
    ["Alta from Fri 16:00 ends Mon 10:00", "high", at(20, 16), at(23, 10)],
    ["Alta from Tue 19:00 ends Wed 12:00", "high", at(17, 19), at(18, 12)],
    ["Crítica from Sat 23:30 ends Sun 00:30", "critical", at(21, 23, 30), at(22, 0, 30)],
    ["Média from Thu 14:20 ends Tue 14:20", "medium", at(19, 14, 20), at(24, 14, 20)],
    ["Baixa from Mon 08:00 ends Fri 18:00", "low", at(16, 8), at(20, 18)],
  ];

  it.each(examples)("%s", (_name, priority, from, expected) => {
    expect(responseDeadline(priority, from).toISOString()).toBe(expected.toISOString());
  });

  it("starts counting at the opening when the clock is before 08:00", () => {
    expect(addBusinessHours(at(17, 6), 1).toISOString()).toBe(at(17, 9).toISOString());
  });
});

describe("isOverdue", () => {
  const ticket = (status: "waiting-analyst" | "resolved", updatedAt: Date) =>
    ({ status, priority: "medium", updatedAt }) as const;

  it.each([
    [
      "Média updated Wed 10:00 is not overdue at Mon 10:00",
      ticket("waiting-analyst", at(18, 10)),
      at(23, 10),
      false,
    ],
    [
      "Média updated Wed 10:00 is overdue at Mon 10:01",
      ticket("waiting-analyst", at(18, 10)),
      at(23, 10, 1),
      true,
    ],
    [
      "a resolved ticket updated 30 days ago is not overdue",
      ticket("resolved", at(16, 10)),
      at(16 + 30, 10),
      false,
    ],
  ])("%s", (_name, subject, now, expected) => {
    expect(isOverdue(subject, now)).toBe(expected);
  });
});
