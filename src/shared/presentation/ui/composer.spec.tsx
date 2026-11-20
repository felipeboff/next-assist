import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Composer, type ComposerProps } from "./composer";

function renderComposer(props: Partial<ComposerProps> = {}) {
  const onChange = vi.fn();
  const onSubmit = vi.fn();
  const utils = render(
    <Composer
      label="Mensagem"
      placeholder="Descreva seu problema"
      value=""
      onChange={onChange}
      onSubmit={onSubmit}
      submitLabel="Enviar"
      {...props}
    />,
  );
  const input = screen.getByRole("textbox", { name: "Mensagem" }) as HTMLInputElement;
  return { ...utils, input, onChange, onSubmit };
}

describe("Composer", () => {
  it("is a labelled input with a labelled send button inside a bordered box by default", async () => {
    const { input, onChange } = renderComposer();

    expect(input).toHaveAttribute("placeholder", "Descreva seu problema");
    expect(input).toHaveAttribute("autocomplete", "off");
    expect(input.form).toHaveClass("border-line", "rounded-lg");
    const send = screen.getByRole("button", { name: "Enviar" });
    expect(send).toHaveAttribute("type", "submit");
    expect(send).toHaveClass("bg-primary");

    await userEvent.type(input, "V");
    expect(onChange).toHaveBeenCalledExactlyOnceWith("V");
  });

  it("sends with Enter or the button when there is text", async () => {
    const { input, onSubmit } = renderComposer({ value: "Minha VPN caiu" });

    const send = screen.getByRole("button", { name: "Enviar" });
    expect(send).toBeEnabled();
    await userEvent.type(input, "{Enter}");
    await userEvent.click(send);
    expect(onSubmit).toHaveBeenCalledTimes(2);
  });

  it("does not send a blank message", () => {
    const { input, onSubmit } = renderComposer({ value: "   " });

    expect(screen.getByRole("button", { name: "Enviar" })).toBeDisabled();
    fireEvent.submit(input.form as HTMLFormElement);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("keeps typing allowed while the send waits", () => {
    const { input, onSubmit } = renderComposer({ value: "Obrigado", submitBlocked: true });

    expect(input).toBeEnabled();
    expect(screen.getByRole("button", { name: "Enviar" })).toBeDisabled();
    fireEvent.submit(input.form as HTMLFormElement);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows why it is disabled in place of the placeholder, and a footnote", () => {
    const { input } = renderComposer({
      value: "",
      disabled: true,
      disabledPlaceholder: "Limite de 20 mensagens atingido",
      footnote: "20/20 mensagens",
    });

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("placeholder", "Limite de 20 mensagens atingido");
    expect(screen.getByRole("button", { name: "Enviar" })).toBeDisabled();
    expect(screen.getByText("20/20 mensagens")).toHaveClass("text-2xs", "text-right");
  });

  it("keeps the placeholder when disabled without a reason", () => {
    const { input } = renderComposer({ disabled: true });

    expect(input).toHaveAttribute("placeholder", "Descreva seu problema");
  });

  it("has a round variant with a filled field and a round icon button", async () => {
    const inputRef = createRef<HTMLInputElement>();
    const { input, onSubmit } = renderComposer({ variant: "round", value: "Já resolvi", inputRef });

    expect(inputRef.current).toBe(input);
    expect(input).toHaveClass("bg-surface-subtle", "rounded-lg");
    const send = screen.getByRole("button", { name: "Enviar" });
    expect(send).toHaveAttribute("type", "submit");
    expect(send).toHaveClass("rounded-full", "size-11", "bg-primary");

    await userEvent.click(send);
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("drops the send button of the round variant while disabled", () => {
    const { input } = renderComposer({
      variant: "round",
      disabled: true,
      disabledPlaceholder: "Assuma a conversa para responder",
    });

    expect(input).toHaveAttribute("placeholder", "Assuma a conversa para responder");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
