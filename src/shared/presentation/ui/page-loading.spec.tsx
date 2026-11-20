import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageLoading } from "./page-loading";

describe("PageLoading", () => {
  it("shows and announces what is loading", () => {
    render(<PageLoading label="Carregando sua sessão…" />);

    expect(screen.getByRole("status")).toHaveTextContent("Carregando sua sessão…");
  });
});
