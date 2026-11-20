# Stack Reference - Nexo Assist

The concrete stack for this repo (the Nexo Assist hiring challenge: an IT service-desk chat agent
plus an analyst console). Defaults plus the trade-offs to call out. Items marked **Open** are not
decided yet: decide them with the user and record the decision as an ADR (`create-adr`).

Package majors were checked on the npm registry on 2026-11-20. Run `npm view <pkg> version` again
before pinning, and pin exact versions in `package.json`; never write a version from memory.

## Table of Contents

1. Repo & runtime
2. Frontend
3. Backend inside Next.js
4. Agent (Mastra)
5. Data & auth
6. Real-time, queue, resilience
7. Observability & transparency
8. Quality
9. Local dev & deploy
10. Decisions

---

## 1. Repo & runtime

- **One Next.js app, one deploy.** No Nx and no monorepo: one team, one deliverable. Bounded
  contexts live as modules under `src/modules/<context>/`, in Clean Architecture layers (`src/README.md`).
- **Node 24 LTS**, **pnpm** (the version is pinned in `packageManager` in `package.json`).
- **TypeScript strict** (`strict: true`, no `any`), on the 5.9 line that the Next.js 16.4
  template pins (TypeScript 7 exists, but the framework template does not use it yet).

## 2. Frontend

- **Next.js 16, App Router**, **React 19**. Server Components for read-heavy pages (the analyst
  console lists); Client Components where the user interacts (the chat).
- **Tailwind CSS 4** through `@tailwindcss/turbopack` (no PostCSS). UI components live in
  `src/shared/ui` (skill `ui-framework`), with variants from `tailwind-variants/lite` and Lucide
  icons.
- **Cache Components is on** (template default): reading the session (`headers()`/`cookies()`)
  must happen inside a `<Suspense>` boundary; `src/proxy.ts` (Next 16's middleware) only does the
  optimistic cookie check. Read `node_modules/next/dist/docs/` before using a Next.js API.
- The **Pencil prototype** (PRD Annex C) is the binding visual reference: follow its layout and
  style (see the project override in `frontend-design`).
- Every async surface has explicit **loading, empty and error states**; the challenge grades
  them.

## 3. Backend inside Next.js

- **Route Handlers** (`app/api/**/route.ts`) and **Server Actions** are the presentation layer
  only: authenticate (BetterAuth session), validate input (**zod 4**), call a module facade, and
  map the result. No business rule lives in a route.
- Modules follow Modular Clean Architecture with explicit layers (`src/README.md`):
  `domain/` (plain TypeScript), `application/ports/` and `use-cases/`, `infrastructure/`
  (adapters: BetterAuth, Drizzle, HTTP), `presentation/` (screens, components, dependency
  context). `composition.ts` (server-only) and `composition.client.ts` build the concrete
  dependencies; `index.ts` is the server public API and `client.ts` the browser one;
  `src/main/` is the browser composition root. `eslint-plugin-boundaries` enforces the rules.

## 4. Agent (Mastra)

- **Mastra** (`@mastra/core` 1.x) is the PRD's preferred agent framework. The agent decides each
  turn; **tools** are its only way to act, and each tool calls a module facade.
- **Identity never comes from the model.** Tools take the employee id from the server session,
  not from tool arguments, so the model cannot read or change another employee's tickets (PRD
  privacy rule). Test this guard without the LLM.
- **Confirm before acting.** Creating or updating a ticket happens in two steps: a draft shown to
  the user, then a confirmed write. The rule is enforced in code (state), not only in the prompt.
- **Memory and storage**: conversation threads persist in Postgres (`@mastra/pg`,
  `@mastra/memory`) so the employee can come back another day. Check the current Mastra docs
  before wiring memory, workflows (suspend/resume) or tracing; the APIs move fast.
- **LLM provider - Open.** Mastra routes models through AI SDK providers (`ai` 7.x,
  `@ai-sdk/anthropic`, `@ai-sdk/openai`, `@ai-sdk/google`). The model id comes from env. The README
  must justify the choice (tool-calling quality, latency, cost per conversation).
- **Cost awareness**: the cheapest model that passes the decision evals, short system prompt,
  tool results trimmed to what the model needs, and the PRD cap of 30 messages per session.

## 5. Data & auth

