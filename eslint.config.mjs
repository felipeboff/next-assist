import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import boundaries from "eslint-plugin-boundaries";

const MODULE_LAYERS = ["domain", "application", "infrastructure", "presentation"];

const sameModule = (type) => ({ type, captured: { module: "{{ from.captured.module }}" } });
const shared = (...layers) => layers.map((layer) => ({ type: `shared-${layer}` }));

// Domain code stays framework-free: plain TypeScript only.
const FRAMEWORK_PACKAGES = [
  "react",
  "react-*",
  "next",
  "next/*",
  "better-auth",
  "better-auth/*",
  "drizzle-orm",
  "drizzle-orm/*",
  "pg",
  "zod",
  "lucide-react",
];

const uiFrameworkRule =
  "Screens and modules are built from @/shared/presentation/ui only (skill ui-framework): no raw HTML elements, className or style.";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "import/resolver": {
        typescript: { project: "./tsconfig.json" },
      },
      "boundaries/include": ["src/**/*"],
      "boundaries/legacy-templates": false,
      "boundaries/elements": [
        { type: "route", pattern: "src/app" },
        { type: "route", mode: "full", pattern: "src/proxy.ts" },
        { type: "main", pattern: "src/main" },
        { type: "module-public", mode: "full", pattern: "src/modules/*/index.ts", capture: ["module"] },
        { type: "module-public", mode: "full", pattern: "src/modules/*/client.ts", capture: ["module"] },
        {
          type: "module-composition",
          mode: "full",
          pattern: "src/modules/*/composition*.ts",
          capture: ["module"],
        },
        ...MODULE_LAYERS.map((layer) => ({
          type: `module-${layer}`,
          pattern: `src/modules/*/${layer}`,
          capture: ["module"],
        })),
        { type: "shared-domain", pattern: "src/shared/domain" },
        { type: "shared-infrastructure", pattern: "src/shared/infrastructure" },
        { type: "shared-presentation", pattern: "src/shared/presentation" },
      ],
    },
    rules: {
      "boundaries/no-unknown-files": "error",
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          checkAllOrigins: true,
          // The last matching rule wins.
          rules: [
            { allow: { to: { origin: ["external", "core"] } } },
            {
              from: { type: "route" },
              allow: { to: [{ type: "main" }, { type: "module-public" }, ...shared("presentation")] },
            },
            {
              from: { type: "main" },
              allow: {
                to: [{ type: "module-public" }, ...shared("domain", "infrastructure", "presentation")],
              },
            },
            {
              from: { type: "module-public" },
              allow: {
                to: [
                  sameModule("module-composition"),
                  ...MODULE_LAYERS.map((layer) => sameModule(`module-${layer}`)),
                ],
              },
            },
            {
              from: { type: "module-composition" },
              allow: {
                to: [
                  sameModule("module-composition"),
                  ...MODULE_LAYERS.map((layer) => sameModule(`module-${layer}`)),
                  ...shared("infrastructure"),
                ],
              },
            },
            { from: { type: "module-domain" }, allow: { to: shared("domain") } },
            {
              from: { type: "module-application" },
              allow: { to: [sameModule("module-domain"), ...shared("domain")] },
            },
            {
              from: { type: "module-infrastructure" },
              allow: {
                to: [
                  sameModule("module-domain"),
                  sameModule("module-application"),
                  ...shared("domain", "infrastructure"),
                ],
              },
            },
            {
              from: { type: "module-presentation" },
              allow: {
                to: [
                  sameModule("module-domain"),
                  sameModule("module-application"),
                  { type: "module-public" },
                  ...shared("domain", "presentation"),
                ],
              },
            },
            { from: { type: "shared-infrastructure" }, allow: { to: shared("domain") } },
            { from: { type: "shared-presentation" }, allow: { to: shared("domain") } },
            {
              from: [{ type: "module-domain" }, { type: "shared-domain" }],
              disallow: {
                to: { origin: "external" },
                dependency: { module: FRAMEWORK_PACKAGES },
              },
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/app/**/*.tsx", "src/main/**/*.tsx", "src/modules/**/*.tsx"],
    ignores: ["src/app/layout.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.type='JSXIdentifier'][name.name=/^[a-z]/]",
          message: uiFrameworkRule,
        },
        {
          selector: "JSXAttribute[name.name=/^(className|style)$/]",
          message: uiFrameworkRule,
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/shared/presentation/ui/*"],
              message: "Import UI components from the @/shared/presentation/ui barrel (skill ui-framework).",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "drizzle/**", ".claude/**"]),
]);

export default eslintConfig;
