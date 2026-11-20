---
name: docs-writer
description: Write, review, and edit documentation files with consistent structure, tone, and technical accuracy. Use when creating docs, reviewing markdown files, writing READMEs, updating `/docs` directories, or when user says "write documentation", "review this doc", "improve this README", "create a guide", or "edit markdown". Do NOT use for code comments, inline JSDoc, API reference generation, ADRs (use create-adr) or component docs (use ui-framework).
---

# `docs-writer` skill instructions

As an expert technical writer and editor, your goal is to produce and refine documentation that is
accurate, clear, consistent, and easy to understand. In this repo the **README is a graded
deliverable** of the Nexo Assist challenge ("Comunicação: clareza do README"), so it gets the most
care.

## Where docs live

| Doc | Path | Notes |
| --- | --- | --- |
| README | `README.md` | The entry point for the evaluators. Checklist below. |
| ADRs | `docs/adr/NNN-title.md` | Written with `create-adr`; the README links the main ones. |
| Feature specs | `.specs/` | Owned by `spec-lean`; not edited by this skill. |
| UI framework docs | `.claude/skills/ui-framework/` | Owned by `ui-framework`. |
| Env vars | `.env.example` | Every variable, with a placeholder and a one-line comment. No secrets. |

**Language**: files in this repo are in English. The evaluators read Portuguese, so ask the user
once whether the README is in English or Portuguese, then write the answer into this line and
follow it.

## README checklist (from the challenge PRD)

The README must cover, each in its own section:

1. **How to run**: prerequisites (Node, pnpm, Docker), `.env` from `.env.example`, the few
   commands that bring it up (services, migrations, seed, dev server), and the seeded logins.
   Every command is one you actually ran.
2. **Architecture overview**: the separation between interface, agent and services, with a
   diagram (`mermaid-studio`; GitHub renders Mermaid natively).
3. **How the agent decides what to do**: the decision flow per message, the tools, the rules
   from the service desk (PRD Annex A) and where each is enforced (prompt vs code).
4. **How decision quality was ensured**: tests, evals, guards, and what they cover.
5. **LLM provider and model choice**, with the reason (quality, latency, cost per conversation).
6. **Main trade-offs.**
7. **What I would do with more time.**
8. **Deploy** (if done): the link, how it was deployed, how keys are protected and usage is
   limited.

## Step 1: Understand the goal and create a plan

1. **Clarify the request:** identify the feature, command or concept the doc covers.
2. **Writing or editing?** If ambiguous ("fix the docs"), ask.
3. **Plan** the changes step by step.

## Step 2: Investigate and gather information

1. **Read the code** the doc describes (`src/`, `package.json` scripts, `docker-compose.yml`,
   `.env.example`). Documentation is backed by the implementation, never by memory or intent.
2. **Read the current file** before changing it.
3. **Check connections:** if a command, script or env var changes, update every doc that
   mentions it, and keep the links between the README and `docs/` valid.

## Step 3: Write or edit

1. Follow [the style guide](references/style-guide.md).
2. Make sure each statement matches the code as it is now.
3. Use the Edit tool for small changes and Write for new files or full rewrites.
4. When editing: close gaps where the doc no longer matches the code, keep an active voice,
   fix awkward wording, and keep terminology consistent (use the PRD's domain words: chamado,
   incidente/requisição, analista, central de ajuda).

## Step 4: Verify and finalize

1. **Run what you documented**: every command in "How to run" is executed from a clean state, or
   the README says it was not.
2. **Verify links**: relative links resolve; anchors exist.
3. **Format**: run the repo's format script if it exists (see `package.json`).
