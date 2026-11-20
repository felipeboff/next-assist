import { afterEach, describe, expect, it, vi } from "vitest";
import { InvalidHandoffError } from "@/modules/conversations/domain/handoff";
import {
  ConversationNotFoundError,
  createInMemoryAnalystConsole,
} from "@/modules/conversations/infrastructure/in-memory-analyst-console";
import { sampleConversations } from "@/modules/conversations/infrastructure/sample-conversations";
import { createFakeTicketDesk } from "@/modules/conversations/infrastructure/testing/fake-ticket-desk";
import { localDate } from "@/shared/domain/local-time";

const now = localDate(2026, 10, 20, 10, 6);
const rafael = { id: "rafael", name: "Rafael Nunes", team: "Suporte N2" };
const marina = { id: "marina", name: "Marina Lopes", team: "Suporte N2" };

function setup() {
  const fake = createFakeTicketDesk();
  const analystConsole = createInMemoryAnalystConsole({
    conversations: sampleConversations(now),
    ticketDesk: fake.desk,
    clock: () => now,
    answerDelayMs: 2000,
  });
  return { ...fake, analystConsole };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("in-memory analyst console", () => {
  it("starts from the sample conversations: three waiting, two with the agent, two resolved", async () => {
    const list = await setup().analystConsole.list();
    expect(list.map((conversation) => [conversation.employee.name, conversation.status])).toEqual([
      ["Ana Souza", "waiting-analyst"],
      ["Carla Mendes", "waiting-analyst"],
      ["Bruno Carvalho", "waiting-analyst"],
      ["Diego Rocha", "with-agent"],
      ["Elisa Prado", "with-agent"],
      ["Fábio Nunes", "resolved-by-agent"],
      ["Gabriela Rocha", "resolved-by-agent"],
    ]);
  });

  it("reads a conversation's history and refuses an unknown one", async () => {
    const { analystConsole } = setup();
    const thread = await analystConsole.thread("conversation-ana");

    expect(thread.conversation.ticketCode).toBe("INC-20311");
    expect(thread.entries.at(-1)).toMatchObject({ kind: "event", event: "transferred", actor: "Suporte N2" });
    await expect(analystConsole.thread("nope")).rejects.toThrow(ConversationNotFoundError);
  });

  it("takes over: the analyst attends, the agent pauses, unread clears and the ticket goes in service", async () => {
    const { analystConsole, started } = setup();
    const listener = vi.fn();
    analystConsole.subscribe(listener);

    const thread = await analystConsole.takeOver(rafael, "conversation-ana");

    expect(thread.conversation).toMatchObject({
      status: "with-analyst",
      attendant: { id: "rafael", name: "Rafael Nunes" },
      unread: 0,
      lastActivityAt: now,
    });
    expect(thread.entries.at(-1)).toMatchObject({
      kind: "event",
      event: "taken-over",
      actor: "Rafael Nunes",
      at: now,
    });
    expect(started).toEqual(["INC-20311"]);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("leaves the conversation waiting when the ticket system fails during a take-over", async () => {
    const { analystConsole, started, failNext } = setup();
    const before = await analystConsole.thread("conversation-ana");
    failNext("startService");

    await expect(analystConsole.takeOver(rafael, "conversation-ana")).rejects.toThrow(
      "startService is unavailable",
    );
    const after = await analystConsole.thread("conversation-ana");
    expect(after.conversation.status).toBe("waiting-analyst");
    expect(after.entries).toHaveLength(before.entries.length);

    const retried = await analystConsole.takeOver(rafael, "conversation-ana");
    expect(retried.conversation.status).toBe("with-analyst");
    expect(started).toEqual(["INC-20311"]);
  });

  it("takes over a conversation without a ticket without touching the ticket system", async () => {
    const { analystConsole, started } = setup();
    await analystConsole.takeOver(rafael, "conversation-carla");
    expect(started).toEqual([]);
  });

  it("hand back: from a waiting conversation nobody attended, and from one the analyst attends", async () => {
    const { analystConsole } = setup();

    const fromWaiting = await analystConsole.handBack(rafael, "conversation-carla");
    expect(fromWaiting.conversation).toMatchObject({ status: "with-agent", attendant: null });
    expect(fromWaiting.entries.at(-1)).toMatchObject({ kind: "event", event: "handed-back", actor: null });

    await analystConsole.takeOver(rafael, "conversation-ana");
    const fromAttended = await analystConsole.handBack(rafael, "conversation-ana");
    expect(fromAttended.conversation).toMatchObject({ status: "with-agent", attendant: null });
    expect(fromAttended.entries.at(-1)).toMatchObject({
      kind: "event",
      event: "handed-back",
      actor: "Rafael Nunes",
    });
  });

  it("closes only a conversation the analyst attends", async () => {
    const { analystConsole } = setup();
    await expect(analystConsole.close(rafael, "conversation-ana")).rejects.toThrow(InvalidHandoffError);

    await analystConsole.takeOver(rafael, "conversation-ana");
    await expect(analystConsole.close(marina, "conversation-ana")).rejects.toThrow(InvalidHandoffError);
    const closed = await analystConsole.close(rafael, "conversation-ana");

    expect(closed.conversation.status).toBe("closed");
    expect(closed.entries.at(-1)).toMatchObject({ kind: "event", event: "closed", actor: "Rafael Nunes" });
  });

  it("replies only in a conversation the analyst attends, and ignores a blank reply", async () => {
    const { analystConsole } = setup();
    await expect(analystConsole.reply(rafael, "conversation-ana", "Oi")).rejects.toThrow(InvalidHandoffError);

    const taken = await analystConsole.takeOver(rafael, "conversation-carla");
    const blank = await analystConsole.reply(rafael, "conversation-carla", "   ");
    expect(blank.entries).toHaveLength(taken.entries.length);

    await expect(analystConsole.reply(marina, "conversation-carla", "Oi")).rejects.toThrow(
      InvalidHandoffError,
    );
  });

  it("delivers the scripted employee answer 2 seconds after the analyst's first message, and only once", async () => {
    vi.useFakeTimers();
    const { analystConsole } = setup();
    const listener = vi.fn();
    const unsubscribe = analystConsole.subscribe(listener);
    await analystConsole.takeOver(rafael, "conversation-ana");

    const replied = await analystConsole.reply(rafael, "conversation-ana", "Pode deixar o notebook ligado?");
    expect(replied.entries.at(-1)).toMatchObject({
      kind: "analyst",
      text: "Pode deixar o notebook ligado?",
      analyst: { name: "Rafael Nunes", team: "Suporte N2" },
    });
    expect(replied.conversation.preview).toEqual({ from: "analyst", text: "Pode deixar o notebook ligado?" });

    await vi.advanceTimersByTimeAsync(1999);
    expect((await analystConsole.thread("conversation-ana")).entries.at(-1)?.kind).toBe("analyst");

    await vi.advanceTimersByTimeAsync(1);
    const answered = await analystConsole.thread("conversation-ana");
    expect(answered.entries.at(-1)).toMatchObject({ kind: "employee", text: "Posso sim, está ligado." });
    expect(answered.conversation.preview).toEqual({ from: "employee", text: "Posso sim, está ligado." });
    expect(listener).toHaveBeenCalledTimes(3);

    await analystConsole.reply(rafael, "conversation-ana", "Ótimo!");
    await vi.advanceTimersByTimeAsync(5000);
    const after = await analystConsole.thread("conversation-ana");
    expect(
      after.entries.filter((entry) => entry.kind === "employee" && entry.text === "Posso sim, está ligado."),
    ).toHaveLength(1);

    unsubscribe();
    await analystConsole.handBack(rafael, "conversation-ana");
    expect(listener).toHaveBeenCalledTimes(4);
  });
});
