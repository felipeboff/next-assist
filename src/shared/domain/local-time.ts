/**
 * Nexo works on São Paulo time. America/Sao_Paulo has kept UTC-3 all year since 2019 (no daylight
 * saving), so local wall-clock time is a fixed shift of the UTC instant.
 */
export const NEXO_UTC_OFFSET_HOURS = -3;

export const MINUTE_MS = 60_000;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

const OFFSET_MS = NEXO_UTC_OFFSET_HOURS * HOUR_MS;

/** Milliseconds of São Paulo wall-clock time since 1970-01-01 00:00 local. */
export function toLocalMs(date: Date): number {
  return date.getTime() + OFFSET_MS;
}

export function fromLocalMs(localMs: number): Date {
  return new Date(localMs - OFFSET_MS);
}

/** Days since 1970-01-01 in São Paulo: two instants on the same local day share it. */
export function localDayIndex(date: Date): number {
  return Math.floor(toLocalMs(date) / DAY_MS);
}

/** 0 is Sunday and 6 is Saturday, for a day index from `localDayIndex`. */
export function weekdayOfDayIndex(dayIndex: number): number {
  // 1970-01-01 was a Thursday.
  return (((dayIndex + 4) % 7) + 7) % 7;
}

export type LocalParts = Readonly<{
  year: number;
  /** 0 is January. */
  month: number;
  day: number;
  hours: number;
  minutes: number;
}>;

export function toLocalParts(date: Date): LocalParts {
  const local = new Date(toLocalMs(date));
  return {
    year: local.getUTCFullYear(),
    month: local.getUTCMonth(),
    day: local.getUTCDate(),
    hours: local.getUTCHours(),
    minutes: local.getUTCMinutes(),
  };
}

/** The instant of a São Paulo wall-clock time (month 0 is January). */
export function localDate(year: number, month: number, day: number, hours = 0, minutes = 0): Date {
  return fromLocalMs(Date.UTC(year, month, day, hours, minutes));
}
