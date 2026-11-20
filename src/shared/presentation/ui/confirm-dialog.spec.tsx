import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ConfirmDialog, type ConfirmDialogProps } from "./confirm-dialog";

// jsdom has <dialog> but not its modal API.
const showModal = vi.fn(function (this: HTMLDialogElement) {
  this.setAttribute("open", "");
});
const close = vi.fn(function (this: HTMLDialogElement) {
  this.removeAttribute("open");
});

beforeAll(() => {
  Object.assign(HTMLDialogElement.prototype, { showModal, close });
});

afterEach(() => {
  showModal.mockClear();
  close.mockClear();
});

function dialogProps(props: Partial<ConfirmDialogProps> = {}): ConfirmDialogProps {
  return {
    open: true,
    title: "Encerrar a conversa com Ana Souza?",
    description: "Ana verá que o atendimento foi encerrado.",
    confirmLabel: "Encerrar",
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    ...props,
  };
}

describe("ConfirmDialog", () => {
  it("opens as a modal named by its title and described by its text, with a danger confirm", async () => {
    const props = dialogProps();
    render(<ConfirmDialog {...props} />);

    expect(showModal).toHaveBeenCalledOnce();
    const dialog = screen.getByRole("dialog", { name: "Encerrar a conversa com Ana Souza?" });
    expect(dialog).toHaveAccessibleDescription("Ana verá que o atendimento foi encerrado.");
    expect(
      screen.getByRole("heading", { level: 2, name: "Encerrar a conversa com Ana Souza?" }),
    ).toBeInTheDocument();

    const confirm = screen.getByRole("button", { name: "Encerrar" });
    expect(confirm).toHaveClass("bg-danger");
    await userEvent.click(confirm);
    expect(props.onConfirm).toHaveBeenCalledOnce();

    const cancel = screen.getByRole("button", { name: "Cancelar" });
    expect(cancel).toHaveClass("border-line");
    await userEvent.click(cancel);
    expect(props.onCancel).toHaveBeenCalledOnce();
  });

  it("cancels on Escape and leaves closing to the caller", () => {
    const props = dialogProps();
    render(<ConfirmDialog {...props} />);

    const dialog = screen.getByRole("dialog");
    const notPrevented = fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(notPrevented).toBe(false);
    expect(props.onCancel).toHaveBeenCalledOnce();
    expect(close).not.toHaveBeenCalled();
  });

  it("follows `open`: opens once, and closes when it turns false", () => {
    const { rerender } = render(<ConfirmDialog {...dialogProps({ open: false })} />);
    expect(showModal).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(<ConfirmDialog {...dialogProps({ open: true })} />);
    rerender(<ConfirmDialog {...dialogProps({ open: true, busy: true })} />);
    expect(showModal).toHaveBeenCalledOnce();

    rerender(<ConfirmDialog {...dialogProps({ open: false })} />);
    expect(close).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("takes a primary tone, a cancel label, and a busy state that blocks both actions", () => {
    render(<ConfirmDialog {...dialogProps({ tone: "primary", cancelLabel: "Voltar", busy: true })} />);

    const confirm = screen.getByRole("button", { name: "Encerrar" });
    expect(confirm).toHaveClass("bg-primary");
    expect(confirm).toHaveAttribute("aria-busy", "true");
    expect(confirm).toBeDisabled();
    expect(screen.getByRole("button", { name: "Voltar" })).toBeDisabled();
  });
});
