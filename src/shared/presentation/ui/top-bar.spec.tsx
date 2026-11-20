import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TopBar } from "./top-bar";

describe("TopBar", () => {
  it("is the page header with where you are on the start and the status on the end", () => {
    render(<TopBar start={<span>Atendimento</span>} end={<span>Online</span>} />);

    const bar = screen.getByRole("banner");
    expect(bar).toHaveClass("h-16", "justify-between", "border-b");
    expect(bar.firstElementChild).toHaveTextContent("Atendimento");
    expect(screen.getByText("Online").parentElement).toHaveClass("flex", "gap-3");
  });

  it("can have the start only", () => {
    render(<TopBar start={<span>Meu perfil</span>} />);

    expect(screen.getByRole("banner").children).toHaveLength(1);
  });
});
