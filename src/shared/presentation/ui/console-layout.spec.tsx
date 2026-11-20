import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConsoleLayout } from "./console-layout";

describe("ConsoleLayout", () => {
  it("lays out the rail, the named list column and the main area at full height", () => {
    const { container } = render(
      <ConsoleLayout rail={<span>trilho</span>} list={<span>lista</span>} listLabel="Conversas">
        <span>conversa aberta</span>
      </ConsoleLayout>,
    );

    expect(container.firstElementChild).toHaveClass("flex", "h-dvh");
    expect(screen.getByText("trilho").parentElement).toHaveClass("w-16");
    expect(screen.getByRole("region", { name: "Conversas" })).toHaveTextContent("lista");
    expect(screen.getByRole("main")).toHaveTextContent("conversa aberta");
    expect(screen.getByRole("main")).toHaveClass("flex-1", "bg-surface-muted");
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
  });

  it("adds the named side panel when one is given", () => {
    render(
      <ConsoleLayout
        rail={null}
        list={null}
        listLabel="Conversas"
        panel={<span>chamados</span>}
        panelLabel="Chamados do colaborador"
      >
        x
      </ConsoleLayout>,
    );

    const panel = screen.getByRole("complementary", { name: "Chamados do colaborador" });
    expect(panel).toHaveTextContent("chamados");
    expect(panel).toHaveClass("w-85", "border-l");
  });
});
