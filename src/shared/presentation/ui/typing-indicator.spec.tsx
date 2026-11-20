import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TypingIndicator } from "./typing-indicator";

describe("TypingIndicator", () => {
  it("announces who is writing beside three hidden dots that pulse in turn", () => {
    const { container } = render(<TypingIndicator label="Nexo Assist está digitando…" />);

    expect(screen.getByRole("status")).toHaveTextContent("Nexo Assist está digitando…");
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass("rounded-lg", "border-line-soft");
    const dots = [...container.querySelectorAll<HTMLElement>(".animate-typing")];
    expect(dots).toHaveLength(3);
    expect(dots.map((dot) => dot.style.animationDelay)).toEqual(["0ms", "150ms", "300ms"]);
    expect(dots[0]).toHaveClass("motion-reduce:animate-none");
  });
});
