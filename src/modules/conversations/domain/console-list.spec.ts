import { describe, expect, it } from "vitest";
import {
  countByFilter,
  filterConversations,
  orderConversations,
  searchConversations,
  statusLineOf,
  type ConsoleConversation,
} from "@/modules/conversations/domain/console-list";
import { localDate } from "@/shared/domain/local-time";

const me = { id: "rafael", name: "Rafael Nunes" };
const now = localDate(2026, 10, 20, 10, 6);
const at = (hours: number, minutes: number, day = 20) => localDate(2026, 10, day, hours, minutes);

function conversation(
  overrides: Partial<ConsoleConversation> & Pick<ConsoleConversation, "id">,
): ConsoleConversation {
  return {
    employee: { email: `${overrides.id}@nexo.com.br`, name: overrides.id, department: "TI", online: true },
    status: "with-agent",
    attendant: null,
    transfer: null,
    ticketCode: null,
    lastActivityAt: at(9, 0),
    preview: null,
    typing: false,
    unread: 0,
    ...overrides,
  };
}

const transfer = (
  respondBy: Date,
  reason: "employee-request" | "low-confidence" = "employee-request",
  confidence: number | null = null,
) => ({
  reason,
  confidence,
  team: "Suporte N2",
  at: at(10, 0),
  respondBy,
});

const ana = conversation({
  id: "Ana Souza",
  status: "waiting-analyst",
  ticketCode: "INC-20311",
  lastActivityAt: at(10, 5),
  transfer: transfer(at(12, 5)),
});
const carla = conversation({
  id: "Carla Mendes",
  status: "waiting-analyst",
  lastActivityAt: at(9, 58),
  transfer: transfer(at(10, 31)),
});
const bruno = conversation({
  id: "Bruno Carvalho",
  status: "waiting-analyst",
  lastActivityAt: at(9, 51),
  transfer: transfer(at(11, 51), "low-confidence", 0.41),
});
const diego = conversation({ id: "Diego Rocha", status: "with-agent", lastActivityAt: at(10, 6) });
const elisa = conversation({
  id: "Elisa Prado",
  status: "with-agent",
  lastActivityAt: at(10, 3),
  ticketCode: "INC-20519",
});
const fabio = conversation({ id: "Fábio Nunes", status: "resolved-by-agent", lastActivityAt: at(10, 1) });
const gabriela = conversation({
  id: "Gabriela Rocha",
  status: "resolved-by-agent",
  lastActivityAt: at(18, 0, 19),
});
const mine = conversation({
  id: "Helena Dias",
  status: "with-analyst",
  attendant: me,
  lastActivityAt: at(8, 0),
});
const others = conversation({
  id: "Igor Lima",
  status: "with-analyst",
  attendant: { id: "marina", name: "Marina Lopes" },
  lastActivityAt: at(7, 0),
});
const closed = conversation({
  id: "Júlia Reis",
  status: "closed",
  attendant: me,
  lastActivityAt: at(9, 0, 18),
});

const all = [gabriela, fabio, elisa, diego, bruno, carla, ana, mine, others, closed];

describe("orderConversations", () => {
  it("puts conversations that need a person first, then the agent's, then finished ones, newest first", () => {
    expect(orderConversations(all).map((c) => c.id)).toEqual([
      "Ana Souza",
      "Carla Mendes",
      "Bruno Carvalho",
      "Helena Dias",
      "Igor Lima",
      "Diego Rocha",
      "Elisa Prado",
      "Fábio Nunes",
      "Gabriela Rocha",
      "Júlia Reis",
    ]);
  });

  it("puts a transfer at 10:05 before an agent conversation active now", () => {
    expect(orderConversations([diego, ana]).map((c) => c.id)).toEqual(["Ana Souza", "Diego Rocha"]);
  });
});

describe("filterConversations", () => {
  it.each([
    ["all", all.map((c) => c.id)],
    ["for-you", ["Bruno Carvalho", "Carla Mendes", "Ana Souza"]],
    ["with-agent", ["Elisa Prado", "Diego Rocha"]],
    ["mine", ["Helena Dias"]],
  ] as const)("lists the %s conversations", (filter, expected) => {
    expect(filterConversations(all, filter, me.id).map((c) => c.id)).toEqual(expected);
  });

  it("counts each filter", () => {
    expect(countByFilter(all, me.id)).toEqual({ all: 10, "for-you": 3, "with-agent": 2, mine: 1 });
  });
});

describe("searchConversations", () => {
  it.each([
    ["inc-20311", ["Ana Souza"]],
    ["fabio", ["Fábio Nunes"]],
    // Contains, not starts with: the middle of a name or of a code.
    ["souza", ["Ana Souza"]],
    ["20311", ["Ana Souza"]],
    ["xyz", []],
    ["  ", all.map((c) => c.id)],
  ])("finds %j", (term, expected) => {
    expect(searchConversations(all, term).map((c) => c.id)).toEqual(expected);
  });
});

describe("statusLineOf", () => {
  it.each([
    ["transferred with its ticket", ana, { kind: "transferred-ticket", code: "INC-20311" }],
    ["transferred with the contact time", carla, { kind: "transferred-contact", minutes: 25 }],
    ["the agent asked for help", bruno, { kind: "agent-asked-help", confidencePercent: 41 }],
    ["the agent attends", diego, { kind: "agent-attending" }],
    ["I attend", mine, { kind: "you-attending" }],
    ["another analyst attends", others, { kind: "analyst-attending", name: "Marina Lopes" }],
    ["resolved by the agent", fabio, { kind: "resolved" }],
    ["closed", closed, { kind: "closed" }],
  ] as const)("says %s", (_name, subject, expected) => {
    expect(statusLineOf(subject, me.id, now)).toEqual(expected);
  });

  it("never counts a contact time below zero, nor without a transfer", () => {
    const late = conversation({ id: "late", status: "waiting-analyst", transfer: transfer(at(9, 0)) });
    const bare = conversation({ id: "bare", status: "waiting-analyst" });
    expect(statusLineOf(late, me.id, now)).toEqual({ kind: "transferred-contact", minutes: 0 });
    expect(statusLineOf(bare, me.id, now)).toEqual({ kind: "transferred-contact", minutes: 0 });
  });

  it("names nobody when an attended conversation lost its attendant", () => {
    const orphan = conversation({ id: "orphan", status: "with-analyst" });
    expect(statusLineOf(orphan, me.id, now)).toEqual({ kind: "analyst-attending", name: "" });
  });
});
