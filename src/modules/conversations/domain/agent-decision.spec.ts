import { describe, expect, it } from "vitest";
import {
  confidenceLevel,
  confidencePercent,
  replyText,
  type AgentReply,
} from "@/modules/conversations/domain/agent-reply";

describe("confidenceLevel", () => {
  it.each([
    [0.8, "high"],
    [0.79, "medium"],
    [0.5, "medium"],
    [0.49, "low"],
    [0.41, "low"],
    // Named from the rounded percentage shown beside it: 80% is alta, 50% is média.
    [0.795, "high"],
    [0.495, "medium"],
  ] as const)("names %d %s", (confidence, level) => {
    expect(confidenceLevel(confidence)).toBe(level);
  });

  it("shows the confidence as a whole percentage", () => {
    expect(confidencePercent(0.414)).toBe(41);
    expect(confidencePercent(0.8)).toBe(80);
  });
});

describe("replyText", () => {
  it("joins the text of text and question parts, skipping cards", () => {
    const reply: AgentReply = {
      decision: { understood: "", actions: [], confidence: 1, reason: "" },
      parts: [
        { kind: "text", text: "Primeiro." },
        { kind: "ticket-picker", tickets: [], picked: null },
        { kind: "question", text: "Segundo?", prompt: null, options: ["Sim"], chosen: null },
      ],
    };
    expect(replyText(reply)).toBe("Primeiro.\nSegundo?");
  });
});
