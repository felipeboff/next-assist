import { describe, expect, it } from "vitest";
import { checkCredentials } from "@/modules/identity/domain/credentials";

describe("checkCredentials", () => {
  it("accepts an e-mail with any non-empty password and normalizes the e-mail", () => {
    expect(checkCredentials({ email: "  Ana.Souza@Nexo.com.br ", password: "x", rememberMe: true })).toEqual({
      ok: true,
      credentials: { email: "ana.souza@nexo.com.br", password: "x", rememberMe: true },
    });
  });

  it("requires the e-mail", () => {
    expect(checkCredentials({ email: "   ", password: "x", rememberMe: false })).toEqual({
      ok: false,
      problems: { email: "email.required" },
    });
  });

  it("rejects a value that is not an e-mail", () => {
    expect(checkCredentials({ email: "ana.souza", password: "x", rememberMe: false })).toEqual({
      ok: false,
      problems: { email: "email.invalid" },
    });
  });

  it("requires the password, reported together with the e-mail problem", () => {
    expect(checkCredentials({ email: "", password: "", rememberMe: false })).toEqual({
      ok: false,
      problems: { email: "email.required", password: "password.required" },
    });
  });

  it("keeps the password exactly as typed", () => {
    const check = checkCredentials({ email: "a@nexo.com.br", password: "  spaced  ", rememberMe: false });
    expect(check.ok && check.credentials.password).toBe("  spaced  ");
  });
});
