import { describe, expect, it } from "vitest";
import {
  fromLocalMs,
  localDate,
  localDayIndex,
  toLocalMs,
  toLocalParts,
  weekdayOfDayIndex,
} from "@/shared/domain/local-time";

describe("local time (São Paulo, UTC-3)", () => {
  it("builds the instant of a wall-clock time three hours behind UTC", () => {
    expect(localDate(2026, 10, 20, 9, 43).toISOString()).toBe("2026-11-20T12:43:00.000Z");
  });

  it("reads the wall-clock parts back from an instant", () => {
    expect(toLocalParts(new Date("2026-11-21T02:30:00.000Z"))).toEqual({
      year: 2026,
      month: 10,
      day: 20,
      hours: 23,
      minutes: 30,
    });
  });

  it("round-trips through local milliseconds", () => {
    const instant = new Date("2026-03-01T10:00:00.000Z");
    expect(fromLocalMs(toLocalMs(instant)).toISOString()).toBe(instant.toISOString());
  });

  it("puts 23:59 and 00:00 of the next day on different local days", () => {
    const lateFriday = localDate(2026, 10, 20, 23, 59);
    const saturday = localDate(2026, 10, 21, 0, 0);
    expect(localDayIndex(saturday) - localDayIndex(lateFriday)).toBe(1);
  });

  it("names the weekday of a day index, Sunday first", () => {
    expect(weekdayOfDayIndex(localDayIndex(localDate(2026, 10, 20, 12)))).toBe(5);
    expect(weekdayOfDayIndex(localDayIndex(localDate(2026, 10, 22, 12)))).toBe(0);
    expect(weekdayOfDayIndex(-1)).toBe(3);
  });
});
