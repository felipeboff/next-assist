import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

type CoverageFloor = { statements: number; branches: number; functions: number; lines: number };

const COVERAGE_FLOORS: Record<string, CoverageFloor> = JSON.parse(
  readFileSync(new URL("./coverage-thresholds.json", import.meta.url), "utf8"),
);

const CODE = "**/*.{ts,tsx}";

// What each test level is accountable for (same split as the ERP project).
const LEVEL_SCOPES: Record<string, string[]> = {
  unit: [
    `src/modules/*/domain/${CODE}`,
    `src/modules/*/application/${CODE}`,
    `src/shared/domain/${CODE}`,
    `src/shared/presentation/${CODE}`,
  ],
};

const INTEGRATION = "src/**/*.integration.spec.{ts,tsx}";
const E2E = "src/**/*.e2e.spec.{ts,tsx}";

const level = process.env.COVERAGE_LEVEL ?? "unit";
const scope = LEVEL_SCOPES[level];
const floor = COVERAGE_FLOORS[level];
if (!scope || !floor) {
  throw new Error(`Unknown COVERAGE_LEVEL "${level}"`);
}

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.spec.{ts,tsx}"],
          exclude: [INTEGRATION, E2E],
          environment: "jsdom",
          setupFiles: ["./testing/unit.setup.ts"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      include: scope,
      exclude: ["**/*.spec.{ts,tsx}", "**/*.d.ts", "**/testing/**"],
      reportsDirectory: `coverage/${level}`,
      reporter: ["text", "json-summary"],
      thresholds: floor,
    },
  },
});
