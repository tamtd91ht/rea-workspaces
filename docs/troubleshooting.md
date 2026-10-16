# Troubleshooting

## REA tools are missing in Claude Code

1. Were you started from the workspace root? The registration is local to it.
   From a project that has its own Git repo, start `claude` in the root instead.
2. `claude mcp list` (from the root). Expect `rea: cmd.exe /d /c npx -y rea-agents@6.5.0 mcp - ✓ Connected`.
3. Not listed → register it ([getting-started.md](getting-started.md#3-register-rea-with-claude-code-this-workspace-only)).
4. Listed but failed → `npx -y rea-agents@6.5.0 mcp doctor --json` and read
   `checks` / `diagnostics.stderr`.
5. Connected but no tools in the running session → restart Claude Code.
6. Meanwhile, the CLI works without MCP: `npx -y rea-agents@6.5.0 <command> --json`.

Do not run `npx rea-agents setup` to "repair" this workspace: it would add a
user-scope registration for every project.

## Registration shows `cmd.exe D:/ C:/ npx ...`

It was added from Git Bash, which rewrites `/d` and `/c` to drive paths.
Fix from PowerShell:

```powershell
claude mcp remove --scope local rea
claude mcp add --scope local rea -- cmd.exe /d /c npx -y rea-agents@6.5.0 mcp
```

(Alternatively set `MSYS_NO_PATHCONV=1` for that one command in Git Bash.)

## `rea doctor` says Claude Code registration is missing

Expected. `rea doctor`, `rea update` and `rea uninstall` read only the
user-scope entry, not local-scope registrations. Use `node scripts/check.mjs`
and `claude mcp list`.

## A native/Android analysis fails with `capability_unavailable` or `provider_unavailable`

The engine is not configured (none are installed here). Check
`npx -y rea-agents@6.5.0 doctor --provider ghidra --json` and see
[rea-maintenance.md](rea-maintenance.md#4-analysis-engines-optional).
Static JS/Electron, .NET, Go/Rust metadata need no engine.

## Output is huge / context fills up

Write CLI output to `artifacts/` and use `inspect-analysis-view` summaries
([operating-guide.md](operating-guide.md#cli-usage)). In MCP, use
`"detail": "summary"` and the returned `parent_evidence_id`.
A `resource_constraint` with `details.resource: "transport"` means: request a
view of the retained Evidence instead of repeating the analysis.

## `new-project.mjs` errors

| Message | Fix |
| --- | --- |
| `Destination already exists` | Choose another name/date. Nothing was changed. |
| `Invalid --name` | Lowercase, digits, single hyphens, 3–48 chars, no date prefix |
| `Unresolved template placeholders` | A template has an unknown `{{KEY}}`; fix the template |
| Leftover `projects/.staging-*` | An interrupted run; inspect and delete it manually |

## `check.mjs sensitive` flags a file

Open the reported file and line (the value is masked). Redact or move the
file to `artifacts/` / `evidence/raw/`. If it was already committed in a
project repo: `git rm --cached`, commit, rotate the secret.

## jq is not installed

Not needed. Use the `node -e` one-liner in
[operating-guide.md](operating-guide.md#cli-usage).

## Upstream help

Update first (a newer release may fix it), then REA issues:
https://github.com/morluto/rea/issues — include REA version, target type,
steps and error output (redacted).
