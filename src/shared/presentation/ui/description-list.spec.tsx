import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DescriptionList } from "./description-list";

const items = [
  { label: "Categoria", value: "Rede e VPN" },
  { label: "Prioridade", value: "Alta" },
];

describe("DescriptionList", () => {
  it("puts each label over its value in three columns by default", () => {
    const { container } = render(<DescriptionList items={items} />);

    expect(container.firstElementChild?.tagName).toBe("DL");
    expect(container.firstElementChild).toHaveClass("grid", "grid-cols-3");
    expect(screen.getAllByRole("term").map((term) => term.textContent)).toEqual(["Categoria", "Prioridade"]);
    expect(screen.getAllByRole("definition").map((value) => value.textContent)).toEqual([
      "Rede e VPN",
      "Alta",
    ]);
    expect(screen.getByText("Categoria")).toHaveClass("text-xs", "text-text-muted");
  });

  it("takes the number of columns", () => {
    const { container } = render(<DescriptionList items={items} columns={2} />);

    expect(container.firstElementChild).toHaveClass("grid-cols-2");
  });

  it("puts the label beside the value, one per row, with an optional aside", () => {
    const { container } = render(
      <DescriptionList
        layout="rows"
        items={[
          { label: "Nome", value: "Ana Souza" },
          { label: "E-mail", value: "ana.souza@nexo.com.br", aside: "Gerenciado pela TI" },
        ]}
      />,
    );

    expect(container.firstElementChild).toHaveClass("divide-y");
    expect(container.firstElementChild).not.toHaveClass("grid");
    expect(screen.getAllByRole("term")).toHaveLength(2);
    expect(screen.getAllByRole("definition").map((value) => value.textContent)).toEqual([
      "Ana Souza",
      "ana.souza@nexo.com.br",
      "Gerenciado pela TI",
    ]);
    expect(screen.getByText("Gerenciado pela TI")).toHaveClass("text-xs", "text-text-muted");
  });
});
