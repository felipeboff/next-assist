import type { Ticket, TicketPriority } from "@/modules/tickets/domain/ticket";
import { isOpen } from "@/modules/tickets/domain/ticket";
import { DAY_MS, HOUR_MS, fromLocalMs, toLocalMs, weekdayOfDayIndex } from "@/shared/domain/local-time";

/** Service desk hours (Annex B article): Monday to Friday, 08:00 to 18:00 São Paulo time. */
const OPENS_AT = 8 * HOUR_MS;
const CLOSES_AT = 18 * HOUR_MS;
export const BUSINESS_DAY_HOURS = 10;

/**
 * Annex A deadlines. Critical tickets have a 24-hour on-call, so their hour is a wall-clock hour;
 * the others count business time only.
 */
export const priorityDeadline: Record<
  TicketPriority,
  Readonly<{ hours: number; clock: "wall" | "business" }>
> = {
  critical: { hours: 1, clock: "wall" },
  high: { hours: 4, clock: "business" },
  medium: { hours: 3 * BUSINESS_DAY_HOURS, clock: "business" },
  low: { hours: 5 * BUSINESS_DAY_HOURS, clock: "business" },
};

function isBusinessDay(dayIndex: number): boolean {
  const weekday = weekdayOfDayIndex(dayIndex);
  return weekday !== 0 && weekday !== 6;
}

/** The same local instant when it is inside business hours, else the next opening. */
function nextBusinessInstant(localMs: number): number {
  let day = Math.floor(localMs / DAY_MS);
  const timeOfDay = localMs - day * DAY_MS;
  if (isBusinessDay(day) && timeOfDay < OPENS_AT) {
    return day * DAY_MS + OPENS_AT;
  }
  if (isBusinessDay(day) && timeOfDay < CLOSES_AT) {
    return localMs;
  }
  do {
    day += 1;
  } while (!isBusinessDay(day));
  return day * DAY_MS + OPENS_AT;
}

export function addBusinessHours(from: Date, hours: number): Date {
  let local = nextBusinessInstant(toLocalMs(from));
  let remaining = hours * HOUR_MS;
  for (;;) {
    const day = Math.floor(local / DAY_MS);
    const available = day * DAY_MS + CLOSES_AT - local;
    if (remaining <= available) {
      return fromLocalMs(local + remaining);
    }
    remaining -= available;
    local = nextBusinessInstant((day + 1) * DAY_MS);
  }
}

/** When the next response is due for a ticket of this priority, counting from `from`. */
export function responseDeadline(priority: TicketPriority, from: Date): Date {
  const { hours, clock } = priorityDeadline[priority];
  return clock === "wall" ? new Date(from.getTime() + hours * HOUR_MS) : addBusinessHours(from, hours);
}

/** Annex A: the deadline applies to the first response and to each update; resolved never expires. */
export function isOverdue(ticket: Pick<Ticket, "status" | "priority" | "updatedAt">, now: Date): boolean {
  return isOpen(ticket) && responseDeadline(ticket.priority, ticket.updatedAt).getTime() < now.getTime();
}
