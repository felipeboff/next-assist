import { describe, expect, it } from "vitest";
import {
  InvalidHandoffError,
  applyHandoff,
  conversationStatuses,
  type HandoffAction,
  type HandoffState,
} from "@/modules/conversations/domain/handoff";

const me = "analyst-me";
const other = "analyst-other";

describe("handoff transitions", () => {
  const allowed: Array<[string, HandoffState, HandoffAction, HandoffState]> = [
    [
      "take over a waiting conversation",
      { status: "waiting-analyst", attendantId: null },
      "take-over",
      { status: "with-analyst", attendantId: me },
    ],
    [
      "take over a conversation with the agent",
      { status: "with-agent", attendantId: null },
      "take-over",
      { status: "with-analyst", attendantId: me },
    ],
    [
      "hand back a waiting conversation",
      { status: "waiting-analyst", attendantId: null },
      "hand-back",
      { status: "with-agent", attendantId: null },
    ],
    [
      "hand back a conversation I attend",
      { status: "with-analyst", attendantId: me },
      "hand-back",
      { status: "with-agent", attendantId: null },
    ],
    [
      "close a conversation I attend",
      { status: "with-analyst", attendantId: me },
      "close",
      { status: "closed", attendantId: me },
    ],
  ];

  it.each(allowed)("can %s", (_name, from, action, to) => {
    expect(applyHandoff(from, action, me)).toEqual(to);
  });

  const allowedKeys = new Set(
    allowed.map(([, from, action]) => `${from.status}:${from.attendantId}:${action}`),
  );
  const rejected = conversationStatuses.flatMap((status) =>
    (["take-over", "hand-back", "close"] as const).flatMap((action) =>
      // Only an attended or closed conversation has an attendant.
      (status === "with-analyst" || status === "closed" ? [me, other] : [null])
        .filter((attendantId) => !allowedKeys.has(`${status}:${attendantId}:${action}`))
        .map((attendantId) => [status, attendantId, action] as const),
    ),
  );

  it.each(rejected)("rejects every other move: %s attended by %s, %s", (status, attendantId, action) => {
    expect(() => applyHandoff({ status, attendantId }, action, me)).toThrow(InvalidHandoffError);
  });

  it("keeps another analyst's conversation out of my hands", () => {
    expect(() => applyHandoff({ status: "with-analyst", attendantId: other }, "close", me)).toThrow(
      "Cannot close a conversation that is with-analyst",
    );
  });
});
