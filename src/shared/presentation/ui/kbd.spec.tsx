import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Kbd } from "./kbd";

describe("Kbd", () => {
  it("renders the shortcut in a kbd element with the default tone", () => {
    const { container } = render(<Kbd>Esc</Kbd>);

    const kbd = container.firstElementChild;
    expect(kbd?.tagName).toBe("KBD");
    expect(kbd).toHaveTextContent("Esc");
    expect(kbd).not.toHaveAttribute("aria-label");
    expect(kbd).toHaveClass("border-line", "bg-surface-subtle", "text-text-muted");
  });

  it("is read out by its label and sits on a primary button with the on-primary tone", () => {
    const { container } = render(
      <Kbd tone="on-primary" label="Control+Enter">
        Ctrl ↵
      </Kbd>,
    );

    const kbd = container.firstElementChild;
    expect(kbd).toHaveAttribute("aria-label", "Control+Enter");
    expect(kbd).toHaveClass("bg-on-ink/20", "text-on-ink");
  });
});
