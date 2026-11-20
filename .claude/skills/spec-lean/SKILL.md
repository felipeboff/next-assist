---
name: spec-lean
description: 'Spec-driven feature work that freezes obligations instead of the plan: one human-reviewed plan with EARS criteria, path, entities, interface and one-way doors, then proof-backed checks, then build, then an independent Verifier. Use when the user says "spec-lean", "plan feature", "specify feature", "write the checks", "build this plan", or "verify work". Do NOT use for standalone design documents unattached to a feature, architecture decomposition analysis, or work that already has a task list or checklist to execute.'
license: CC-BY-4.0
metadata:
  author: Tech Leads Club - github.com/tech-leads-club
  version: '2.1.0'
---

# Tech Lead's Club - Spec, Lean

Freeze the obligations. Free the plan. Prove it with someone who did not build it. Derived from tlc-spec-driven 3.3.0 (Felipe Rodrigues), tlc-plan, and tlc-implement.

## Project conventions - these override the generic text below

- **No commit until the user asks for one.** This overrides rule 8: an approved plan authorizes
  local edits only. The build creates no branch and makes no commit, `git add`, `git stash` or
  history change; the whole feature stays in the working tree, where the user reviews it. Where
  the text below says "commit" before the user's request, read "change in the working tree".
- **Verify before the review.** When every proof is green, run `check_proofs.py <feature>` over
  the working tree. It exits 1 because the tree is dirty, and that is the only failure allowed:
  every row in `proofs.md` passes. Dispatch the Verifier over the working tree (`git diff main`
  plus the untracked files) and fix its findings in place. Then run `check_proofs.py` again with
  `--mutations .specs/features/<feature>/mutations.json`: every row passes and every mutation is
  killed. `mutate.py` journals and restores each file byte for byte, uncommitted changes
  included.
- **Then stop for the review.** Report the checks closed, the proof results, the findings and
  their fixes, and the changed files (`git status`). Nothing is done until the user has read it;
  review feedback becomes more changes in the working tree and another `check_proofs.py` run.
- **After the user asks to commit**, split the reviewed changes into coherent commits, each slice
  with its tests, staged by path. Then run `check_proofs.py` with `--mutations` again at the new
  `HEAD`, write each finding's commit in `Closed`, and run `validate_verification.py <feature>`.
  Until then the report says the gate waits for the user's commit, never that the feature is
  done. The screens sub-agent's verdict binds to a `HEAD`, so a feature with a binding capture
  saves its pictures and runs the screens sub-agent after that commit.
- **Commit format**: Conventional Commits, in English. The commit history is graded by the
  challenge ("commits that tell the story of the development"), so each commit is one coherent
  slice with its tests and a message that says what changed and why. commitlint runs in the
  husky `commit-msg` hook (do not run `check_commit.py` or install its hook); the hook strips
  co-author trailers, so add none. A red
  hook is fixed, never bypassed (`--no-verify`, `HUSKY=0`). Push, pull request and merge each
  need their own request.
- **Stack and proofs**: Next.js (App Router) + TypeScript strict, Drizzle on PostgreSQL,
  BetterAuth, Mastra for the agent, Docker Compose for local services, pnpm. Unit and integration
  proofs run with Vitest (`pnpm vitest run <filter>`), grouped into one run by `check_proofs.py`;
  end-to-end proofs run with Playwright (`pnpm playwright test <filter>`) and run alone. A proof
  that needs Postgres or another service states it, and the services come up with
  `docker compose up -d` before `check_proofs.py`. Agent decisions are proven against the
  deterministic parts (rules, tools, guards) with the LLM stubbed; a check never depends on a
  live model answer.
- **Language**: every artifact under `.specs/` ends up in English, like the rest of the repo.
  Conversation with the user stays in Portuguese.
- **Plan review in pt-BR first**: write the plan as `plan.pt-BR.md` (section headings stay in
  English because they are the schema; prose, table cells and EARS keywords in Portuguese -
  `QUANDO`/`SE`/`ENQUANTO`/`ENTÃO`/`DEVE`/`NÃO DEVE`; identifiers never translated) and stop for
  review. Only after the user approves it, write `plan.md` in English as a faithful translation
  (no new content), run `validate_plan.py`, then continue to checks and build. Once `plan.md`
  passes, delete `plan.pt-BR.md`: two copies drift, and `plan.md` is the only source for
  `checks.md`. A later change to the plan goes through the same order: write a new
  `plan.pt-BR.md` with the change, get approval, apply it to `plan.md`, delete the pt-BR copy.

