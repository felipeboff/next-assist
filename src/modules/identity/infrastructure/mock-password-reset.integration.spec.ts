import { afterEach, describe, expect, it, vi } from "vitest";
import { createMockPasswordReset } from "@/modules/identity/infrastructure/mock-password-reset";

afterEach(() => {
  vi.useRealTimers();
});

describe("mock password reset", () => {
  it("answers after the configured delay", async () => {
    vi.useFakeTimers();
    let done = false;
    const request = createMockPasswordReset({ delayMs: 700 })
      .request("ana.souza@nexo.com.br")
      .then(() => {
        done = true;
      });

    await vi.advanceTimersByTimeAsync(699);
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await request;
    expect(done).toBe(true);
  });
});
