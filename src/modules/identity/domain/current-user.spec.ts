import { describe, expect, it } from "vitest";
import { firstNameOf } from "@/modules/identity/domain/current-user";

describe("firstNameOf", () => {
  it.each([
    ["Ana Souza", "Ana"],
    ["  Bruno   Carvalho ", "Bruno"],
    ["Felipe", "Felipe"],
  ])("takes the first name of %j", (name, expected) => {
    expect(firstNameOf({ name })).toBe(expected);
  });
});
