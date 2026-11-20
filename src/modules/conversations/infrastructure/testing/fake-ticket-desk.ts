import type { TicketDesk } from "@/modules/conversations/application/ports/ticket-desk";
import type {
  NewTicketRequest,
  TicketPriority,
  TicketSnapshot,
} from "@/modules/conversations/domain/ticket-snapshot";
import { HOUR_MS } from "@/shared/domain/local-time";

type Owned = TicketSnapshot & { requesterEmail: string };

const FAKE_DEADLINE_HOURS: Record<TicketPriority, number> = { critical: 1, high: 4, medium: 30, low: 50 };

export function ticketSnapshot(
  overrides: Partial<TicketSnapshot> & Pick<TicketSnapshot, "code">,
): TicketSnapshot {
  const at = new Date("2026-11-10T13:00:00.000Z");
  return {
    kind: "INC",
    title: `Título do ${overrides.code}`,
    description: "Descrição",
    category: "hardware",
    subcategory: null,
    priority: "medium",
    status: "waiting-analyst",
    openedAt: at,
    updatedAt: at,
    respondBy: at,
    overdue: false,
    ...overrides,
  };
}

/**
 * A ticket desk for the conversations tests: tickets by requester, and a record of what the agent
 * created, noted and started. `failNext` makes the next call of a method reject.
 */
export function createFakeTicketDesk(initial: readonly Owned[] = []) {
  const tickets: Owned[] = [...initial];
  const created: Array<NewTicketRequest & { email: string }> = [];
  const notes: Array<{ email: string; code: string; note: string }> = [];
  const started: string[] = [];
  const failing = new Set<keyof TicketDesk>();
  let sequence = 20_600;

  function maybeFail(method: keyof TicketDesk) {
    if (failing.delete(method)) {
      throw new Error(`${method} is unavailable`);
    }
  }

  const desk: TicketDesk = {
    async listOpen(email) {
      maybeFail("listOpen");
      return tickets.filter((ticket) => ticket.requesterEmail === email && ticket.status !== "resolved");
    },
    async find(email, code) {
      maybeFail("find");
      return tickets.find((ticket) => ticket.requesterEmail === email && ticket.code === code) ?? null;
    },
    async create(email, request) {
      maybeFail("create");
      created.push({ ...request, email });
      const ticket = {
        ...ticketSnapshot({ code: `${request.kind}-${++sequence}` }),
        ...request,
        requesterEmail: email,
      };
      tickets.push(ticket);
      return ticket;
    },
    async addNote(email, code, note) {
      maybeFail("addNote");
      notes.push({ email, code, note });
      return tickets.find((ticket) => ticket.code === code) ?? ticketSnapshot({ code });
    },
    async startService(code) {
      maybeFail("startService");
      started.push(code);
    },
    deadlineFor(priority, from) {
      return new Date(from.getTime() + FAKE_DEADLINE_HOURS[priority] * HOUR_MS);
    },
  };

  return {
    desk,
    created,
    notes,
    started,
    /** Removes a ticket, as if it moved away between two calls. */
    forget(code: string) {
      const index = tickets.findIndex((ticket) => ticket.code === code);
      tickets.splice(index, 1);
    },
    failNext(method: keyof TicketDesk) {
      failing.add(method);
    },
  };
}
