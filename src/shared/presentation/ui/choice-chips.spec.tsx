import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ChoiceChips } from "./choice-chips";

const options = ["Windows", "macOS", "Linux"];

describe("ChoiceChips", () => {
  it("offers each option as a toggle in a named group and reports the one chosen", async () => {
    const onChoose = vi.fn();
    render(<ChoiceChips label="Qual sistema?" options={options} chosen={null} onChoose={onChoose} />);

    const group = screen.getByRole("group", { name: "Qual sistema?" });
    const buttons = within(group).getAllByRole("button");
    expect(buttons.map((button) => button.textContent)).toEqual(options);
    const macos = within(group).getByRole("button", { name: "macOS" });
    expect(macos).toHaveAttribute("type", "button");
    expect(macos).toHaveAttribute("aria-pressed", "false");
    expect(macos).toBeEnabled();
    expect(macos).toHaveClass("border-line", "bg-canvas");

    await userEvent.click(macos);
    expect(onChoose).toHaveBeenCalledExactlyOnceWith("macOS");
  });

  it("marks the chosen option and locks them all: the choice is made once", async () => {
    const onChoose = vi.fn();
    render(<ChoiceChips label="Qual sistema?" options={options} chosen="Linux" onChoose={onChoose} />);

    const linux = screen.getByRole("button", { name: "Linux" });
    expect(linux).toHaveAttribute("aria-pressed", "true");
    expect(linux).toHaveClass("border-primary-line", "bg-primary-soft", "text-primary");
    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
    }

    await userEvent.click(screen.getByRole("button", { name: "Windows" }));
    expect(onChoose).not.toHaveBeenCalled();
  });

  it("can be disabled before any choice", () => {
    render(<ChoiceChips label="Qual sistema?" options={options} chosen={null} disabled onChoose={vi.fn()} />);

    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-pressed", "false");
    }
  });
});
