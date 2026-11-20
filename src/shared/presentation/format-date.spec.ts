import { describe, expect, it } from "vitest";
import { localDate } from "@/shared/domain/local-time";
import {
  daysBetween,
  formatDayMonth,
  formatDayMonthTime,
  formatDaysAgo,
  formatMoment,
  formatTime,
  monthName,
} from "@/shared/presentation/format-date";

describe("format-date (São Paulo, UTC-3)", () => {
  it("writes the São Paulo time of an instant with two digits", () => {
    expect(formatTime(new Date("2026-11-20T12:05:00.000Z"))).toBe("09:05");
    expect(formatTime(new Date("2026-11-21T02:30:00.000Z"))).toBe("23:30");
  });

  it("writes the São Paulo day and the short month, without a dot", () => {
    expect(formatDayMonth(localDate(2026, 9, 9, 10))).toBe("09 out");
    expect(formatDayMonth(new Date("2026-11-01T02:00:00.000Z"))).toBe("31 out");
  });

  it("names every month in short pt-BR, January first", () => {
    expect(Array.from({ length: 12 }, (_, month) => monthName(month))).toEqual([
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "set",
      "out",
      "nov",
      "dez",
    ]);
  });

  it("joins the day and the time", () => {
    expect(formatDayMonthTime(localDate(2026, 9, 16, 14, 20))).toBe("16 out, 14:20");
  });

  it("shows only the time on the same local day, else the day too", () => {
    const now = localDate(2026, 10, 20, 9, 0);
    expect(formatMoment(localDate(2026, 10, 20, 0, 0), now)).toBe("00:00");
    expect(formatMoment(localDate(2026, 10, 19, 23, 59), now)).toBe("19 nov, 23:59");
  });

  it("counts whole days between two instants, never below zero", () => {
    const now = localDate(2026, 10, 20, 9, 0);
    expect(daysBetween(localDate(2026, 10, 15, 9, 0), now)).toBe(5);
    expect(daysBetween(localDate(2026, 10, 19, 9, 1), now)).toBe(0);
    expect(daysBetween(localDate(2026, 10, 21, 9, 0), now)).toBe(0);
  });

  it("says how long ago, in days", () => {
    const now = localDate(2026, 10, 20, 9, 0);
    expect(formatDaysAgo(localDate(2026, 10, 20, 8, 0), now)).toBe("hoje");
    expect(formatDaysAgo(localDate(2026, 10, 19, 9, 0), now)).toBe("há 1 dia");
    expect(formatDaysAgo(localDate(2026, 10, 15, 9, 0), now)).toBe("há 5 dias");
  });
});
