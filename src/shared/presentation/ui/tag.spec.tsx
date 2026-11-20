import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tag } from "./tag";

describe("Tag", () => {
  it("shows its content on a white pill by default", () => {
    const { container } = render(<Tag>Rede e VPN</Tag>);

    expect(screen.getByText("Rede e VPN")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass("bg-canvas", "rounded-full");
    expect(container.querySelector("[aria-hidden]")).not.toBeInTheDocument();
  });

  it("leads with a status dot when one is given", () => {
    const { container } = render(
      <Tag surface="soft" dot="warning">
        INC-20517
      </Tag>,
    );

    expect(container.firstElementChild).toHaveClass("bg-primary-soft");
    expect(container.querySelector(".bg-warning")).toBeInTheDocument();
  });
});
