import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CountBadge } from "./count-badge";

describe("CountBadge", () => {
  it("shows the number and reads it out with what is counted", () => {
    render(<CountBadge count={3} label="mensagens não lidas" />);

    const badge = screen.getByRole("img", { name: "3 mensagens não lidas" });
    expect(badge).toHaveTextContent("3");
    expect(badge).toHaveClass("bg-primary", "text-on-ink", "rounded-full", "tabular-nums");
  });

  it.each([0, -1])("renders nothing at %i", (count) => {
    const { container } = render(<CountBadge count={count} label="mensagens não lidas" />);

    expect(container).toBeEmptyDOMElement();
  });
});
