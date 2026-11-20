import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MessageBubble } from "./message-bubble";

describe("MessageBubble", () => {
  it.each([
    ["user", false, "self-end", "bg-ink"],
    ["assistant", false, "self-start", "bg-canvas"],
    ["user", true, "self-end", "bg-canvas"],
    ["assistant", true, "self-start", "bg-ink-bubble"],
  ] as const)(
    "places a %s message (inverse: %s) on its side with its colors",
    (from, inverse, side, surface) => {
      render(
        <MessageBubble from={from} inverse={inverse}>
          Meu notebook não conecta na VPN.
        </MessageBubble>,
      );

      expect(screen.getByText("Meu notebook não conecta na VPN.")).toHaveClass(side, surface);
    },
  );
});
