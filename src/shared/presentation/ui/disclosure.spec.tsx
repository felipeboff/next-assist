import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Disclosure } from "./disclosure";

describe("Disclosure", () => {
  it("is a collapsed toggle that shows its detail in place when pressed", async () => {
    const { container } = render(
      <Disclosure summary="Ver o raciocínio">Consultei a base de conhecimento.</Disclosure>,
    );

    const toggle = screen.getByRole("button", { name: "Ver o raciocínio" });
    expect(toggle).toHaveAttribute("type", "button");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).not.toHaveAttribute("title");
    expect(toggle).toHaveClass("inline-flex", "self-start");
    const detail = container.querySelector(`#${CSS.escape(toggle.getAttribute("aria-controls") ?? "")}`);
    expect(detail).not.toBeVisible();
    expect(screen.queryByText("Consultei a base de conhecimento.")).not.toBeInTheDocument();

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(detail).toBeVisible();
    expect(detail).toHaveTextContent("Consultei a base de conhecimento.");
    expect(toggle.querySelector(".rotate-180")).toBeInTheDocument();

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Consultei a base de conhecimento.")).not.toBeInTheDocument();
  });

  it("can start open, sit at the end, explain itself and keep a preview always shown", () => {
    render(
      <Disclosure
        summary="2 ações"
        hint="Ver o que o agente fez"
        align="end"
        preview={<p>Resposta</p>}
        defaultOpen
      >
        Detalhe
      </Disclosure>,
    );

    const toggle = screen.getByRole("button", { name: "2 ações" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAttribute("title", "Ver o que o agente fez");
    expect(toggle).toHaveClass("self-end");
    expect(screen.getByText("Resposta")).toBeVisible();
    expect(screen.getByText("Detalhe")).toBeVisible();
  });

  it("has a full-width row variant whose chevron turns right to down", async () => {
    const { container } = render(
      <Disclosure variant="row" summary="INC-20517">
        Histórico do chamado
      </Disclosure>,
    );

    expect(container.firstElementChild).toHaveClass("w-full");
    const toggle = screen.getByRole("button", { name: "INC-20517" });
    expect(toggle).toHaveClass("w-full", "py-3");
    expect(toggle.querySelector(".rotate-90")).not.toBeInTheDocument();

    await userEvent.click(toggle);
    expect(toggle.querySelector(".rotate-90")).toBeInTheDocument();
    expect(screen.getByText("Histórico do chamado")).toBeVisible();
  });
});
