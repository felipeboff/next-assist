# Source architecture

Modular Clean Architecture: one folder per bounded context, each split into the same layers.
`eslint-plugin-boundaries` enforces the rules below; `pnpm lint` fails on a violation.

```
src/
├── app/            Next.js routes, layouts and guards. No logic.
│   ├── (public)/       signed out only: login. The layout sends a signed-in user to `/`.
│   ├── (protected)/    signed in only: the app. The layout sends a visitor to `/login`, and every
│   │                   page calls `requireUser()` or `requireRole()` (the layout alone does not
│   │                   stop a page from rendering, see Next.js "Layouts and auth checks").
│   │   ├── (employee)/     `/` chat and `/perfil`, in the sidebar shell; an analyst goes to /console
│   │   └── (analyst)/      `/console`; an employee goes to `/`
│   └── api/auth/       BetterAuth's HTTP handler
├── proxy.ts        Optimistic session-cookie check before routes (Next.js 16's middleware).
├── main/           Composition root for the browser: builds client dependencies, adapts one
│                   module to another's port (ticket-desk.ts) and mounts the providers
│                   (client-providers.tsx, used by app/layout.tsx).
├── modules/
│   └── <context>/
│       ├── domain/               plain TypeScript: entities, value objects, rules, failures
│       ├── application/
│       │   ├── ports/            interfaces the module needs (gateways, readers, repositories)
│       │   └── use-cases/        only when a flow orchestrates several steps
│       ├── infrastructure/       ports implemented over the outside world (BetterAuth,
│       │                         Drizzle tables and seeds, HTTP)
│       ├── presentation/         screens/, components/, texts, dependency context
│       ├── composition.ts        server-only: builds the module's server dependencies
│       ├── composition.client.ts builds the module's browser dependencies
│       ├── index.ts              public API for the server (routes, other modules)
│       └── client.ts             public API for the browser (main/)
└── shared/
    ├── infrastructure/           env (validated), database client
    └── presentation/ui/          the UI framework (skill ui-framework)
```

Current modules:

- `identity`: login (Screen 1), profile and sign out over BetterAuth with the Drizzle adapter; the
  PRD rule "seeded employees with any password" lives in `infrastructure/better-auth.ts`. The
  current user is read on the server through the `SessionReader` port and the password age through
  `CredentialReader`; sign-in runs in the browser through the `signIn` use case and the
  `AuthGateway` port, so BetterAuth's HTTP rate limit applies. The password reset request is a
  mock (`PasswordReset` port) until an e-mail service exists. Employees and analysts are seeded by
  `infrastructure/identity.seed.ts`.
- `tickets`: the simulated ticket system, separate from the agent. The domain owns the Annex A
  rules: ticket vocabulary, SLA deadlines on the business calendar (`domain/sla.ts`) and when a
  ticket is overdue. The `TicketService` port is served by an in-memory adapter with the Annex B
  sample data; presentation exports the employee tickets panel of the console.
- `conversations`: the employee chat (Screens 2 and 3) and the analyst console (Screens 4 and 5).
  The domain holds the agent reply contract (`AgentReply`: the decision behind each reply, then
  what the chat renders), the hand-over states, the message limit and the console's filter, search
  and order. Screens reach behaviour through the `EmployeeChat` and `AnalystConsole` ports; until
  the Mastra agent exists they are served by a scripted agent and an in-memory console
  (`infrastructure/`), mounted in `composition.client.ts`.

Modules that depend on each other meet in `main/` (AD-005 in `.specs/STATE.md`): `conversations`
declares the `TicketDesk` port it needs, and `main/ticket-desk.ts` adapts the `tickets` public API
into it. The in-browser mocks start from the sample data on every page load.

## Rules

1. Inside a module: `presentation → application → domain`. `infrastructure` implements the
   `application` ports. `domain` never imports React, Next.js, BetterAuth, Drizzle, pg or zod.
2. Across modules: import only another module's `index.ts` (server) or `client.ts` (browser),
   never its internals. Data from another context crosses as an id or a DTO. No cycles.
3. `shared` never imports from `modules` or `main`.
4. `app/` holds no logic: routes render screens from modules and guard on the session. A new
   page goes under `(public)` or `(protected)`; a protected page calls `requireUser()` itself.
5. Only `main/` and a module's `composition*.ts` know concrete implementations. Presentation
   reaches use cases through the module's dependency context.
6. Every file under `src/` belongs to one of these places (`boundaries/no-unknown-files`).
7. Create a module, or a folder inside one, when its first file exists. No empty placeholders.

## Why two public entry points

A module's server dependencies (database, BetterAuth server, `next/headers`) must never reach the
browser bundle. `index.ts` re-exports `composition.ts` (marked `server-only`), so a client file
that imported it would fail the build; the browser side goes through `client.ts` and
`composition.client.ts` instead.

## Conventions

- **UI**: built only from `@/shared/presentation/ui` (skill `ui-framework`); ESLint rejects raw
  HTML elements, `className` and `style` in `app/`, `main/` and `modules/`.
- **Tests**: Vitest, with specs next to the file they test. Each level owns a coverage scope with
  a 100% floor in `coverage-thresholds.json`:
  - **unit** (`*.spec.ts(x)`, jsdom + Testing Library): `modules/*/domain`, `modules/*/application`,
    `shared/domain`, `shared/presentation`. `pnpm test:unit:coverage`.
  - **integration** (`*.integration.spec.ts`): `modules/*/infrastructure`, `modules/*/composition*.ts`,
    `main/*.ts` (the adapters between modules), `shared/infrastructure`, against PostgreSQL in its own `<database>_test` database (created and
    migrated by `testing/integration.global-setup.ts`; needs `docker compose up -d`).
    `pnpm test:integration:coverage`.
  - **e2e**: Playwright journeys in `e2e/` (`pnpm test:e2e`), no coverage floor yet.

  lint-staged runs the unit specs related to the staged files; the pre-push hook runs both
  coverage suites. Test-only helpers live in a `testing/` folder and are out of coverage.

- **Database**: each module owns its tables in `infrastructure/*.schema.ts`; migrations in
  `drizzle/` are generated (`pnpm db:generate`) and committed.
- **Language**: code, comments and docs in English; user-facing copy in pt-BR.
