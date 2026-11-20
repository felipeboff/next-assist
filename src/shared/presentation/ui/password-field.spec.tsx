import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lock } from "lucide-react";
import { describe, expect, it } from "vitest";
import { PasswordField } from "./password-field";

describe("PasswordField", () => {
  it("hides the password until asked to show it, then hides it again", async () => {
    render(<PasswordField name="password" label="Senha" />);

    const input = screen.getByLabelText("Senha");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("autocomplete", "current-password");
    expect(input).not.toHaveAttribute("aria-describedby");
    expect(input).toHaveClass("pl-3.5");

    const show = screen.getByRole("button", { name: "Mostrar senha" });
    expect(show).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(show);

    expect(input).toHaveAttribute("type", "text");
    const hide = screen.getByRole("button", { name: "Ocultar senha" });
    expect(hide).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(hide);

    expect(input).toHaveAttribute("type", "password");
  });

  it("shows the icon, the hint and the error, with custom toggle labels", () => {
    render(
      <PasswordField
        name="password"
        label="Nova senha"
        icon={Lock}
        autoComplete="new-password"
        placeholder="Digite sua senha"
        hint="Use 8 caracteres ou mais."
        error="Informe sua senha."
        showLabel="Ver"
        hideLabel="Esconder"
      />,
    );

    const input = screen.getByLabelText("Nova senha");
    expect(input).toHaveAttribute("autocomplete", "new-password");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Use 8 caracteres ou mais. Informe sua senha.");
    expect(input).toHaveClass("pl-10");
    expect(screen.getByRole("button", { name: "Ver" })).toBeInTheDocument();
  });

  it("disables the input and the toggle together", () => {
    render(<PasswordField name="password" label="Senha" disabled />);

    expect(screen.getByLabelText("Senha")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Mostrar senha" })).toBeDisabled();
  });
});
