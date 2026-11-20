import { describe, expect, it } from "vitest";
import type { ConsoleConversation } from "@/modules/conversations/domain/console-list";
import { lastEventOf, type ConsoleEntry } from "@/modules/conversations/domain/console-thread";

const at = new Date("2026-11-20T13:00:00.000Z");
const conversation = { id: "c" } as ConsoleConversation;

describe("lastEventOf", () => {
  it("finds the most recent hand-over event among the messages", () => {
    const entries: ConsoleEntry[] = [
      { kind: "event", id: "1", event: "transferred", actor: "Suporte N2", at },
      { kind: "employee", id: "2", text: "Oi", at },
      { kind: "event", id: "3", event: "taken-over", actor: "Rafael Nunes", at },
      { kind: "analyst", id: "4", text: "Olá", analyst: { name: "Rafael Nunes", team: "Suporte N2" }, at },
    ];
    expect(lastEventOf({ conversation, entries })?.id).toBe("3");
  });

  it("finds nothing in a conversation without events", () => {
    expect(
      lastEventOf({ conversation, entries: [{ kind: "employee", id: "1", text: "Oi", at }] }),
    ).toBeNull();
  });
});
