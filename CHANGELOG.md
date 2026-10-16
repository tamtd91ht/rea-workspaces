# Changelog

Changes to the workspace itself (configuration, docs, templates, scripts).
Project changes belong in each project's `notes/log.md`.

## 2026-10-16 — Vietnamese README and templates

- Translated `README.md`, `projects/README.md`, `archive/README.md`, all
  `templates/*.md` and `templates/project/*` (including YAML/gitignore comments)
  and the generated README layout rows in `scripts/new-project.mjs`.
- Kept in English: placeholders, YAML keys, IDs, Verified/Inferred/Unknown
  labels and status values (`open`, `accepted`, `not run`, `pass`, …) that
  skills and docs rely on.
- Renamed referenced headings: "Current state" → "Trạng thái hiện tại",
  "Target routing" → "Định tuyến target"; updated the skills and docs that cite them.

## 2026-10-16 — Three-tool workspace: REA + ECC + UI UX Pro Max (KET-HOP v3.0)

- Cloned reference checkouts `ecc-reference/` (ECC @ `76aaa77`) and
  `ui-ux-pro-max-reference/` (Git-ignored, unmodified).
- Installed UI UX Pro Max at workspace scope:
  `npx -y ui-ux-pro-max-cli@2.15.0 init --ai claude` (7 skills, committed as
  installed). Marketplace/global installs not used.
- Copied more ECC components (verbatim, `76aaa77`): agents `planner`,
  `architect`, `code-reviewer`, `tdd-guide`, `java-build-resolver`,
  `go-build-resolver`, `code-explorer`; skills `tdd-workflow`,
  `verification-loop`, `codebase-onboarding`, `e2e-testing`, `browser-qa`.
  ECC's selective installer was evaluated and rejected (114 file operations
  for 2 requested skills). ECC commands not copied.
- Added skills `rea-ui-design` and `rea-engineering`; project types
  (`--type investigation|ui-design|engineering|combined`) with module-based
  templates; new templates `design-brief`, `design-system`,
  `implementation-plan`, `test-plan`; `project.yaml` schema_version 2;
  lifecycle stages `design` and `implementation`.
- Docs: new `rea-guide.md` (renamed from `rea-maintenance.md`), `ecc-guide.md`,
  `ui-ux-pro-max-guide.md`, `combined-workflows.md`, `maintenance.md`; updated
  the rest; README and CLAUDE.md rewritten for the four layers.
- `check.mjs`: reference checkouts, UI UX Pro Max install (runs `search.py`),
  agents, TYPE column; sensitive scan skips reference checkouts; allowlist
  entries for two UI UX Pro Max code examples.
- Verified live: REA `binary_session` call from Claude Code; skill/agent discovery.

## 2026-10-16 — Guard hook, sessions, decisions, backend skills (ideas from ECC)

- Added PreToolUse guard hook (`.claude/hooks/guard.mjs`, registered in
  `.claude/settings.json`): denies secret-like content outside `artifacts/` and
  `evidence/raw/`, denies writes into a non-active project, asks before
  destructive shell commands. Fails open. Tests: `scripts/test-guard.mjs`
  (21 cases); verified live with `claude -p`. Undo: remove the `hooks` block.
- Added `scripts/active-project.mjs` and the Git-ignored `.claude/active-project` marker.
- Added skills `rea-session-save` / `rea-session-resume` (project-scoped sessions
  in `notes/sessions/`), agent `report-sanitizer`, template `decisions.md`
  (now created in every new project as `plans/decisions.md`), `docs/playbooks/`.
- Updated `rea-investigation`, `rea-project-init`, `rea-project-closeout`,
  `security` rule, `CLAUDE.md` and docs accordingly.
- Copied from ECC 2.2.3 (`76aaa77`, MIT): skills `api-design`,
  `springboot-patterns`, `springboot-security`, `springboot-tdd`,
  `springboot-verification`, `jpa-patterns`, `java-coding-standards`,
  `golang-patterns`, `golang-testing`; agents `java-reviewer`, `go-reviewer`,
  `security-reviewer`. Notices: `.claude/THIRD_PARTY_NOTICES.md`.
- Moved secret patterns to `scripts/lib.mjs` (shared by `check.mjs` and the guard).

## 2026-10-16 — Vietnamese documentation

- Translated all guides under `docs/` to Vietnamese (commands, paths, tool
  names and the Verified/Inferred/Unknown labels unchanged).
- Added stable `<a id>` anchors so links from scripts, rules and other docs keep
  working: `register-rea-with-claude-code`, `create-a-project`, `cli-usage`,
  `evidence-management`, `workspace-checks`, `analysis-engines`.

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
