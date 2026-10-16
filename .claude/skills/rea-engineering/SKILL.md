---
name: rea-engineering
description: Run the engineering stage of a workspace project — plan from approved requirements (and accepted design/findings), implement with TDD in the user's own repository, fix builds, review, and verify, recording plan and results in the project. Coordinates the workspace's ECC agents and skills. Use when a project moves from investigation or design to implementation.
argument-hint: "<project-id> [requirement or step]"
---

# Engineering stage (ECC workflows)

Coordinates ECC components installed in this workspace (see
`.claude/THIRD_PARTY_NOTICES.md`); it does not duplicate them. Scale the
ceremony to the task: a one-line fix does not need a planner agent.

## 0. Project and code location

- Project from `$ARGUMENTS`; `node scripts/active-project.mjs set <id>`.
- Read `README.md`, `plans/implementation-plan.md`, `plans/decisions.md`,
  `tests/test-plan.md`, and when present `design/design-system.md` and
  `findings/findings.md`.
- Code is written in the repository named in `project.yaml`
  `implementation.repository` (the user's own). Ask for it if empty. Never
  write into `rea-core/`, `ecc-reference/`, `ui-ux-pro-max-reference/`, or
  target artifacts. Follow that repository's stack, conventions and existing
  components; add no framework or dependency without approval.

## 1. Plan

- Requirements → `R-###` rows with acceptance criteria in
  `plans/implementation-plan.md`. Each cites its source: the user, an accepted
  design decision, or a finding (observed behavior ≠ requirement).
- For non-trivial work use the `planner` agent (and `architect` for
  structural choices; `code-explorer` to map the existing code). Write the
  resulting plan into `plans/implementation-plan.md` — not `.claude/plans/`.
- Record risks (including security) and get the user's approval before coding.
- `project.yaml`: `status: implementation`.

## 2. Implement

- Test first where practical: `tdd-workflow` skill / `tdd-guide` agent;
  stack skills `springboot-tdd`, `golang-testing`, `springboot-patterns`,
  `jpa-patterns`, `golang-patterns`, `java-coding-standards`, `api-design`.
- Build failures: `java-build-resolver` or `go-build-resolver` (minimal fixes).
- UI work: implement against `design/design-system.md`; consult the
  `ui-ux-pro-max` skill for stack-specific guidance.
- Keep changes small and reviewable; commit only when the user asks.

## 3. Verify (record only what actually ran)

Fill `tests/test-plan.md`:

- Build, unit/integration tests, lint/static analysis — `verification-loop`
  skill, or `springboot-verification` for Spring Boot.
- Review — `code-reviewer`, plus `java-reviewer` / `go-reviewer`;
  `security-reviewer` for auth, input handling, APIs, secrets.
- UI — `browser-qa` and/or `e2e-testing` (Playwright) for interactions,
  responsive layout, accessibility and loading/empty/error/success states;
  compare with the accepted design system. Use only browsers and pages the
  user owns or controls.

A check not executed is "not run". Never report visual, accessibility or
security verification without the output of the check that was run.

## 4. Hand off

Update `project.yaml` (`status: review`, `updated`), `notes/log.md`, and
summarize: delivered `R-###`, test results, known issues. Then
`/rea-evidence-review` (if there are findings) and `/rea-project-closeout`.
