import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text } from "./text";

describe("Text", () => {
  it("renders a paragraph in the default size, tone and weight", () => {
    render(<Text>Use seu e-mail corporativo.</Text>);

    const text = screen.getByText("Use seu e-mail corporativo.");
    expect(text.tagName).toBe("P");
    expect(text).toHaveClass("text-md", "text-text", "font-normal", "text-left");
  });

  it("renders the element, size, tone, weight and layout options it is given", () => {
    render(
      <Text
        as="span"
        id="hint"
        size="2xs"
        tone="on-ink-subtle"
        weight="semibold"
        align="end"
        measure="md"
        truncate
        nowrap
        tabular
        role="status"
        aria-live="polite"
      >
        INC-20517
      </Text>,
    );

    const text = screen.getByRole("status");
    expect(text.tagName).toBe("SPAN");
    expect(text).toHaveAttribute("id", "hint");
    expect(text).toHaveAttribute("aria-live", "polite");
    expect(text).toHaveClass(
      "text-2xs",
      "text-on-ink-subtle",
      "font-semibold",
      "text-right",
      "max-w-[31.5rem]",
      "truncate",
      "whitespace-nowrap",
      "tabular-nums",
    );
    expect(text).not.toHaveClass("italic");
  });

  it.each(["2xl", "3xl"] as const)("has the %s size and can be italic", (size) => {
    render(
      <Text size={size} italic>
        Sem mensagens ainda
      </Text>,
    );

    expect(screen.getByText("Sem mensagens ainda")).toHaveClass(`text-${size}`, "italic");
  });
});
