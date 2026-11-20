import { describe, expect, it } from "vitest";
import { userRoles } from "@/modules/identity/domain/user-role";

describe("userRoles", () => {
  it("has the employee who opens tickets and the service desk analyst", () => {
    expect(userRoles).toEqual(["employee", "analyst"]);
  });
});
