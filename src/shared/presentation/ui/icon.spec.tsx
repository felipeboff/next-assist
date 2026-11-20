import { render, screen } from "@testing-library/react";
import { Mail } from "lucide-react";
import { describe, expect, it } from "vitest";
import { Icon } from "./icon";

describe("Icon", () => {
  it("is decorative and hidden from assistive technology by default", () => {
    const { container } = render(<Icon icon={Mail} />);

    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("size-4", "text-inherit");
  });

  it("is announced as an image when it carries meaning", () => {
    render(<Icon icon={Mail} size="lg" tone="primary" label="E-mail" />);

    expect(screen.getByRole("img", { name: "E-mail" })).toHaveClass("size-5", "text-primary");
  });
});
