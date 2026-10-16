# Project {{PROJECT_ID}}

Context for Claude Code when working in this project. Workspace-wide rules in
the root `CLAUDE.md` and `.claude/rules/` still apply. Start Claude Code from
the workspace root, not from this directory: the REA MCP server, workspace
settings and skills are not available in a session started here.

- Type: {{PROJECT_TYPE}} — workflows: {{WORKFLOWS}}
- Objective: {{OBJECTIVE}}
- Metadata and status: `project.yaml` (update `status`/`updated` on stage changes).
- Decisions: `plans/decisions.md`. Working log: `notes/log.md`.
- Write all output for this project inside this directory, except code that
  belongs in the repository named in `project.yaml` `implementation.repository`.
  Large or reproducible output goes to `artifacts/`.
- Investigation stage: read `scope/` first; runtime interaction requires
  `authorization.confirmed: true`.
- Design stage: accepted decisions live in `design/design-system.md`;
  generated UI UX Pro Max output is a proposal until accepted.

## Project-specific notes

<!-- Add conventions here (e.g. build identifiers, module naming, stack versions). -->
