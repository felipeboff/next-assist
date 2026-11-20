// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn<typeof fetch>();
vi.stubGlobal("fetch", fetchMock);

const { makeIdentityClientModule } = await import("@/modules/identity/composition.client");

function lastRequest(): { url: string; body: unknown } {
  const [input, init] = fetchMock.mock.lastCall ?? [];
  const url = input instanceof Request ? input.url : String(input);
  const body = typeof init?.body === "string" ? JSON.parse(init.body) : undefined;
  return { url, body };
}

beforeEach(() => {
  fetchMock.mockReset();
});

describe("identity browser composition", () => {
  it("signs in through the auth API with the normalized credentials", async () => {
    fetchMock.mockResolvedValue(Response.json({ token: "token", user: { id: "1" } }));

    const result = await makeIdentityClientModule().signIn({
      email: " Ana.Souza@nexo.com.br ",
      password: "123456",
      rememberMe: false,
    });

    expect(result).toEqual({ status: "signed-in" });
    expect(lastRequest()).toEqual({
      url: `${window.location.origin}/api/auth/sign-in/email`,
      body: { email: "ana.souza@nexo.com.br", password: "123456", rememberMe: false },
    });
  });

  it("reports an unknown employee when the auth API answers 401", async () => {
    fetchMock.mockResolvedValue(
      Response.json(
        { code: "INVALID_EMAIL_OR_PASSWORD", message: "Invalid email or password" },
        { status: 401 },
      ),
    );

    const result = await makeIdentityClientModule().signIn({
      email: "visitante@nexo.com.br",
      password: "x",
      rememberMe: true,
    });

    expect(result).toEqual({ status: "failed", failure: "unknown-employee" });
  });

  it("signs out through the auth API", async () => {
    fetchMock.mockResolvedValue(Response.json({ success: true }));

    await makeIdentityClientModule().signOut();

    expect(lastRequest().url).toBe(`${window.location.origin}/api/auth/sign-out`);
  });
});
