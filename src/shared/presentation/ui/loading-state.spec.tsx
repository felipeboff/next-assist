import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingState } from "./loading-state";

describe("LoadingState", () => {
  it("announces what is loading beside a spinner, centered in the region", () => {
    const { container } = render(<LoadingState label="Carregando conversas…" />);

    expect(screen.getByRole("status")).toHaveTextContent("Carregando conversas…");
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass("flex-1", "items-center", "justify-center");
  });
});
