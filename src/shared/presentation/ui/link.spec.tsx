import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Link } from "./link";

describe("Link", () => {
  it("navigates inside the app in the same tab", () => {
    render(<Link href="/login">Entrar</Link>);

    const link = screen.getByRole("link", { name: "Entrar" });
    expect(link).toHaveAttribute("href", "/login");
    expect(link).not.toHaveAttribute("target");
    expect(link).toHaveClass("text-primary", "text-xs", "font-normal");
  });

  it("dials a phone extension with a plain anchor", () => {
    render(
      <Link href="tel:4000" tone="muted" size="sm" weight="semibold">
        Ligue no ramal 4000
      </Link>,
    );

    const link = screen.getByRole("link", { name: "Ligue no ramal 4000" });
    expect(link).toHaveAttribute("href", "tel:4000");
    expect(link).not.toHaveAttribute("target");
    expect(link).toHaveClass("text-text-muted", "text-sm", "font-semibold");
  });

  it("opens an external page in a new tab without sharing the opener", () => {
    render(
      <Link href="/docs" external>
        Documentação
      </Link>,
    );

    const link = screen.getByRole("link", { name: "Documentação" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
