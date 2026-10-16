# REA Workspace

Long-term workspace for independent projects that combine authorized reverse
engineering (REA), engineering workflows (ECC components) and UI/UX design
(UI UX Pro Max), orchestrated by Claude Code. The tools do not integrate with
each other on their own; this file and `docs/combined-workflows.md` define how
they are used together.

## Layout

| Path | Role |
| --- | --- |
| `rea-core/`, `ecc-reference/`, `ui-ux-pro-max-reference/` | Upstream reference checkouts (own Git history, not installations). Read only; never edit, reset or commit. |
| `projects/<YYYYMMDD-name>/` | One directory per project. Not tracked by the workspace repo. |
| `templates/` | Project skeleton and document templates. |
| `docs/` | Procedures. Start at `docs/operating-guide.md`. |
| `scripts/` | `new-project.mjs`, `check.mjs`, `active-project.mjs`, `test-guard.mjs`. |
| `archive/` | Closed projects. |
| `.claude/` | Rules, skills, agents, guard hook — `docs/claude-code-guide.md`; third-party origins in `.claude/THIRD_PARTY_NOTICES.md`. |

Start Claude Code from this root. REA's MCP server is registered at local scope
for this directory only; sessions started inside a project with its own Git
repo do not see it, nor the workspace settings and skills.

## Tool responsibilities and selection

| Need | Tool | Entry point |
| --- | --- | --- |
| Inspect a shipped binary/app/website the user may examine; evidence | REA (MCP `mcp__rea__*`, CLI `npx -y rea-agents@6.5.0`) | `/rea-investigation` |
| UI: style, palette, typography, layout, UX/accessibility guidance | UI UX Pro Max skill (`.claude/skills/ui-ux-pro-max`, v2.15.0) | `/rea-ui-design` |
| Plan, TDD, build fixes, code/security review, verification | ECC agents and skills (copied, commit `76aaa77`) | `/rea-engineering` |

Use only the tools the project needs (`project.yaml` `type`: investigation,
ui-design, engineering, combined). Do not use REA for ordinary source-code
analysis, nor UI UX Pro Max for backend-only work. Tool recommendations are
not verification.

## Projects

- Every piece of work belongs to one project; if none is named, run
  `node scripts/check.mjs projects` and ask. Create with `/rea-project-init`.
- Read the project's `CLAUDE.md`, `project.yaml` and relevant stage files first.
- Lifecycle: proposed → initialized → investigating → design → implementation
  → review → completed → archived (skip what does not apply).
- Workflow skills: `/rea-project-init`, `/rea-investigation`, `/rea-ui-design`,
  `/rea-engineering`, `/rea-session-save`, `/rea-session-resume`,
  `/rea-evidence-review`, `/rea-project-closeout`.

## Standards

- Findings: **Verified / Inferred / Unknown**, IDs `F-###` citing `E-###` in
  `evidence/register.md`. Decisions: `D-###` in `plans/decisions.md`.
  Requirements: `R-###`. Never invent tool output, endpoints, behavior, paths
  or test results; a check that was not run is "not run".
- Code goes in the repository named in `project.yaml` `implementation.repository`,
  following its existing stack and conventions; no new frameworks without approval.
- UI: respect an existing design system; record accepted decisions in
  `design/design-system.md` before implementing.

## Security

- Only targets the user owns or is authorized to examine; runtime interaction
  requires `authorization.confirmed: true` in `project.yaml`.
- No passwords, cookies, tokens or keys in files, reports or commits. The guard
  hook blocks secret-like content outside `artifacts/` / `evidence/raw/` and
  writes into a non-active project; if it blocks you, redact or ask — never
  work around it.
- External data flows need approval: UI UX Pro Max Gemini generators,
  `shadcn` installs, posting reviews to GitHub. Local tools do not keep data
  local once results reach the model provider.

## Ask the user before

- Runtime interaction with an external target, or anything state-changing.
- Installing software, changing global/user configuration, re-running
  `rea setup`, `uipro init/update`, or copying more ECC components.
- Deleting, moving or overwriting existing files; archiving; `git init` or
  pushing any repository.

Details: `docs/architecture.md`, `docs/combined-workflows.md`,
`docs/rea-guide.md`, `docs/ecc-guide.md`, `docs/ui-ux-pro-max-guide.md`,
`docs/security-and-privacy.md`, `docs/maintenance.md`, `docs/troubleshooting.md`.
