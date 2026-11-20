import { describe, expect, it } from "vitest";
import { activityTime } from "@/modules/conversations/domain/activity-time";
import { localDate } from "@/shared/domain/local-time";

const now = localDate(2026, 10, 20, 10, 6);

describe("activityTime", () => {
  it.each([
    ["30 seconds ago is now", new Date(now.getTime() - 30_000), { kind: "now" }],
    ["earlier today is its time", localDate(2026, 10, 20, 0, 5), { kind: "today", hours: 0, minutes: 5 }],
    ["the day before is yesterday", localDate(2026, 10, 19, 23, 59), { kind: "yesterday" }],
    ["older is its date", localDate(2026, 10, 18, 9, 0), { kind: "date", day: 18, month: 10 }],
  ] as const)("%s", (_name, at, expected) => {
    expect(activityTime(at, now)).toEqual(expected);
  });
});
