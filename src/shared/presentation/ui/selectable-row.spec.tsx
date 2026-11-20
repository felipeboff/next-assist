import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SelectableRow } from "./selectable-row";

describe("SelectableRow", () => {
  it("is a full-width button that opens its item", async () => {
    const onSelect = vi.fn();
    render(
      <SelectableRow selected={false} onSelect={onSelect}>
        Ana Souza · VPN não conecta
      </SelectableRow>,
    );

    const row = screen.getByRole("button", { name: "Ana Souza · VPN não conecta" });
    expect(row).toHaveAttribute("type", "button");
    expect(row).not.toHaveAttribute("aria-current");
    expect(row).toHaveClass("w-full", "text-left", "hover:bg-surface-subtle");

    await userEvent.click(row);
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("stays highlighted and marked while its item is open", () => {
    render(
      <SelectableRow selected onSelect={vi.fn()}>
        Ana Souza
      </SelectableRow>,
    );

    const row = screen.getByRole("button", { name: "Ana Souza" });
    expect(row).toHaveAttribute("aria-current", "true");
    expect(row).toHaveClass("bg-surface-subtle");
  });
});
