import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("is decorative without a label", () => {
    const { container } = render(<Spinner />);

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(container.firstElementChild).toHaveClass("size-4", "animate-spin");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("announces what is loading when it has a label", () => {
    render(<Spinner size="md" label="Carregando sua sessão" />);

    const status = screen.getByRole("status", { name: "Carregando sua sessão" });
    expect(status).not.toHaveAttribute("aria-hidden");
    expect(status).toHaveClass("size-5");
  });
});
