import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Divider } from "./divider";

describe("Divider", () => {
  it("is a subtle horizontal rule by default", () => {
    render(<Divider />);

    const divider = screen.getByRole("separator");
    expect(divider.tagName).toBe("HR");
    expect(divider).toHaveClass("border-line-subtle");
  });

  it("separates side-by-side content vertically", () => {
    render(<Divider orientation="vertical" tone="ink" />);

    const divider = screen.getByRole("separator");
    expect(divider).toHaveAttribute("aria-orientation", "vertical");
    expect(divider).toHaveClass("border-ink-divider");
  });
});
