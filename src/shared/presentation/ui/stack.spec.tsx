import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stack } from "./stack";

describe("Stack", () => {
  it("stacks its children in a column with no gap by default", () => {
    const { container } = render(
      <Stack>
        <span>a</span>
        <span>b</span>
      </Stack>,
    );

    const stack = container.firstElementChild;
    expect(stack?.tagName).toBe("DIV");
    expect(stack).toHaveClass("flex", "flex-col", "gap-0", "items-stretch", "justify-start");
    expect(stack?.children).toHaveLength(2);
  });

  it("lays out a row with the alignment, gap, wrap and spacing it is given", () => {
    render(
      <Stack
        as="nav"
        aria-label="Seções"
        direction="row"
        gap="lg"
        align="baseline"
        justify="between"
        wrap
        grow
        fillHeight
        width="full"
        paddingTop="md"
      >
        <span>a</span>
      </Stack>,
    );

    expect(screen.getByRole("navigation", { name: "Seções" })).toHaveClass(
      "flex-row",
      "gap-4",
      "items-baseline",
      "justify-between",
      "flex-wrap",
      "flex-1",
      "h-full",
      "w-full",
      "pt-3",
    );
  });
});
