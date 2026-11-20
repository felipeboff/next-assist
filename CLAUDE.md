@AGENTS.md

# Project instructions

- Nexo Assist: chat agent for an IT service desk (hiring challenge). Screens to follow are in
  `design/` (exported from the Pencil prototype; local only, git-ignored); logo sources in `design/brand/`.
- UI is built only from `@/shared/presentation/ui` (skill `ui-framework`, enforced by ESLint). A missing
  component is added to the framework and documented in that skill in the same change.
- Architecture, module layers and rules live in `src/README.md` (Modular Clean Architecture,
  enforced by `eslint-plugin-boundaries`); read it before changing code. Stack decisions in
  `.claude/skills/evolutionary-modular-architecture/references/stack-2026.md`.
- Feature work follows skill `spec-lean`. No commit until the user asks; Conventional Commits.
- Local run: `docker compose up -d`, `pnpm db:migrate`, `pnpm db:seed`, `pnpm dev`.
  Checks: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`.
