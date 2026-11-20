import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert } from "./alert";

describe("Alert", () => {
  it("announces an error right away", () => {
    render(<Alert>Não foi possível entrar agora.</Alert>);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Não foi possível entrar agora.");
    expect(alert).toHaveClass("bg-danger-soft");
  });

  it("announces information politely", () => {
    render(<Alert tone="info">Chamado atualizado.</Alert>);

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Chamado atualizado.");
    expect(status).toHaveClass("bg-primary-soft");
  });
});
