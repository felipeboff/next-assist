import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Box } from "./box";

describe("Box", () => {
  it("renders a plain div around its children by default", () => {
    const { container } = render(<Box>conteúdo</Box>);

    expect(container.firstElementChild?.tagName).toBe("DIV");
    expect(container.firstElementChild).toHaveTextContent("conteúdo");
    expect(container.firstElementChild).toHaveClass("min-w-0");
  });

  it("renders the semantic element, surface, border, radius, width and spacing it is given", () => {
    render(
      <Box
        as="section"
        aria-label="Resumo"
        surface="ink-raised"
        border="ink-line"
        radius="xl"
        width="card"
        padding="lg"
        paddingX="2xl"
        paddingY="sm"
        grow
        fillHeight
        centered
        data-testid="box"
      >
        x
      </Box>,
    );

    const box = screen.getByRole("region", { name: "Resumo" });
    expect(box.tagName).toBe("SECTION");
    expect(box).toHaveClass(
      "bg-ink-raised",
      "border-ink-line",
      "rounded-xl",
      "max-w-[31.25rem]",
      "p-4",
      "px-6",
      "py-2",
      "flex-1",
      "h-full",
      "mx-auto",
    );
    expect(box).toHaveAttribute("data-testid", "box");
  });

  it.each([
    ["muted", "bg-surface-muted"],
    ["primary-soft", "bg-primary-soft"],
    ["warning-soft", "bg-warning-soft"],
    ["canvas", "bg-canvas"],
    ["subtle", "bg-surface-subtle"],
    ["ink", "bg-ink"],
  ] as const)("paints the %s surface", (surface, surfaceClass) => {
    const { container } = render(<Box surface={surface}>x</Box>);

    expect(container.firstElementChild).toHaveClass(surfaceClass);
  });

  it.each([
    ["reply", "max-w-[37.5rem]"],
    ["page", "max-w-[37.5rem]"],
    ["thread", "max-w-[50.5rem]"],
    ["form", "max-w-[23.75rem]"],
    ["full", "w-full"],
  ] as const)("limits the %s width", (width, widthClass) => {
    const { container } = render(<Box width={width}>x</Box>);

    expect(container.firstElementChild).toHaveClass("w-full", widthClass);
  });

  it("makes a card: soft border, card shadow and children clipped to the radius", () => {
    const { container } = render(
      <Box surface="canvas" border="line-soft" radius="xl" shadow="card" clip>
        x
      </Box>,
    );

    expect(container.firstElementChild).toHaveClass(
      "border",
      "border-line-soft",
      "shadow-card",
      "overflow-hidden",
    );
  });

  it("pads the top and the bottom separately", () => {
    const { container } = render(
      <Box paddingTop="5xl" paddingBottom="lg">
        x
      </Box>,
    );

    expect(container.firstElementChild).toHaveClass("pt-12", "pb-4");
  });

  it("has no border, shadow or clipping unless asked", () => {
    const { container } = render(<Box border="line">x</Box>);

    expect(container.firstElementChild).toHaveClass("border-line");
    expect(container.firstElementChild).not.toHaveClass("shadow-card", "overflow-hidden");
  });
});
