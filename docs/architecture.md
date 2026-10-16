# Architecture

## Responsibilities

| Path | Owns | Version control |
| --- | --- | --- |
| `CLAUDE.md`, `.claude/` | How Claude Code behaves in this workspace | Workspace repo |
| `docs/` | Procedures (one authoritative document per topic) | Workspace repo |
| `templates/` | The approved project skeleton and document templates | Workspace repo |
| `scripts/` | Project creation and read-only checks | Workspace repo |
| `rea-core/` | Upstream REA source, docs and official agent skill | Its own clone of `morluto/rea` |
| `projects/<id>/` | One project's scope, evidence, findings, deliverables | Optional per-project repo |
| `archive/<id>/` | Closed projects | Same as the project |

The workspace and its projects have separate responsibilities: the workspace
holds the environment and reusable procedures; a project holds its target,
scope, evidence and decisions. Nothing project-specific is written outside
`projects/<id>/`.

## Git model

- **Workspace repo** (root): tracks only workspace files. `.gitignore` excludes
  `rea-core/`, `projects/*`, `archive/*`, secrets and captures. No project names
  or project data are committed, because this repository has a remote
  (`github.com/tamtd91ht/rea-workspaces`).
- **rea-core**: an independent clone of `https://github.com/morluto/rea.git`.
  Not a submodule; never modified. See [rea-maintenance.md](rea-maintenance.md).
- **Project repos**: optional (`new-project.mjs --git`). Use one when the
  project runs for a long time or its reports need history. Never add a remote
  without deciding where project data may be stored (see
  [security-and-privacy.md](security-and-privacy.md)).
- No submodules, worktrees or monorepo tooling.

## REA integration

| Layer | Where | Notes |
| --- | --- | --- |
| MCP server | `~/.claude.json` → `projects["D:/…/rea-workspaces"].mcpServers.rea` (Claude Code **local scope**) | `cmd.exe /d /c npx -y rea-agents@6.5.0 mcp`; only this workspace sees it |
| CLI | `npx -y rea-agents@6.5.0 <command>` | No global install |
| Investigation method | `rea-core/.agents/skills/reverse-engineer-anything/` | Read by `/rea-investigation`; the user-level skill is intentionally not installed |
| Analysis engines | Not installed (Ghidra/IDA/JADX are bring-your-own) | Static JS/Electron, .NET, Go/Rust metadata work without them |

Local scope was chosen so that REA's 207 tools are not loaded into unrelated
Claude Code projects.

## Session model

Start Claude Code from the workspace root. Verified on 2026-10-16 with
`claude mcp list`: `rea` is connected from the root and from a plain
subdirectory of the workspace repo (`docs/`), but **not** from inside a project
that has its own Git repository. Claude Code also does not inherit
`.claude/settings.json` from parent directories, and project skills are
discovered only up to the nearest Git root — so a session started inside such a
project misses the MCP server, workspace settings and skills.

## Why the project skeleton lives in `templates/project/`

Keeping it out of `projects/` means every directory in `projects/` is a real
project: inventory, ignore rules and scripts need no exceptions.
