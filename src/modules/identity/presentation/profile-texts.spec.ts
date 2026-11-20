import { describe, expect, it } from "vitest";
import { passwordAgeText } from "@/modules/identity/presentation/profile-texts";

describe("passwordAge texts", () => {
  it.each([
    [0, "Alterada hoje"],
    [1, "Alterada há 1 dia"],
    [42, "Alterada há 42 dias"],
  ])("reads %d days as %j", (days, text) => {
    expect(passwordAgeText(days)).toBe(text);
  });
});
