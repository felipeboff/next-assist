import { MINUTE_MS, localDayIndex, toLocalParts } from "@/shared/domain/local-time";

export type ActivityTime =
  | Readonly<{ kind: "now" }>
  | Readonly<{ kind: "today"; hours: number; minutes: number }>
  | Readonly<{ kind: "yesterday" }>
  | Readonly<{ kind: "date"; day: number; month: number }>;

/** How recent the last activity of a conversation is, on São Paulo days. */
export function activityTime(at: Date, now: Date): ActivityTime {
  if (now.getTime() - at.getTime() < MINUTE_MS) {
    return { kind: "now" };
  }
  const daysAgo = localDayIndex(now) - localDayIndex(at);
  const parts = toLocalParts(at);
  if (daysAgo === 0) {
    return { kind: "today", hours: parts.hours, minutes: parts.minutes };
  }
  return daysAgo === 1 ? { kind: "yesterday" } : { kind: "date", day: parts.day, month: parts.month };
}
