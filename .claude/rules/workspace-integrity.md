# Workspace integrity rules

- `rea-core/` is the upstream clone. Allowed: reading, `git status`, `git fetch`,
  `git pull --ff-only` on a clean tree after asking. Forbidden: edits, commits,
  resets, checkouts that discard work, `git clean`.
- Never delete, move or overwrite existing user files without explicit approval;
  inspect the target first.
- Changes to workspace files (CLAUDE.md, `.claude/`, `docs/`, `templates/`,
  `scripts/`) get a `CHANGELOG.md` entry. Keep one authoritative document per
  procedure and link to it instead of duplicating text.
- Commands written into documentation must be verified against `--help` or the
  REA docs in `rea-core/docs/` for the pinned version.
- Do not change user-level Claude Code configuration (`~/.claude*`) or run
  `rea setup` without approval.
