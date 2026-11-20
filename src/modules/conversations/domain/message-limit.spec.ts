import { describe, expect, it } from "vitest";
import {
  MESSAGE_LIMIT,
  MessageLimitReachedError,
  canSendMessage,
} from "@/modules/conversations/domain/message-limit";

describe("message limit", () => {
  it("is 30 messages per session", () => {
    expect(MESSAGE_LIMIT).toBe(30);
  });

  it("lets the 30th message go with 29 sent", () => {
    expect(canSendMessage(29)).toBe(true);
  });

  it("stops at 30 sent", () => {
    expect(canSendMessage(30)).toBe(false);
  });

  it("names the limit in its error", () => {
    expect(new MessageLimitReachedError().message).toContain("30");
  });
});
