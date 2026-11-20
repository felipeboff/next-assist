import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SplitLayout } from "./split-layout";

describe("SplitLayout", () => {
  it("renders the labelled aside, the header with brand and help, the main content and the footer", () => {
    render(
      <SplitLayout
        aside="apresentação"
        asideLabel="Sobre o Nexo Assist"
        brand="marca"
        header="ajuda"
        footer="rodapé"
      >
        formulário
      </SplitLayout>,
    );

    expect(screen.getByRole("complementary", { name: "Sobre o Nexo Assist" })).toHaveTextContent(
      "apresentação",
    );
    expect(screen.getByRole("banner")).toHaveTextContent("marcaajuda");
    expect(screen.getByRole("main")).toHaveTextContent("formulário");
    expect(screen.getByRole("contentinfo")).toHaveTextContent("rodapé");
  });

  it("renders the header with only the help when there is no brand", () => {
    render(
      <SplitLayout aside="a" asideLabel="Sobre" header="ajuda">
        x
      </SplitLayout>,
    );

    expect(screen.getByRole("banner")).toHaveTextContent("ajuda");
  });

  it("leaves out the header and footer when none is given", () => {
    render(
      <SplitLayout aside="a" asideLabel="Sobre">
        x
      </SplitLayout>,
    );

    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
  });
});
