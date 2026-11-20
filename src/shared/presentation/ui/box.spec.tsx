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
});
