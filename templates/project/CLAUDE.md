# Project {{PROJECT_ID}}

Context for Claude Code when working in this project. Workspace-wide rules in
the root `CLAUDE.md` and `.claude/rules/` still apply. Start Claude Code from
the workspace root, not from this directory: the REA MCP server, workspace
settings and skills are not available in a session started here.

- Objective: {{OBJECTIVE}}
- Metadata and status: `project.yaml` (update `status`/`updated` on stage changes).
- Scope and authorization: `scope/target.md`, `scope/authorization.md` — read
  before any analysis. Runtime interaction requires `authorization.confirmed: true`.
- Plan: `plans/investigation-plan.md`. Findings: `findings/findings.md`.
  Evidence register: `evidence/register.md`. Working log: `notes/log.md`.
- Write all output for this project inside this directory only. Large or
  reproducible REA output goes to `artifacts/`.

## Project-specific notes

<!-- Add target-specific conventions here (e.g. build identifiers, module naming). -->
