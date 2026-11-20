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

  it.each([
    ["page", "text-3xl"],
    ["section", "text-2xl"],
  ] as const)("has a sans %s title for app pages", (size, sizeClass) => {
    render(
      <Heading level={1} size={size} tone="muted">
        Meu perfil
      </Heading>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Meu perfil" })).toHaveClass(
      "font-sans",
      sizeClass,
      "font-semibold",
      "tracking-tight",
      "text-text-muted",
    );
  });
});
