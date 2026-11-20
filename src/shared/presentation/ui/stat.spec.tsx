import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stat, StatGroup } from "./stat";

describe("StatGroup", () => {
  it("lists each number with its label, and an indicator when given", () => {
    const { container } = render(
      <StatGroup label="O service desk em números">
        <Stat value="72%" label="resolvidos sem fila" />
        <Stat value="6" label="analistas online agora" indicator={<span data-testid="online" />} />
      </StatGroup>,
    );

    const list = container.querySelector("dl");
    expect(list).toHaveAttribute("aria-label", "O service desk em números");
    expect(Array.from(list?.querySelectorAll("dt") ?? []).map((term) => term.textContent)).toEqual([
      "resolvidos sem fila",
      "analistas online agora",
    ]);
    expect(Array.from(list?.querySelectorAll("dd") ?? []).map((value) => value.textContent)).toEqual([
      "72%",
      "6",
    ]);
    expect(screen.getByTestId("online")).toBeInTheDocument();
  });
});
