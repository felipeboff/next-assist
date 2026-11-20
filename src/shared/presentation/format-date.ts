import { DAY_MS, localDayIndex, toLocalParts } from "@/shared/domain/local-time";

/** pt-BR short months, without the dot Intl adds ("out", not "out."). */
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const pad = (value: number) => String(value).padStart(2, "0");

/** "14:20", São Paulo time. */
export function formatTime(date: Date): string {
  const { hours, minutes } = toLocalParts(date);
  return `${pad(hours)}:${pad(minutes)}`;
}

/** "09 out". */
export function formatDayMonth(date: Date): string {
  const { day, month } = toLocalParts(date);
  return `${pad(day)} ${MONTHS[month]}`;
}

export function monthName(month: number): string {
  return MONTHS[month];
}

/** "16 out, 14:20". */
export function formatDayMonthTime(date: Date): string {
  return `${formatDayMonth(date)}, ${formatTime(date)}`;
}

/** "14:20" on the same day as `now`, else "23 nov, 10:00". */
export function formatMoment(date: Date, now: Date): string {
  return localDayIndex(date) === localDayIndex(now) ? formatTime(date) : formatDayMonthTime(date);
}

/** Whole days between two instants, for "há 5 dias". */
export function daysBetween(from: Date, to: Date): number {
  return Math.max(0, Math.floor((to.getTime() - from.getTime()) / DAY_MS));
}

/** "hoje", "há 1 dia", "há 5 dias". */
export function formatDaysAgo(from: Date, now: Date): string {
  const days = daysBetween(from, now);
  if (days === 0) {
    return "hoje";
  }
  return days === 1 ? "há 1 dia" : `há ${days} dias`;
}
