import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FilterChips } from "./filter-chips";

const options = [
  { value: "all", label: "Todas" },
  { value: "for-you", label: "Para você", count: 3 },
  { value: "mine", label: "Minhas", count: 0 },
] as const;

describe("FilterChips", () => {
  it("is a named group of toggles; the active filter is pressed", () => {
    render(<FilterChips label="Filtros" options={options} value="for-you" onChange={vi.fn()} />);

    const group = screen.getByRole("group", { name: "Filtros" });
    const active = within(group).getByRole("button", { name: /^Para você/ });
    expect(active).toHaveAttribute("type", "button");
    expect(active).toHaveAttribute("aria-pressed", "true");
    expect(active).toHaveClass("bg-primary-soft", "text-primary");
    expect(within(active).getByText("3")).toHaveClass("tabular-nums", "text-primary");

    const other = within(group).getByRole("button", { name: /^Minhas/ });
    expect(other).toHaveAttribute("aria-pressed", "false");
    expect(other).toHaveClass("bg-surface-subtle", "text-text-secondary");
    expect(within(other).getByText("0")).toHaveClass("text-text-muted");
  });

  it("shows no count when an option has none, and reports the filter picked", async () => {
    const onChange = vi.fn();
    render(<FilterChips label="Filtros" options={options} value="for-you" onChange={onChange} />);

    const all = screen.getByRole("button", { name: "Todas" });
    expect(all.children).toHaveLength(0);

    await userEvent.click(all);
    expect(onChange).toHaveBeenCalledExactlyOnceWith("all");
  });
});
