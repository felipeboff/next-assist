import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("toggles when its label is clicked and takes its id from the name", async () => {
    render(<Checkbox name="rememberMe" label="Manter conectado neste computador" defaultChecked />);

    const checkbox = screen.getByRole("checkbox", { name: "Manter conectado neste computador" });
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute("id", "checkbox-rememberMe");
    expect(checkbox).toHaveAttribute("name", "rememberMe");

    await userEvent.click(screen.getByText("Manter conectado neste computador"));
    expect(checkbox).not.toBeChecked();
  });

  it("works controlled with its own id", async () => {
    const onChange = vi.fn();
    render(<Checkbox name="terms" id="accept-terms" label="Aceito" checked={false} onChange={onChange} />);

    const checkbox = screen.getByRole("checkbox", { name: "Aceito" });
    expect(checkbox).toHaveAttribute("id", "accept-terms");

    await userEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("cannot be changed when disabled", () => {
    render(<Checkbox name="rememberMe" label="Manter conectado" disabled />);

    expect(screen.getByRole("checkbox", { name: "Manter conectado" })).toBeDisabled();
  });
});
