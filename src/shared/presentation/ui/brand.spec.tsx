import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Brand } from "./brand";

describe("Brand", () => {
  it("draws the blue mark and the ink wordmark for light surfaces", () => {
    render(<Brand />);

    const logo = screen.getByRole("img", { name: "Nexo Assist" });
    const [mark, wordmark] = Array.from(logo.querySelectorAll("path"));
    expect(mark).toHaveClass("fill-brand");
    expect(wordmark).toHaveClass("fill-ink");
  });

  it("draws only the white mark on the ink surface", () => {
    render(<Brand tone="on-ink" variant="mark" label="Início" />);

    const mark = screen.getByRole("img", { name: "Início" });
    expect(mark.querySelectorAll("path")).toHaveLength(1);
    expect(mark.querySelector("path")).toHaveClass("fill-on-ink");
  });
});
