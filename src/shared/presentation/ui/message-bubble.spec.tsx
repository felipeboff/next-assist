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

  it("is small and 85% wide at most by default, with no meta", () => {
    const { container } = render(<MessageBubble from="assistant">Olá!</MessageBubble>);

    const bubble = container.firstElementChild;
    expect(bubble).toHaveClass("px-3.5", "py-2", "text-xs", "max-w-[85%]", "border-line");
    expect(bubble?.children).toHaveLength(0);
  });

  it("has a medium size that is 75% wide at most", () => {
    render(
      <MessageBubble from="user" size="md">
        Erro 809.
      </MessageBubble>,
    );

    expect(screen.getByText("Erro 809.")).toHaveClass("px-4", "py-2.5", "text-md", "max-w-[75%]", "self-end");
  });

  it.each([
    ["ink", ["bg-ink", "text-on-ink"]],
    ["canvas", ["bg-canvas", "shadow-field"]],
    ["primary", ["bg-primary-muted", "text-text"]],
    ["success", ["bg-success-muted", "text-text"]],
  ] as const)("takes the %s tone over the colors of its role", (tone, classes) => {
    render(
      <MessageBubble from="assistant" tone={tone}>
        Chamado aberto.
      </MessageBubble>,
    );

    const bubble = screen.getByText("Chamado aberto.");
    expect(bubble).toHaveClass(...classes);
    expect(bubble).not.toHaveClass("border-line");
  });

  it("can override the side and the measure its role and size give", () => {
    const { rerender } = render(
      <MessageBubble from="user" align="start" measure="md">
        Assumi a conversa.
      </MessageBubble>,
    );

    const bubble = screen.getByText("Assumi a conversa.");
    expect(bubble).toHaveClass("self-start", "max-w-[32.5rem]");
    expect(bubble).not.toHaveClass("self-end", "max-w-[85%]");

    rerender(
      <MessageBubble from="assistant" align="end" measure="wide">
        Assumi a conversa.
      </MessageBubble>,
    );
    expect(bubble).toHaveClass("self-end", "max-w-[75%]");
    expect(bubble).not.toHaveClass("self-start");
  });

  it("ends the text with its meta", () => {
    render(
      <MessageBubble from="user" meta="14:20">
        Obrigado!
      </MessageBubble>,
    );

    const meta = screen.getByText("14:20");
    expect(meta.tagName).toBe("SPAN");
    expect(meta).toHaveClass("float-right", "text-2xs", "text-text-muted");
    expect(meta.parentElement).toHaveTextContent("Obrigado!14:20");
  });
});
