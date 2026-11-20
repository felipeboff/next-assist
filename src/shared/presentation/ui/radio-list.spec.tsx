import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RadioList } from "./radio-list";

const items = [
  { value: "INC-20517", content: "INC-20517 · VPN não conecta" },
  { value: "INC-20488", content: "INC-20488 · Outlook não sincroniza" },
];

describe("RadioList", () => {
  it("is a named group of radios sharing one name; the value is checked", async () => {
    const onChange = vi.fn();
    render(<RadioList label="Qual chamado?" items={items} value="INC-20517" onChange={onChange} />);

    const group = screen.getByRole("group", { name: "Qual chamado?" });
    expect(group.tagName).toBe("FIELDSET");
    const vpn = within(group).getByRole("radio", { name: "INC-20517 · VPN não conecta" });
    const outlook = within(group).getByRole("radio", { name: "INC-20488 · Outlook não sincroniza" });
    expect(vpn).toBeChecked();
    expect(outlook).not.toBeChecked();
    expect(outlook).toHaveAttribute("name", vpn.getAttribute("name"));
    expect(outlook).toHaveAttribute("value", "INC-20488");

    await userEvent.click(outlook);
    expect(onChange).toHaveBeenCalledExactlyOnceWith("INC-20488");
  });

  it("starts with nothing checked and can be disabled", async () => {
    const onChange = vi.fn();
    render(<RadioList label="Qual chamado?" items={items} value={null} disabled onChange={onChange} />);

    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).not.toBeChecked();
      expect(radio).toBeDisabled();
    }
    await userEvent.click(screen.getByRole("radio", { name: "INC-20517 · VPN não conecta" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
