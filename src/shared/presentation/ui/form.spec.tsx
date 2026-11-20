import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "./form";

describe("Form", () => {
  it("submits through its handler and leaves validation to the app", () => {
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <Form onSubmit={onSubmit} aria-label="Entrar">
        campos
      </Form>,
    );

    const form = screen.getByRole("form", { name: "Entrar" });
    expect(form).toHaveAttribute("novalidate");
    expect(form).not.toHaveAttribute("aria-busy");
    expect(form).toHaveClass("gap-5");

    fireEvent.submit(form);
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("marks itself busy while submitting", () => {
    render(
      <Form onSubmit={vi.fn()} busy gap="lg" aria-label="Entrar">
        campos
      </Form>,
    );

    const form = screen.getByRole("form", { name: "Entrar" });
    expect(form).toHaveAttribute("aria-busy", "true");
    expect(form).toHaveClass("gap-4");
  });
});
