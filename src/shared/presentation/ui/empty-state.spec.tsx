import { render, screen } from "@testing-library/react";
import { MessageSquareText } from "lucide-react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("shows the icon, the title, the description and a way forward", () => {
    const { container } = render(
      <EmptyState icon={MessageSquareText} title="Olá, Ana!" description="Conte o que está acontecendo.">
        <button type="button">Minha VPN não conecta</button>
      </EmptyState>,
    );

    expect(container.firstElementChild).toHaveClass("flex-1", "items-center", "text-center");
    expect(container.querySelector(".rounded-full svg")).toBeInTheDocument();
    expect(screen.getByText("Olá, Ana!")).toHaveClass("text-md", "font-medium");
    expect(screen.getByText("Conte o que está acontecendo.")).toHaveClass("text-sm", "text-text-muted");
    expect(screen.getByRole("button", { name: "Minha VPN não conecta" })).toBeInTheDocument();
  });

  it("can be just a title", () => {
    const { container } = render(<EmptyState title="Nenhuma conversa neste filtro" />);

    expect(container.querySelector("svg")).not.toBeInTheDocument();
    expect(container.querySelectorAll("p")).toHaveLength(1);
    expect(screen.getByText("Nenhuma conversa neste filtro")).toBeInTheDocument();
  });
});
