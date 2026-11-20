import { render, screen } from "@testing-library/react";
import { Bot } from "lucide-react";
import { describe, expect, it } from "vitest";
import { Tag } from "./tag";

describe("Tag", () => {
  it("shows its content on a white small pill by default", () => {
    const { container } = render(<Tag>Rede e VPN</Tag>);

    expect(screen.getByText("Rede e VPN")).toHaveClass("truncate");
    expect(container.firstElementChild?.tagName).toBe("SPAN");
    expect(container.firstElementChild).toHaveClass(
      "bg-canvas",
      "text-text",
      "rounded-full",
      "px-2.5",
      "text-2xs",
    );
    expect(container.querySelector("[aria-hidden]")).not.toBeInTheDocument();
  });

  it("leads with a status dot when one is given", () => {
    const { container } = render(
      <Tag surface="soft" dot="warning">
        INC-20517
      </Tag>,
    );

    expect(container.firstElementChild).toHaveClass("bg-primary-soft");
    expect(container.querySelector(".bg-warning")).toBeInTheDocument();
  });

  it.each([
    ["subtle", ["bg-surface-subtle", "text-text"]],
    ["canvas", ["bg-canvas", "text-text"]],
  ] as const)("takes the %s surface", (surface, classes) => {
    const { container } = render(<Tag surface={surface}>Tag</Tag>);

    expect(container.firstElementChild).toHaveClass(...classes);
  });

  it.each([
    ["neutral", ["bg-surface-subtle", "text-text-secondary"]],
    ["primary", ["bg-primary-tint", "text-primary"]],
    ["success", ["bg-success-soft", "text-success-text"]],
    ["success-tint", ["bg-success-tint", "text-success-text"]],
    ["warning", ["bg-warning-soft", "text-warning-text"]],
    ["danger", ["bg-danger-soft", "text-danger"]],
  ] as const)("tints the %s tone, which wins over the surface", (tone, classes) => {
    const { container } = render(
      <Tag surface="soft" tone={tone}>
        Online
      </Tag>,
    );

    expect(container.firstElementChild).toHaveClass(...classes);
    expect(container.firstElementChild).not.toHaveClass("bg-primary-soft");
  });

  it("leads with an icon and takes the size and the shape", () => {
    const { container, rerender } = render(
      <Tag tone="warning" size="md" icon={Bot}>
        Aguardando analista
      </Tag>,
    );

    expect(container.firstElementChild).toHaveClass("px-3", "text-xs", "font-medium");
    expect(container.querySelector("svg")).toHaveClass("size-3.5");

    rerender(
      <Tag tone="primary" size="xs" shape="rounded">
        IA
      </Tag>,
    );
    expect(container.firstElementChild).toHaveClass("px-1.5", "font-semibold", "rounded-xs");
    expect(container.firstElementChild).not.toHaveClass("rounded-full");
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });
});
