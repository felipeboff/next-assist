import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mail } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { TextField } from "./text-field";

describe("TextField", () => {
  it("is a labelled text input with no description by default", async () => {
    const onChange = vi.fn();
    render(<TextField name="name" label="Nome" onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "Nome" });
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("name", "name");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
    expect(input).toHaveClass("pl-3.5");

    await userEvent.type(input, "Ana");
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it("shows the icon, the label action, the hint and the error, linked to the input", () => {
    const { container } = render(
      <TextField
        name="email"
        type="email"
        label="E-mail corporativo"
        icon={Mail}
        placeholder="nome@nexo.com.br"
        labelAction={<a href="#ajuda">Ajuda</a>}
        hint="O mesmo da rede Nexo."
        error="Informe seu e-mail corporativo."
      />,
    );

    const input = screen.getByRole("textbox", { name: "E-mail corporativo" });
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "nome@nexo.com.br");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("O mesmo da rede Nexo. Informe seu e-mail corporativo.");
    expect(input).toHaveClass("pl-10");
    expect(screen.getByRole("link", { name: "Ajuda" })).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("can be disabled", () => {
    render(<TextField name="email" label="E-mail" disabled />);

    expect(screen.getByRole("textbox", { name: "E-mail" })).toBeDisabled();
  });
});
