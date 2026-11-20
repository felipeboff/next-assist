import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ArrowLeftRight, CircleCheck, EllipsisVertical, LogOut } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { Menu, type MenuItem } from "./menu";

function conversationItems(onClose = vi.fn()): MenuItem[] {
  return [
    { label: "Transferir", onSelect: vi.fn(), icon: ArrowLeftRight, disabled: true },
    { label: "Ver chamados", onSelect: vi.fn() },
    { label: "Encerrar conversa", onSelect: onClose, icon: CircleCheck, tone: "danger" },
  ];
}

describe("Menu", () => {
  it("is a named icon trigger that opens its items below and focuses the first enabled one", async () => {
    render(<Menu label="Mais ações" icon={EllipsisVertical} items={conversationItems()} />);

    const trigger = screen.getByRole("button", { name: "Mais ações" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("aria-controls");
    expect(trigger).toHaveClass("size-9");
    expect(trigger.querySelector("svg")).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await userEvent.click(trigger);
    const menu = screen.getByRole("menu", { name: "Mais ações" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", menu.id);
    expect(menu).toHaveClass("top-full", "right-0");

    const items = within(menu).getAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Transferir",
      "Ver chamados",
      "Encerrar conversa",
    ]);
    expect(items[0]).toBeDisabled();
    expect(items[0].querySelector("svg")).toBeInTheDocument();
    expect(items[1]).toHaveFocus();
    expect(items[1]).toHaveClass("text-text");
    expect(items[1].querySelector("svg")).not.toBeInTheDocument();
    expect(items[2]).toHaveClass("text-danger");

    await userEvent.click(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes, gives focus back to the trigger and runs the item that is picked", async () => {
    const onClose = vi.fn();
    render(<Menu label="Mais ações" icon={EllipsisVertical} items={conversationItems(onClose)} />);

    const trigger = screen.getByRole("button", { name: "Mais ações" });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole("menuitem", { name: "Encerrar conversa" }));

    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("moves between enabled items with the arrow keys, wrapping, and closes on Escape", async () => {
    render(<Menu label="Mais ações" icon={EllipsisVertical} items={conversationItems()} />);

    const trigger = screen.getByRole("button", { name: "Mais ações" });
    await userEvent.click(trigger);
    const tickets = screen.getByRole("menuitem", { name: "Ver chamados" });
    const close = screen.getByRole("menuitem", { name: "Encerrar conversa" });

    await userEvent.keyboard("{ArrowDown}");
    expect(close).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(tickets).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    expect(close).toHaveFocus();
    await userEvent.keyboard("a");
    expect(close).toHaveFocus();
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes on a click outside, not on a click inside", async () => {
    render(
      <>
        <p>fora</p>
        <Menu
          label="Conta de Ana Souza"
          trigger={<span>AS</span>}
          header={<p>ana.souza@nexo.com.br</p>}
          placement="right-end"
          items={[{ label: "Sair", icon: LogOut, onSelect: vi.fn() }]}
        />
      </>,
    );

    const trigger = screen.getByRole("button", { name: "Conta de Ana Souza" });
    expect(trigger).toHaveClass("rounded-full");
    expect(trigger).not.toHaveClass("size-9");
    expect(trigger).toHaveTextContent("AS");

    await userEvent.click(trigger);
    const menu = screen.getByRole("menu", { name: "Conta de Ana Souza" });
    expect(menu).toHaveClass("left-full", "bottom-0");
    await userEvent.click(within(menu).getByText("ana.souza@nexo.com.br"));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await userEvent.click(screen.getByText("fora"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
