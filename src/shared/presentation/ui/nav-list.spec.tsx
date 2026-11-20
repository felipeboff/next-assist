import { render, screen, within } from "@testing-library/react";
import { MessageSquare, UserRound } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { NavList } from "./nav-list";

vi.mock("next/navigation", () => ({ usePathname: () => "/perfil" }));

const items = [
  { href: "/", label: "Atendimento", icon: MessageSquare },
  { href: "/perfil", label: "Meu perfil", icon: UserRound },
];

describe("NavList", () => {
  it("is a named list of links, each with its icon", () => {
    render(<NavList label="Navegação principal" items={items} />);

    const nav = screen.getByRole("navigation", { name: "Navegação principal" });
    expect(within(nav).getAllByRole("listitem")).toHaveLength(2);
    const chat = within(nav).getByRole("link", { name: "Atendimento" });
    expect(chat).toHaveAttribute("href", "/");
    expect(chat.querySelector("svg")).toHaveClass("size-[1.125rem]");
  });

  it("marks the link of the current route", () => {
    render(<NavList label="Navegação principal" items={items} />);

    const profile = screen.getByRole("link", { name: "Meu perfil" });
    expect(profile).toHaveAttribute("aria-current", "page");
    expect(profile).toHaveClass("bg-primary-soft", "font-medium", "text-primary");

    const chat = screen.getByRole("link", { name: "Atendimento" });
    expect(chat).not.toHaveAttribute("aria-current");
    expect(chat).toHaveClass("text-text-secondary");
  });
});
