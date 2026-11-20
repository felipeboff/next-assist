import { describe, expect, it } from "vitest";
import {
  DraftAlreadySettledError,
  assertAwaitingConfirmation,
  validateDraftEdit,
} from "@/modules/conversations/domain/ticket-draft";

describe("validateDraftEdit", () => {
  it("rejects a blank title with title.required", () => {
    expect(validateDraftEdit({ title: "   ", description: "Erro 809" })).toEqual({
      ok: false,
      problems: { title: "title.required" },
    });
  });

  it("rejects a blank description with description.required", () => {
    expect(validateDraftEdit({ title: "VPN", description: "" })).toEqual({
      ok: false,
      problems: { description: "description.required" },
    });
  });

  it("accepts the edit trimmed", () => {
    expect(validateDraftEdit({ title: " VPN fora ", description: " Erro 809 " })).toEqual({
      ok: true,
      edit: { title: "VPN fora", description: "Erro 809" },
    });
  });
});

describe("assertAwaitingConfirmation", () => {
  it("lets a draft awaiting confirmation through", () => {
    expect(() => assertAwaitingConfirmation({ status: "awaiting-confirmation" })).not.toThrow();
  });

  it.each(["created", "cancelled"] as const)("rejects a %s draft", (status) => {
    expect(() => assertAwaitingConfirmation({ status })).toThrow(DraftAlreadySettledError);
  });
});
