import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumb } from "./breadcrumb";

describe("Breadcrumb", () => {
  it("is a named trail from the root to the current page", () => {
    render(<Breadcrumb items={["Nexo Assist", "Meu perfil"]} />);

    const nav = screen.getByRole("navigation", { name: "Caminho" });
    const items = within(nav).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual(["Nexo Assist", "Meu perfil"]);
    expect(items[0]).not.toHaveAttribute("aria-current");
    expect(items[0]).toHaveClass("text-text-muted");
    expect(items[1]).toHaveAttribute("aria-current", "page");
    expect(items[1]).toHaveClass("font-medium", "text-text");
  });

  it("puts a hidden chevron between items only", () => {
    const { container, rerender } = render(<Breadcrumb items={["Nexo Assist", "Atendimento", "Chamado"]} />);

    expect(container.querySelectorAll('li[aria-hidden="true"] svg')).toHaveLength(2);

    rerender(<Breadcrumb items={["Atendimento"]} />);
    expect(container.querySelectorAll("svg")).toHaveLength(0);
    expect(screen.getByRole("listitem")).toHaveAttribute("aria-current", "page");
  });
});
