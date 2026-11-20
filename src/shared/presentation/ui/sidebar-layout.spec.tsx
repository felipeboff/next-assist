import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SidebarLayout } from "./sidebar-layout";

describe("SidebarLayout", () => {
  it("puts the brand, the nav and the footer in a fixed sidebar beside the page", () => {
    const { container } = render(
      <SidebarLayout brand={<span>marca</span>} nav={<span>menu</span>} footer={<span>Ana Souza</span>}>
        <span>página</span>
      </SidebarLayout>,
    );

    expect(container.firstElementChild).toHaveClass("flex", "h-dvh");
    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("w-58", "shrink-0", "border-r");
    expect(sidebar).toHaveTextContent("marcamenuAna Souza");
    expect(screen.getByText("Ana Souza").parentElement).toHaveClass("border-t");
    expect(screen.getByText("página").parentElement).toHaveClass("min-w-0", "flex-1");
  });

  it("leaves the footer out when none is given", () => {
    const { container } = render(
      <SidebarLayout brand={<span>marca</span>} nav={<span>menu</span>}>
        <span>página</span>
      </SidebarLayout>,
    );

    expect(container.querySelector(".border-t")).not.toBeInTheDocument();
  });
});