```
┌──────┐   ┌────────┐   ┌───────┐   ┌────────┐
│ PLAN │ → │ CHECKS │ → │ BUILD │ → │ VERIFY │
└──────┘   └────────┘   └───────┘   └────────┘
 read it    obligations   yours       always
```

The common failure of a coding agent is a requirement that never became an active obligation,
followed by a completion claim. What works against it is a small, frozen, external obligation set
and a verifier that is not the author, so the budget goes there and not into choreographing the
model. A human confirms what must be true and how it is being built in one document; only then does
it become obligations with proofs. There is no task breakdown and no component catalogue: what is
hard to reverse gets a one-way door with its literal shape, and the rest is decided while building.

## Rules

These hold even if no reference file is read. Each one lives here; the references point back.

1. Every check is one observable claim with a concrete value plus the proof that settles it: a test
   or command whose exit code decides, or, for a state a capture draws, a picture of it judged
   against the capture (rule 9).
2. Tests assert what the checks say, not what the code happens to do. Do not write a test by
   reading the implementation.
3. A test changes only with the claim it proves, and leaves with the code it proves, in the same
   commit. Changing a test to make a suite pass hides the failure it exists to show: a wrong check
   is a stop-and-ask.
4. Checks are fixed once `validate_checks.py` passes; a check may be appended when the walk or the
   Verifier finds a missing obligation. In the plan, `Landing`, `Surface` and the stored shape are
   additive; the path and `Changes underneath` are kept true in the commit that changes them.
5. The Verifier is a fresh sub-agent, never the author, and it always runs, once per feature,
   beside the screens sub-agent. `check_proofs.py` settles the mechanical part - every proof run
   and passing at `HEAD`, the pictures, the walk, the mutations killed - and the Verifier spends
   its time on judgement: mutations where a wrong rule would stay green, examples nobody named,
   assertions looser than their criterion. The work is done when every finding is closed by a
   commit and `proofs.md` is green at `HEAD`.
6. The mutation count is declared in `checks.md` (`Mutations:`, 3 by default) and decides how many
   rules the Verifier probes, not how good the work is: code quality, the tests behind every check
   and a complete `Coverage` join are owed whatever N is. The checks are the floor; an edge case or
   guard no check names is still the work.
7. The completion gate is a script: `validate_verification.py` exits 0. The final report opens
   with its last line; a red gate is said first, never left for the reader to find.
8. An approved spec authorizes local edits and local commits. `git push`, deploy and production
   data changes need an explicit go-ahead for that action.
9. **A state a capture draws is one picture.** The author reaches that state and saves
   `<capture>.running.png` beside the capture from a browser window at the capture's size - its
   pixel size over its scale: a wider window lays the page out differently, and resizing the image
   afterwards hides it. Nobody reopens the app to judge it: a screens sub-agent judges the file
   ([verify-screens.md](references/verify-screens.md)), and a picture whose text reads smaller than
   the capture's was resized and is retaken. It matches the capture except for what
   `## Differences from the source` lists. A state no capture draws, and an existing screen the
   feature does not change, are proven by a test or a `walk` proof, with no picture and no judge.
10. A capture, frame or live site that comes with the request binds unless the user called it
    inspiration. A binding source is changed only by the user. Removing, renaming or departing
    from something it draws is asked, recorded as a decision in `.specs/STATE.md`, and listed in
    the plan's `## Differences from the source` with `Confirmed: y - AD-NNN`.
11. **The files hold the run; the chat does not survive a compaction.** The user's approval is
    written in plan.md as `**Approved**: <date> - user: "<their words>"` - never one the user did
    not give. Each answer goes into its file in the turn it arrives. Each sub-agent goes on the
    `**Dispatched:**` line of `checks.md` `## Handoff` before it is sent. After a compaction or in a
    new session, re-read this file and the current phase's reference, then resume from the files
    ([memory.md](references/memory.md)).

## Configuration

The project declares it in `AGENTS.md` or equivalent; `checks.md` copies the count onto its
`Mutations:` line.

