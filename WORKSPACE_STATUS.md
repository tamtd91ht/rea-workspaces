# Workspace status

Environment and REA state as last verified. Project status is not recorded
here (this file is pushed to GitHub); run `node scripts/check.mjs projects`.

**Last verified:** 2026-10-16

| Item | State |
| --- | --- |
| Host | Windows 11 (10.0.26200), Git Bash + PowerShell 5.1 |
| Node.js / npm | 22.22.2 / 10.9.7 (within REA's supported range) |
| Git | 2.44.0.windows.1 |
| Claude Code | 2.1.301 |
| rea-core | `https://github.com/morluto/rea.git`, `main` @ `1bd5c5c87` (`rea-agents-6.5.0-275`), unmodified, submodules not initialized (not needed for package use) |
| REA package | `rea-agents@6.5.0` (npm `latest` on 2026-10-16), via `npx`, no global install |
| MCP registration | Claude Code local scope for this directory: `cmd.exe /d /c npx -y rea-agents@6.5.0 mcp` — `claude mcp list`: Connected |
| MCP server self-check | `mcp doctor`: healthy, 207 tools, 6 prompts |
| REA skill | Not installed at user level; read from `rea-core/.agents/skills/reverse-engineer-anything/` |
| Analysis engines | None configured (Ghidra, IDA, JADX absent; Hopper n/a on Windows) |
| Other tools present | Chrome, Java 21, Python 3.14; `jq` absent (not required) |

## Verified capabilities

- Static JavaScript/Electron analysis via CLI on a synthetic sample app
  (`analyze-javascript-application`, `inspect-analysis-view`): exit 0, Evidence produced.
- MCP server startup and target-free `binary_session` request (`mcp doctor`).
- `claude mcp list`: `rea` connected from the root and `docs/`; **not** available
  inside a project with its own Git repo (start Claude from the root).

## Not verified

- REA tool calls from inside a live Claude Code session (needs a session
  started after registration — see getting-started step 4).
- Native, Android, browser/Electron runtime workflows (engines/targets absent).
