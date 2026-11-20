import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScrollArea } from "./scroll-area";

function spyOnScroll() {
  vi.spyOn(Element.prototype, "scrollHeight", "get").mockReturnValue(480);
  return vi.spyOn(Element.prototype, "scrollTop", "set");
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ScrollArea", () => {
  it("is a named region that scrolls vertically and fills the free height", () => {
    render(<ScrollArea label="Conversa">mensagens</ScrollArea>);

    const area = screen.getByRole("region", { name: "Conversa" });
    expect(area).toHaveTextContent("mensagens");
    expect(area).toHaveClass("min-h-0", "flex-1", "overflow-y-auto");
  });

  it("is a plain wrapper without a label, and leaves the scroll alone without `followEnd`", () => {
    const setScrollTop = spyOnScroll();
    const { container } = render(<ScrollArea>lista</ScrollArea>);

    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(container.firstElementChild).not.toHaveAttribute("role");
    expect(setScrollTop).not.toHaveBeenCalled();
  });

  it("scrolls to the bottom on mount and whenever the followed value changes", () => {
    const setScrollTop = spyOnScroll();
    const { rerender } = render(<ScrollArea followEnd={1}>1 mensagem</ScrollArea>);
    expect(setScrollTop).toHaveBeenCalledExactlyOnceWith(480);

    rerender(<ScrollArea followEnd={1}>1 mensagem</ScrollArea>);
    expect(setScrollTop).toHaveBeenCalledOnce();

    rerender(<ScrollArea followEnd={2}>2 mensagens</ScrollArea>);
    expect(setScrollTop).toHaveBeenCalledTimes(2);
  });
});
