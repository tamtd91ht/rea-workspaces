# REA maintenance

Four things update independently. Do not confuse them.

| What | Where | Updated by | Affects |
| --- | --- | --- | --- |
| Source clone | `rea-core/` | `git pull --ff-only` | Docs and the investigation instructions Claude reads |
| Package | npm `rea-agents@<version>` | Changing the pinned version | CLI commands and the MCP server |
| MCP registration | `~/.claude.json` (local scope, this directory) | `claude mcp remove` + `add` | Which version Claude Code starts |
| Analysis engines | Ghidra / IDA / JADX / Hopper installations | Their own installers | Native / Android analysis |

Pinned version: **6.5.0** (2026-10-16). Check the latest release with
`npm view rea-agents dist-tags.latest`.

## 1. Update the source clone

```bash
git -C rea-core status --short          # must be empty; never discard changes to "fix" this
git -C rea-core fetch origin
git -C rea-core log --oneline HEAD..origin/main | head -20
git -C rea-core pull --ff-only
```

`rea-core` tracks `main`, which can document features newer than the pinned
package. The live MCP tool list is authoritative. To read docs matching the
pinned release without moving the checkout:
`git -C rea-core show rea-agents-6.5.0:docs/cli.md`.

## 2. Move to a new package version

1. Read the release notes: `rea-core/CHANGELOG.md` (after step 1) or GitHub releases.
2. Smoke-test the new version without touching the registration:
   ```bash
   npx -y rea-agents@<new> mcp doctor --json     # healthy: true
   npx -y rea-agents@<new> --help
   ```
3. Back up the registration and note any `env` values on the `rea` entry
   (keys only matter; they are not secrets by default):
   ```powershell
   Copy-Item $HOME\.claude.json "$HOME\.claude.json.bak-rea-$(Get-Date -Format yyyyMMdd)"
   ```
4. Re-register from the workspace root (PowerShell; `CLAUDE_CONFIG_DIR` unset):
   ```powershell
   claude mcp remove --scope local rea
   claude mcp add --scope local rea -- cmd.exe /d /c npx -y rea-agents@<new> mcp
   ```
   Re-apply recorded environment values with `-e NAME=value` options (see
   section 4 for the form). Removal does not preserve them. `rea update`, `rea doctor` and
   `rea uninstall` do **not** see local-scope registrations
   (`rea-core/docs/installation.md`).
5. Update the pinned version in the workspace, then record it in `CHANGELOG.md`
   and `WORKSPACE_STATUS.md`:
   ```bash
   git grep -n "6\.5\.0" -- . ':!CHANGELOG.md'
   ```
   (`scripts/lib.mjs` `REA_VERSION`, `CLAUDE.md`, skills, docs, `.claude/settings.json`.)
6. Restart Claude Code, run `node scripts/check.mjs` and `claude mcp list`.

Existing projects keep their `rea.version` in `project.yaml`; that is a
record of what produced their evidence, not something to rewrite.

## 3. Rollback

Re-run step 4 with the previous version, or restore the backup copy of
`~/.claude.json` (only if nothing else changed in it since — compare first).

## 4. Analysis engines (optional)

Not installed on this machine. REA never installs them for you.

| Engine | Configure | Check |
| --- | --- | --- |
| Ghidra 12.1.x (experimental on Windows) | `GHIDRA_INSTALL_DIR` | `npx -y rea-agents@6.5.0 doctor --provider ghidra --json` |
| IDA (licensed) | `REA_IDA_MCP_CONFIG` | `... doctor --provider ida --json` |
| JADX headless MCP 0.7.1 + JDK | `REA_JADX_MCP_JAR` | `... doctor --json` (providerInspections) |
| Hopper | macOS/Linux only | `... doctor --provider hopper --json` |

Environment variables for the MCP server go on the registration. Re-register
(PowerShell, workspace root) following the `claude mcp add -e KEY=value <name> -- <command>`
form from `claude mcp add --help` and the Claude Code MCP docs; the path is an example:

```powershell
claude mcp remove --scope local rea
claude mcp add --scope local -e GHIDRA_INSTALL_DIR=D:/tools/ghidra_12.1 rea -- cmd.exe /d /c npx -y rea-agents@6.5.0 mcp
```

Then confirm with `claude mcp list` and the provider doctor check.
Guides: `rea-core/docs/installation.md#ghidra`, `rea-core/docs/ida-provider.md`,
`rea-core/docs/android-analysis.md`, `rea-core/docs/windows-ghidra-p0.md`.

## 5. Remove REA from this workspace

```powershell
claude mcp remove --scope local rea      # from the workspace root
```

The npx cache can be left alone; `rea-core/` is just a directory.
