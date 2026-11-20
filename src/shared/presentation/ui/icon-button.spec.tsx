import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MessageCircle, Search, SendHorizontal } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "./icon-button";

describe("IconButton", () => {
  it("names an icon-only ghost button that does not submit forms by default", async () => {
    const onClick = vi.fn();
    render(<IconButton icon={Search} label="Buscar na conversa" onClick={onClick} />);

    const button = screen.getByRole("button", { name: "Buscar na conversa" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).not.toHaveAttribute("aria-current");
    expect(button).toHaveClass("text-text-secondary", "size-9", "rounded-md");
    expect(button.querySelector("svg")).toHaveClass("size-[1.125rem]");

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("reads a corner badge in its name and marks the current rail item", () => {
    render(
      <IconButton
        icon={MessageCircle}
        label="Conversas"
        variant="tile"
        size="lg"
        current
        badge={3}
        badgeLabel="aguardando"
      />,
    );

    const button = screen.getByRole("button", { name: "Conversas, 3 aguardando" });
    expect(button).toHaveAttribute("aria-current", "page");
    expect(button).toHaveClass("size-11", "rounded-lg", "aria-[current=page]:bg-canvas");
    expect(button.querySelector("svg")).toHaveClass("size-5");
    const badge = button.querySelector('[aria-hidden="true"]:not(svg)');
    expect(badge).toHaveTextContent("3");
    expect(badge).toHaveClass("bg-primary", "absolute");
  });

  it("reads a badge without a label as the bare count, and none at zero", () => {
    const { rerender } = render(<IconButton icon={MessageCircle} label="Conversas" badge={2} />);
    expect(screen.getByRole("button", { name: "Conversas, 2" })).toBeInTheDocument();

    rerender(<IconButton icon={MessageCircle} label="Conversas" badge={0} />);
    const button = screen.getByRole("button", { name: "Conversas" });
    expect(button.querySelector("span")).not.toBeInTheDocument();
  });

  it("can be a round primary submit button, small or secondary, and passes ARIA through", async () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <IconButton
        icon={SendHorizontal}
        label="Enviar"
        variant="primary"
        shape="round"
        type="submit"
        disabled
        onClick={onClick}
      />,
    );

    const send = screen.getByRole("button", { name: "Enviar" });
    expect(send).toHaveAttribute("type", "submit");
    expect(send).toHaveClass("bg-primary", "rounded-full", "disabled:opacity-50");
    expect(send).toBeDisabled();
    await userEvent.click(send);
    expect(onClick).not.toHaveBeenCalled();

    rerender(
      <IconButton
        icon={Search}
        label="Mais ações"
        variant="secondary"
        size="sm"
        aria-haspopup="menu"
        aria-expanded={false}
        aria-controls="menu-1"
      />,
    );
    const more = screen.getByRole("button", { name: "Mais ações" });
    expect(more).toHaveClass("border-line", "size-8");
    expect(more).toHaveAttribute("aria-haspopup", "menu");
    expect(more).toHaveAttribute("aria-expanded", "false");
    expect(more).toHaveAttribute("aria-controls", "menu-1");
  });
});
