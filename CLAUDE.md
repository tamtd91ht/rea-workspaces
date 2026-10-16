# REA Workspace

Long-term workspace for independent, authorized reverse-engineering projects
powered by REA (https://github.com/morluto/rea) and Claude Code.

## Layout

| Path | Role |
| --- | --- |
| `rea-core/` | Official upstream clone (read-only reference; own Git history). Never edit, reset or commit here. |
| `projects/<YYYYMMDD-name>/` | One directory per project: scope, plans, evidence, findings, reports. Not tracked by the workspace repo. |
| `templates/` | Source of truth for new projects (`templates/project/` skeleton + document templates). |
| `docs/` | Detailed procedures. Start at `docs/operating-guide.md`. |
| `scripts/` | `new-project.mjs` (create project), `check.mjs` (health, inventory, sensitive files), `active-project.mjs` (set/clear active project), `test-guard.mjs`. |
| `archive/` | Closed projects moved out of `projects/`. |
| `.claude/` | Rules, skills, agents and the guard hook — see `docs/claude-code-guide.md`. |

Workflow skills: `/rea-project-init`, `/rea-investigation`, `/rea-session-save`,
`/rea-session-resume`, `/rea-evidence-review`, `/rea-project-closeout`.
Backend reference skills (Java/Spring Boot, Go) and reviewer agents come from
ECC (`.claude/THIRD_PARTY_NOTICES.md`); `report-sanitizer` audits deliverables.

A PreToolUse guard hook blocks secret-like content outside `artifacts/` and
`evidence/raw/`, blocks writes into a project other than the active one
(`.claude/active-project`), and asks before destructive shell commands. If it
blocks you, redact or ask the user — never work around it.

Start Claude Code from this root directory. The REA MCP server is registered at
Claude Code **local scope for this directory only**; workspace settings and
skills are not inherited by sessions started inside `projects/`.

## Choosing the project context

- Every investigation belongs to exactly one project under `projects/`.
- If the user has not named a project, list them (`node scripts/check.mjs projects`)
  and ask. Never write one project's artifacts into another project.
- Read the project's `CLAUDE.md`, `project.yaml` and `scope/` before acting.
- New project: use `/rea-project-init` (wraps `node scripts/new-project.mjs`).

## Using REA

- Prefer the connected MCP tools (`mcp__rea__*`). Use the server's live tool
  list and schemas; `rea-core` main may document features newer than the
  registered release (pinned `rea-agents@6.5.0`).
- CLI fallback: `npx -y rea-agents@6.5.0 <command> --json`. Verify commands
  with `--help`; never invent commands or flags.
- Routing and investigation method: `rea-core/.agents/skills/reverse-engineer-anything/SKILL.md`
  and its `references/`. Use `/rea-investigation`.
- Save large REA output under the project's `artifacts/`, then summarize.

## Evidence standards

- Label every conclusion **Verified**, **Inferred** or **Unknown**.
- Every significant finding gets an ID (`F-001`) and evidence references
  (`E-001`) registered in `evidence/register.md`.
- Never invent tool output, endpoints, behavior or paths. Never claim an
  inspection that was not performed.

## Security and authorization

- Only analyze targets the user owns or is authorized to examine; the project's
  `scope/authorization.md` must record the basis before runtime interaction.
- No passwords, cookies, tokens or API keys in any file, report or commit.
  Redact before saving. Captures (`*.har`, `*.saz`, `*.pcap`) stay out of Git.
- Runtime/browser actions: non-destructive, in scope, test accounts, debugging
  ports bound to `127.0.0.1` only.

## Ask the user before

- Runtime interaction with an external target, or anything state-changing.
- Installing software, changing global/user configuration, or re-running `rea setup`.
- Deleting, moving or overwriting existing files; archiving a project; `git init`
  or pushing a project repository.
- Any change inside `rea-core/` other than `git fetch`/fast-forward pull.

## Further documentation

`docs/getting-started.md`, `docs/operating-guide.md`, `docs/project-lifecycle.md`,
`docs/security-and-privacy.md`, `docs/rea-maintenance.md`,
`docs/claude-code-guide.md`, `docs/troubleshooting.md`, `docs/architecture.md`.
