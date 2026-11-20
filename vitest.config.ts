import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

type CoverageFloor = { statements: number; branches: number; functions: number; lines: number };

if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

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
  integration: [
    `src/modules/*/infrastructure/${CODE}`,
    "src/modules/*/composition.ts",
    "src/modules/*/composition.client.ts",
    `src/shared/infrastructure/${CODE}`,
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

// Integration tests get their own database on the same server: nexo_assist -> nexo_assist_test.
function testDatabaseUrl(databaseUrl: string | undefined): string | undefined {
  if (!databaseUrl) {
    return undefined;
  }
  const url = new URL(databaseUrl);
  const name = url.pathname.replace(/^\//, "");
  url.pathname = `/${name.endsWith("_test") ? name : `${name}_test`}`;
  return url.toString();
}

const integrationDatabaseUrl = testDatabaseUrl(process.env.DATABASE_URL);
if (integrationDatabaseUrl) {
  process.env.INTEGRATION_DATABASE_URL = integrationDatabaseUrl;
}

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Outside Next.js the guard would throw; its react-server build is an empty module.
      "server-only": fileURLToPath(new URL("./node_modules/server-only/empty.js", import.meta.url)),
    },
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
      {
        extends: true,
        test: {
          name: "integration",
          include: [INTEGRATION],
          environment: "node",
          globalSetup: ["./testing/integration.global-setup.ts"],
          setupFiles: ["./testing/integration.setup.ts"],
          env: integrationDatabaseUrl ? { DATABASE_URL: integrationDatabaseUrl } : {},
          fileParallelism: false,
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