```markdown
## spec-lean

mutations: 3
```

| Part | Runs | Cannot catch |
| --- | --- | --- |
| `check_proofs.py` (always) | every proof once per runner at `HEAD`, each check matched to the tests its filter selects, pictures and walk checked, mutations injected | a test that passes for the wrong reason |
| The Verifier (always) | N mutations wherever a rule lives, two examples nobody named, assertions looser than their criterion, checks that contradict a binding capture ([verify.md](references/verify.md)) | the rules no mutation probed |
| The screens sub-agent (a criterion cites a capture) | an inventory of each capture against the author's picture, every row `same` or `differs`, at a named `HEAD` ([verify-screens.md](references/verify-screens.md)) | spacing, colour and type weight; detail smaller than a screenshot shows; screens no capture draws |

Screens take no mutation; spend N where a wrong implementation costs most. Where N looks too low
for the feature, say so in one line and let the user raise it.

## Artifacts

```
.specs/
├── STATE.md                    # Decisions log (AD-NNN)
├── LESSONS.md                  # rendered by scripts/lessons.py - do not hand-edit
├── lessons.json                # machine-owned
└── features/<feature>/
    ├── plan.md                 # problem, shape, surface, doors, criteria
    ├── checks.md               # claims + proofs, the coverage join, swept, handoff
    ├── captures/               # binding source files, and the author's <capture>.running.png
    ├── screens.md              # the screens sub-agent's inventory and verdict, per picture
    ├── proofs.md               # written by check_proofs.py: every proof and mutation at HEAD
    ├── mutations.json          # the Verifier's mutations, re-run after the fix
    └── verification.md         # the Verifier's findings, each closed by a commit
```

For a change under roughly three files with no one-way door, write only `checks.md` with an
`## Intent` paragraph and skip `plan.md`.

## Phases

| Phase | What it produces | Reference |
| --- | --- | --- |
| Plan | problem, shape, surface, doors, criteria; the one default stop for a human | [plan.md](references/plan.md) |
| Checks | claims with proofs, every set joined member by member, the nine dimensions swept | [checks.md](references/checks.md) |
| Build | tests from the checks, the code, commits, the screens walked and saved | [build.md](references/build.md) |
| Verify | rule 5 | [verify.md](references/verify.md), [verify-screens.md](references/verify-screens.md) |

Decisions and lessons: [memory.md](references/memory.md).

## Scripts

Resolve `<skill-dir>` as the directory containing this `SKILL.md` and run
`python3 <skill-dir>/scripts/<name>.py`. Pass `--root` when cwd is not the project root. A non-zero
exit means stop and fix. Run a script rather than read it: its messages say what to change.

| When | Command |
| --- | --- |
| Before presenting the plan | `validate_plan.py <feature>` |
| Before starting to build | `validate_checks.py <feature>` - it also requires the plan's `**Approved**:` line |
| Before each commit | `check_commit.py --message "<msg>"` |
| Before dispatching the Verifier, and after the fix | `check_proofs.py <feature> [--mutations <mutations.json>]` |
| Before declaring done | `validate_verification.py <feature>` |
| At distillation | `lessons.py add ...` |
| After editing a validator or template | `selftest.py` |

`selftest.py` mutates the fixtures in `scripts/fixtures/` once per gate rule and requires every
mutant to be killed; the fixtures are also a worked example of a passing artifact set.

## Requires

| Needs | For | Without it |
| --- | --- | --- |
| Python 3.8+ (standard library only) | every script | the gates do not run; the phases still apply |
| git | `mutate.py` and `check_proofs.py` (HEAD, clean tree) | no mutations and no HEAD check: say so in the report |
| sub-agents | the Verifier and the screens sub-agent | run their file in a new session and write `self-verified`; the gate warns |
| a model that reads images | the screens sub-agent | hand the pictures and the captures to the user |
| a browser the agent can drive | saving `<capture>.running.png` and the walk | hand the steps to the user |

Test runners: `check_proofs.py` groups bun, vitest, jest, pytest and go test into one run each
([scripts/runners.py](scripts/runners.py)); any other command runs alone and is judged by its exit
code.

## Output

Produce the artifact; do not narrate the phase. Lead with the verdict and state decisions plainly.
Section headings stay in English; prose follows the project; identifiers are never translated.
