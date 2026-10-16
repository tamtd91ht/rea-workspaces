# Changelog

Changes to the workspace itself (configuration, docs, templates, scripts).
Project changes belong in each project's `notes/log.md`.

## 2026-10-16 — Initial workspace

- Cloned `morluto/rea` into `rea-core/` (unmodified, independent clone).
- Registered REA MCP server at Claude Code local scope for this directory,
  pinned to `rea-agents@6.5.0`. Backup of the previous user config:
  `~/.claude.json.bak-rea-workspace-20261016`. Undo:
  `claude mcp remove --scope local rea` (from the workspace root).
- Added `CLAUDE.md`, `.claude/settings.json`, four rules, four skills
  (`rea-project-init`, `rea-investigation`, `rea-evidence-review`, `rea-project-closeout`).
- Added project skeleton (`templates/project/`) and document templates.
- Added `scripts/new-project.mjs` and `scripts/check.mjs` (Node, no dependencies).
- Added documentation under `docs/`.
- Root Git repository tracking workspace files only; remote
  `https://github.com/tamtd91ht/rea-workspaces.git`.
