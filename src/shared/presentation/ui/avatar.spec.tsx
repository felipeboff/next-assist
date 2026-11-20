import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar, avatarToneOf, initialsOf } from "./avatar";

describe("initialsOf", () => {
  it("takes the first letter of the first and the last name, in capitals", () => {
    expect(initialsOf("Ana Souza")).toBe("AS");
    expect(initialsOf("  maria da   silva ")).toBe("MS");
  });

  it("gives one letter for a single name and nothing for a blank one", () => {
    expect(initialsOf("rafael")).toBe("R");
    expect(initialsOf("   ")).toBe("");
  });
});

describe("avatarToneOf", () => {
  it("always gives the same name the same tone", () => {
    expect(avatarToneOf("Ana Souza")).toBe(avatarToneOf("Ana Souza"));
    expect(["blue", "orange", "violet", "green", "rose", "slate", "amber"]).toContain(
      avatarToneOf("Carla Dias"),
    );
  });
});

describe("Avatar", () => {
  it("shows the initials in the tone of the name, hidden from assistive tech, by default", () => {
    const { container } = render(<Avatar name="Ana Souza" />);

    const avatar = container.firstElementChild;
    expect(avatar?.tagName).toBe("SPAN");
    expect(avatar).toHaveTextContent("AS");
    expect(avatar).toHaveAttribute("aria-hidden", "true");
    expect(avatar).not.toHaveAttribute("role");
    expect(avatar).toHaveClass(
      "size-10",
      "text-sm",
      "rounded-full",
      `bg-avatar-${avatarToneOf("Ana Souza")}`,
    );
    expect(container.querySelector(".bg-success")).not.toBeInTheDocument();
  });

  it("reads the name out when labelled, in the size and tone it is given, with a presence dot", () => {
    render(<Avatar name="Rafael Lima" size="lg" tone="blue" online labelled />);

    const avatar = screen.getByRole("img", { name: "Rafael Lima" });
    expect(avatar).not.toHaveAttribute("aria-hidden");
    expect(avatar).toHaveClass("size-11", "text-md", "bg-avatar-blue", "text-avatar-blue-text");
    expect(avatar.querySelector(".bg-success")).toBeInTheDocument();
  });

  it("has a small size for rails and lists", () => {
    const { container } = render(<Avatar name="Ana" size="sm" tone="amber" />);

    expect(container.firstElementChild).toHaveClass("size-8", "text-2xs", "bg-avatar-amber");
  });
});
