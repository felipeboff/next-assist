import { render, screen } from "@testing-library/react";
import { ArrowLeftRight } from "lucide-react";
import { describe, expect, it } from "vitest";
import { EventDivider } from "./event-divider";

describe("EventDivider", () => {
  it("draws an event across the thread between two hidden lines by default", () => {
    const { container } = render(
      <EventDivider icon={ArrowLeftRight}>Transferido para Suporte N2 às 14:20</EventDivider>,
    );

    const event = container.firstElementChild;
    expect(event?.tagName).toBe("P");
    expect(event).toHaveTextContent("Transferido para Suporte N2 às 14:20");
    expect(event).toHaveClass("text-xs", "text-text-muted");
    expect(container.querySelectorAll('[aria-hidden="true"].bg-line')).toHaveLength(2);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("can leave the icon out", () => {
    const { container } = render(<EventDivider>Conversa encerrada</EventDivider>);

    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("has a pill variant for date markers", () => {
    const { container } = render(<EventDivider variant="pill">Hoje</EventDivider>);

    expect(container.firstElementChild?.tagName).toBe("P");
    expect(screen.getByText("Hoje")).toHaveClass("rounded-md", "bg-canvas", "text-2xs");
    expect(container.querySelector(".bg-line")).not.toBeInTheDocument();
  });
});
