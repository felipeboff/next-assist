import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ArrowRight, LogOut } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("is a primary button that does not submit forms by default", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Salvar</Button>);

    const button = screen.getByRole("button", { name: "Salvar" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toBeEnabled();
    expect(button).not.toHaveAttribute("aria-busy");
    expect(button).toHaveClass("bg-primary", "h-9");

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("shows the icons before and after the label", () => {
    const { container } = render(
      <Button type="submit" variant="secondary" size="lg" block iconStart={LogOut} iconEnd={ArrowRight}>
        Sair
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Sair" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveClass("border-line", "h-11", "w-full");
    expect(container.querySelectorAll("svg")).toHaveLength(2);
  });

  it("blocks clicks and shows the loading label while it works", async () => {
    const onClick = vi.fn();
    const { container } = render(
      <Button iconEnd={ArrowRight} loading loadingLabel="Entrando…" onClick={onClick}>
        Entrar
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Entrando…" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
    expect(container.querySelector("svg")).not.toBeInTheDocument();

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps the label while loading when no loading label is given", () => {
    render(
      <Button loading variant="ghost">
        Sair
      </Button>,
    );

    expect(screen.getByRole("button", { name: "Sair" })).toBeDisabled();
  });

  it("can be disabled and look like a link", () => {
    render(
      <Button variant="link" size="sm" disabled aria-expanded={false}>
        Esqueci minha senha
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Esqueci minha senha" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveClass("text-primary", "text-xs");
    expect(button).not.toHaveClass("h-8");
  });
});
