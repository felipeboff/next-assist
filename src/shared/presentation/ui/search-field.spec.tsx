import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchField } from "./search-field";

describe("SearchField", () => {
  it("is a labelled search input with its magnifier, in the default size", async () => {
    const onChange = vi.fn();
    const { container } = render(
      <SearchField label="Buscar conversas" placeholder="Buscar conversas" value="" onChange={onChange} />,
    );

    const input = screen.getByRole("searchbox", { name: "Buscar conversas" });
    expect(input).toHaveAttribute("type", "search");
    expect(input).toHaveAttribute("placeholder", "Buscar conversas");
    expect(input).not.toHaveFocus();
    expect(input).toHaveClass("rounded-full", "bg-surface-subtle", "pl-10", "h-9");
    expect(container.querySelector("svg")).toBeInTheDocument();

    await userEvent.type(input, "v");
    expect(onChange).toHaveBeenCalledExactlyOnceWith("v");
  });

  it("can be small, take focus on mount and hear keys", async () => {
    const onKeyDown = vi.fn();
    render(
      <SearchField
        label="Buscar na conversa"
        value="vpn"
        onChange={vi.fn()}
        onKeyDown={onKeyDown}
        size="sm"
        autoFocus
      />,
    );

    const input = screen.getByRole("searchbox", { name: "Buscar na conversa" });
    expect(input).toHaveValue("vpn");
    expect(input).toHaveFocus();
    expect(input).toHaveClass("h-8");

    await userEvent.keyboard("{Escape}");
    expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: "Escape" }));
  });
});
