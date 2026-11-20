import { describe, expect, it } from "vitest";
import { env, parseServerEnv } from "@/shared/infrastructure/env";

const complete = {
  DATABASE_URL: "postgres://nexo:nexo@localhost:5432/nexo_assist",
  BETTER_AUTH_SECRET: "s".repeat(32),
  BETTER_AUTH_URL: "http://localhost:3000",
};

describe("parseServerEnv", () => {
  it("accepts a complete environment and keeps only the variables it knows", () => {
    expect(parseServerEnv({ ...complete, UNRELATED: "x" })).toEqual(complete);
  });

  it("accepts the postgresql scheme too", () => {
    const parsed = parseServerEnv({ ...complete, DATABASE_URL: "postgresql://nexo@db/nexo_assist" });

    expect(parsed.DATABASE_URL).toBe("postgresql://nexo@db/nexo_assist");
  });

  it("names every invalid variable and points to the example file", () => {
    const parse = () =>
      parseServerEnv({
        DATABASE_URL: "mysql://localhost/db",
        BETTER_AUTH_SECRET: "short",
        BETTER_AUTH_URL: undefined,
      });

    expect(parse).toThrow(/see \.env\.example/);
    expect(parse).toThrow(/DATABASE_URL/);
    expect(parse).toThrow(/BETTER_AUTH_SECRET: BETTER_AUTH_SECRET must have at least 32 characters/);
    expect(parse).toThrow(/BETTER_AUTH_URL/);
  });
});

describe("env", () => {
  it("is the validated process environment", () => {
    expect(env.DATABASE_URL).toBe(process.env.DATABASE_URL);
    expect(env.BETTER_AUTH_URL).toBe(process.env.BETTER_AUTH_URL);
  });
});
