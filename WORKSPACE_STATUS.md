# Workspace status

Environment and tool state as last verified. Project status is not recorded
here (this file is pushed to GitHub); run `node scripts/check.mjs projects`.

**Last verified:** 2026-10-16

## Environment

| Item | State |
| --- | --- |
| Host | Windows 11 (10.0.26200), Git Bash + PowerShell 5.1 |
| Node.js / npm | 22.22.2 / 10.9.7 |
| Python | 3.14.3 |
| Git | 2.44.0.windows.1 |
| Claude Code | 2.1.301 |
| Global Claude config | Unchanged by the workspace except the REA local-scope entry in `~/.claude.json` (backup `~/.claude.json.bak-rea-workspace-20261016`); `~/.claude/skills` contains only `find-skills`, `synced` |

## Tools

| Tool | Reference checkout | Installed as | Scope | Readiness |
| --- | --- | --- | --- | --- |
| REA | `rea-core/` → morluto/rea `main` @ `1bd5c5c87`, unmodified | `rea-agents@6.5.0` via npx; MCP `cmd.exe /d /c npx -y rea-agents@6.5.0 mcp` | Claude Code local scope (this directory) | **Verified**: `mcp doctor` healthy (207 tools); `claude mcp list` Connected; live `binary_session` call from `claude -p` succeeded; CLI static JS analysis on a sample app |
| ECC | `ecc-reference/` → affaan-m/ECC @ `76aaa77` (v2.2.3), unmodified | Verbatim copy: 14 skills, 10 agents | Workspace `.claude/` | **Verified**: discovered by a live `claude -p` session. Not run on real code yet |
| UI UX Pro Max | `ui-ux-pro-max-reference/` → `56ea9cf` (v2.15.0+63), unmodified | `ui-ux-pro-max-cli@2.15.0 init --ai claude`: 7 skills | Workspace `.claude/skills/` | **Verified**: `search.py` design system generated offline into a test project; skills discovered by a live session |
| Workspace | — | 8 skills, `report-sanitizer` agent, guard hook | Workspace | **Verified**: `test-guard.mjs` 21/21; guard blocked fake secrets live; all 4 project types created and parsed |

## Not verified

- Native, Android, browser/Electron runtime analysis with REA (engines and targets absent).
- ECC agents/skills on a real codebase (TDD, build resolvers, reviewers, verification-loop).
- `browser-qa` / `e2e-testing` against a running UI (needs a project with a UI and Playwright or the Chrome extension).
- UI UX Pro Max generators that use external services (`design` → Gemini, `ui-styling` → shadcn) — intentionally not run.
- `/rea-session-save`, `/rea-session-resume`, `report-sanitizer` on a real project.

## Outstanding decisions / manual actions

- Remove the ineffective `"Write(rea-core/**)",` line from `.claude/settings.json`
  (Claude Code warns it is not matched; `Edit(rea-core/**)` already protects
  `rea-core`). The edit was blocked by auto mode as self-modification.
- Optional analysis engines (Ghidra 12.1.x, JADX + JDK, IDA) when a project needs them.
- Whether to track `RESEARCH-ECC.txt` (currently Git-ignored by the `/RESEARCH-*.txt` rule).
