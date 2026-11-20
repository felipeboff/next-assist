import { describe, expect, it } from "vitest";
import { StaleChatActionError } from "@/modules/conversations/domain/chat";

describe("StaleChatActionError", () => {
  it("names the reply that no longer accepts the action", () => {
    const error = new StaleChatActionError("entry-7");
    expect(error.entryId).toBe("entry-7");
    expect(error.name).toBe("StaleChatActionError");
    expect(error.message).toBe("The reply entry-7 no longer accepts this action");
  });
});
