import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusDot } from "./status-dot";

describe("StatusDot", () => {
  it("is decorative without a label", () => {
    const { container } = render(<StatusDot tone="warning" />);

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(container.firstElementChild).toHaveClass("bg-warning", "size-2");
  });

  it("is announced when it carries the state alone", () => {
    render(<StatusDot tone="success" size="sm" label="Online" />);

    expect(screen.getByRole("img", { name: "Online" })).toHaveClass("bg-success", "size-1.5");
  });
});