- **PostgreSQL 18**, one database, run by Docker Compose locally (`compose.yaml`).
- **Drizzle ORM** (`drizzle-orm` 0.45, `drizzle-kit` 0.31). Migrations are generated and
  committed (`drizzle-kit generate` + `migrate`); `push` is only for throwaway local experiments.
- **Table ownership**: each module is the sole writer of its tables (one schema file per
  aggregate; a table prefix or a Postgres schema per module); no foreign keys across modules.
- **Simulated ticket service**: the PRD requires it to be separate from the agent, and calls it a
  legacy system that is sometimes down for a few seconds. It is its own context, reached only
  through a `TicketingPort` + adapter (ACL), with configurable fault injection so the resilience
  path can be demonstrated and tested.
- **BetterAuth** (`better-auth` 1.x) with the Drizzle adapter. Two roles: employee and analyst.
  The PRD login accepts the seeded employees with any password; keep that rule isolated and
  documented, and never let it reach a deploy without rate limiting.

## 6. Real-time, queue, resilience

- **Chat streaming**: the agent's reply streams over HTTP from a route handler.
- **Analyst console updates**: start with revalidation or polling; move to SSE (with Postgres
  `LISTEN/NOTIFY` for fan-out) only when the UX needs push.
- **Queue - Open.** Only add one for work that must outlive the request: retrying a ticket write
  while the legacy system is down (outbox relay), scanning for overdue tickets (SLA), notifying
  analysts. Options:
  - **pg-boss** (12.x): a queue on Postgres. No new infrastructure, and the job is enqueued in
    the same transaction as the outbox row.
  - **BullMQ** (6.x): a Node.js job queue on Redis/Valkey. Retries with backoff, delayed and
    repeatable jobs, TypeScript-native. Adds a Valkey container and a worker process.
  - **RabbitMQ**: a standalone message broker (AMQP) for cross-service and cross-language
    messaging. Too heavy for a single TypeScript app.
  Default: no queue until a job needs one; then pg-boss, or BullMQ if Valkey is already there
  (for example for rate limiting).
- **Resilience**: **cockatiel** (4.x) around the ticketing adapter: timeout, then a circuit
  breaker, then retry with capped exponential backoff and full jitter (`resilience.md`). Writes
  carry an idempotency key (the draft id), so a retry never creates a duplicate ticket.

## 7. Observability & transparency

- **pino** structured logs with `conversationId` and a correlation id.
- **Decision trace as domain data, not logs**: every assistant turn stores what the agent
  understood, which action it took, with what confidence and why, plus the tools it called. The
  UI renders the actions above each reply and the detail on demand. The PRD calls this the most
  important part of the challenge.

## 8. Quality

- `tsc --noEmit` in CI. **Vitest** (5.x) for unit and integration tests; **Playwright**
  (`@playwright/test` 1.x) for E2E. Agent decision tests stub the LLM and assert the
  deterministic parts (rules, guards, tools); an optional eval suite runs against a real model.
- Lint and format: **ESLint 9** (the Next.js config, plus the `ui-framework` rules) and
  **Prettier** (Tailwind class sorting); husky runs lint-staged + typecheck on commit and
  commitlint on the message.
- Conventional Commits; GitHub Actions CI.

## 9. Local dev & deploy

- `docker compose up -d` brings up Postgres (and Valkey, if BullMQ is chosen). The app runs on the
  host with `pnpm dev`; a Dockerfile exists for deploy parity. `.env.example` lists every
  variable, with no secrets.
- **Deploy target - Open** (optional in the PRD, but it earns extra points):
  - **Render**: Docker web service + managed Postgres + background worker + Key Value. Fits a
    queue worker.
  - **Vercel**: native Next.js, but needs external Postgres and has no long-running worker, so no
    BullMQ worker.
  Either way: keys stay in the platform's secret store, and there is per-user and per-IP rate
  limiting plus an LLM spend cap.

## 10. Decisions

| Topic | Default | Status |
| --- | --- | --- |
| Granularity | One Next.js app, modules under `src/modules` | Decided |
| ORM | Drizzle + committed migrations | Decided |
| Auth | BetterAuth (Drizzle adapter) | Decided |
| Agent framework | Mastra | Decided (PRD preference) |
| Local infra | Docker Compose | Decided |
| LLM provider | - | Open |
| Queue | None until needed; pg-boss or BullMQ | Open |
| Lint/format | ESLint + Prettier, husky, commitlint | Decided |
| Deploy | Render or Vercel | Open |
