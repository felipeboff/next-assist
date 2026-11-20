import { describe, expect, it } from "vitest";
import { matchOption } from "@/modules/conversations/domain/quick-answer";
import { normalizeForMatch } from "@/modules/conversations/domain/text-match";

const options = ["Só eu", "Minha equipe", "Toda a empresa", "Não sei"];

describe("matchOption", () => {
  it.each([
    ["Só eu. Tenho reunião às 14h", "Só eu"],
    ["so eu", "Só eu"],
    ["minha equipe toda", "Minha equipe"],
    ["o andar inteiro", "Não sei"],
    // A label inside the answer is not a label that starts it.
    ["acho que toda a empresa", "Não sei"],
  ])("reads %j as %j", (typed, expected) => {
    expect(matchOption(typed, options, "Não sei")).toBe(expected);
  });

  it("prefers the longest label that starts the answer", () => {
    expect(matchOption("Não sei bem", ["Não", "Não sei"], "?")).toBe("Não sei");
  });
});

describe("normalizeForMatch", () => {
  it("drops case, accents and extra spaces", () => {
    expect(normalizeForMatch("  Fábio   NUNES ")).toBe("fabio nunes");
  });
});
