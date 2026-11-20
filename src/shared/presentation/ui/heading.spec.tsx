import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Heading } from "./heading";

describe("Heading", () => {
  it("renders the heading level with the display serif by default", () => {
    render(
      <Heading level={1} id="login-title">
        Entrar
      </Heading>,
    );

    const heading = screen.getByRole("heading", { level: 1, name: "Entrar" });
    expect(heading).toHaveAttribute("id", "login-title");
    expect(heading).toHaveClass("font-display", "text-display-md", "text-text");
  });

  it("keeps the level independent from the look", () => {
    render(
      <Heading level={3} size="title" tone="on-ink" measure="md">
        Novo chamado
      </Heading>,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Novo chamado" })).toHaveClass(
      "font-sans",
      "font-semibold",
      "text-on-ink",
      "max-w-[31.5rem]",
    );
  });
});
