import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextAreaField } from "./text-area-field";

describe("TextAreaField", () => {
  it("is a labelled three-row text area with no description by default", async () => {
    const onChange = vi.fn();
    render(<TextAreaField name="description" label="Descrição" value="" onChange={onChange} />);

    const field = screen.getByRole("textbox", { name: "Descrição" });
    expect(field.tagName).toBe("TEXTAREA");
    expect(field).toHaveAttribute("name", "description");
    expect(field).toHaveAttribute("rows", "3");
    expect(field).not.toHaveAttribute("aria-invalid");
    expect(field).not.toHaveAttribute("aria-describedby");
    expect(field).toBeEnabled();

    await userEvent.type(field, "V");
    expect(onChange).toHaveBeenCalledExactlyOnceWith("V");
  });

  it("links the hint and the error to the field and marks it invalid", () => {
    render(
      <TextAreaField
        name="description"
        label="Descrição"
        value="Erro 809"
        onChange={vi.fn()}
        rows={5}
        hint="Conte o que você já tentou."
        error="Descreva o problema."
      />,
    );

    const field = screen.getByRole("textbox", { name: "Descrição" });
    expect(field).toHaveValue("Erro 809");
    expect(field).toHaveAttribute("rows", "5");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription("Conte o que você já tentou. Descreva o problema.");
    expect(screen.getByText("Descreva o problema.")).toHaveClass("text-danger");
  });

  it("can be disabled", () => {
    render(<TextAreaField name="description" label="Descrição" value="" onChange={vi.fn()} disabled />);

    expect(screen.getByRole("textbox", { name: "Descrição" })).toBeDisabled();
  });
});
