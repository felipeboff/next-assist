import { localDayIndex } from "@/shared/domain/local-time";

/** Whole São Paulo days since the password last changed; never negative. */
export function passwordAgeInDays(changedAt: Date, now: Date): number {
  return Math.max(0, localDayIndex(now) - localDayIndex(changedAt));
}
