import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusLabel } from "./status-label";

describe("StatusLabel", () => {
  it("paints the words in the tone, small, after a hidden dot of the same tone by default", () => {
    const { container } = render(<StatusLabel tone="warning">Aguardando analista</StatusLabel>);

    const label = container.firstElementChild;
    expect(label).toHaveClass("text-xs", "text-warning-text");
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass("bg-warning", "size-1.5");
    expect(screen.getByText("Aguardando analista")).toHaveClass("truncate");
  });

  it.each([
    ["success", "text-success-text"],
    ["danger", "text-danger"],
    ["primary", "text-primary"],
    ["muted", "text-text-muted"],
  ] as const)("colors the %s tone", (tone, textClass) => {
    const { container } = render(<StatusLabel tone={tone}>Status</StatusLabel>);

    expect(container.firstElementChild).toHaveClass(textClass);
  });

  it("can keep the body color and take a text size", () => {
    const { container } = render(
      <StatusLabel tone="success" size="sm" text="plain">
        Resolvido
      </StatusLabel>,
    );

    expect(container.firstElementChild).toHaveClass("text-sm", "text-text");
    expect(container.firstElementChild).not.toHaveClass("text-success-text");
    expect(container.querySelector(".bg-success")).toBeInTheDocument();
  });
});
