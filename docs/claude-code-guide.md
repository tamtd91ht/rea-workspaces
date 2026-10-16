# Claude Code configuration

Conventions verified against the Claude Code docs (code.claude.com, memory,
skills, settings, permissions, MCP pages) on 2026-10-16 for Claude Code 2.1.x.

## What loads when

Start `claude` in the workspace root. Then:

| Item | Source | Loaded |
| --- | --- | --- |
| `CLAUDE.md` | root | At launch |
| `.claude/rules/*.md` | root | At launch (no `paths:` frontmatter, so always) |
| `projects/<id>/CLAUDE.md` | project | On demand, when Claude works in that directory |
| `.claude/skills/*/SKILL.md` | root | Discoverable; invoke with `/name` |
| `.claude/settings.json` | root | Session's working directory only — not inherited by sessions started in subdirectories |
| `rea` MCP server | `~/.claude.json`, local scope for this directory | At launch |

## Files

| File | Purpose |
| --- | --- |
| `CLAUDE.md` | Workspace map, project selection, REA usage, evidence and security essentials, when to ask |
| `.claude/rules/project-management.md` | Naming, creation, status updates, Git/archive approval |
| `.claude/rules/evidence.md` | Labels, registers, IDs, no fabrication |
| `.claude/rules/security.md` | Authorization gate, redaction, captures, debug ports, provider data |
| `.claude/rules/workspace-integrity.md` | Protect `rea-core`, user files, user config; keep docs verified |
| `.claude/settings.json` | Deny reading key/env files; deny edits in `rea-core/`; ask before `git push` and `rea setup` |
| `.claude/skills/rea-project-init` | `/rea-project-init <name> [objective]` |
| `.claude/skills/rea-investigation` | `/rea-investigation <project-id> [question]` |
| `.claude/skills/rea-evidence-review` | `/rea-evidence-review <project-id>` |
| `.claude/skills/rea-project-closeout` | `/rea-project-closeout <project-id> [archive]` — manual only (`disable-model-invocation`) |

No custom agents are defined: the investigation skill can ask Claude to use
its built-in subagents for independent questions, and a dedicated agent did not
add anything concrete. Add one under `.claude/agents/` only for a demonstrated need.

## Committed vs local

| Committed (workspace repo) | Local only |
| --- | --- |
| `CLAUDE.md`, `.claude/settings.json`, `.claude/rules/`, `.claude/skills/` | `.claude/settings.local.json`, `CLAUDE.local.md` (Git-ignored), `~/.claude.json` (MCP registration) |

Put personal permission approvals in `.claude/settings.local.json`. Never put
credentials in any of these files.

## Permissions notes

- `deny` beats `ask` beats `allow`. The deny rules block Claude's Read/Grep/Glob
  and common shell readers for those paths, but not every subprocess.
- No broad `allow` rules are configured; normal prompts apply.

## Changing the configuration

Keep `CLAUDE.md` short; put procedures in skills or `docs/`. Record changes in
`CHANGELOG.md`. Verify new settings keys against the official schema
(`https://json.schemastore.org/claude-code-settings.json`).
