import { describe, expect, it } from "vitest";
import { passwordAgeInDays } from "@/modules/identity/domain/password-age";
import { DAY_MS, localDate } from "@/shared/domain/local-time";

const now = localDate(2026, 10, 20, 10, 0);

describe("passwordAge", () => {
  it.each([
    ["changed earlier today is 0 days", localDate(2026, 10, 20, 0, 1), 0],
    ["changed late yesterday is 1 day", localDate(2026, 10, 19, 23, 59), 1],
    ["changed 42 days ago is 42 days", new Date(now.getTime() - 42 * DAY_MS), 42],
    ["a clock ahead of now is 0 days", new Date(now.getTime() + DAY_MS), 0],
  ])("%s", (_name, changedAt, days) => {
    expect(passwordAgeInDays(changedAt, now)).toBe(days);
  });
});
