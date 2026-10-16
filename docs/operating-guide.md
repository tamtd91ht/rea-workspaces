# Operating guide

## Daily workflow

1. Open a terminal in the workspace root and start `claude` there.
2. `node scripts/check.mjs projects` — see what is in flight.
3. Continue a project: `/rea-investigation <project-id> <question>`.
4. End of session: make sure `notes/log.md`, `findings/findings.md` and
   `project.yaml` (`status`, `updated`) reflect where you stopped.

## Create a project

In Claude Code: `/rea-project-init <short-name> <objective>` — it asks for the
target type, location and authorization basis, previews and creates the project.

Manually:

```bash
node scripts/new-project.mjs --name auth-flow-study \
  --objective "Explain how the desktop client refreshes sessions" \
  --target-type javascript-electron --dry-run
# review the preview, then run again without --dry-run (add --git for a project repo)
```

| Option | Meaning |
| --- | --- |
| `--name` | 3–48 lowercase letters/digits/hyphens; the date prefix is added (`20261016-auth-flow-study`) |
| `--objective` | One line, no secrets |
| `--target-type` | `javascript-electron`, `native-binary`, `dotnet`, `android-apk`, `website`, `network-capture`, `firmware`, `other` |
| `--title`, `--date` | Optional overrides |
| `--git` | `git init` inside the project (no remote, no commit) |
| `--dry-run` | Preview only |

The script refuses an existing destination, builds the project in a staging
directory and moves it into place only when complete. Then fill in
`scope/target.md` and `scope/authorization.md` (see
[project-lifecycle.md](project-lifecycle.md)).

## Run an investigation

Use `/rea-investigation <project-id>`. It follows the method in
`rea-core/.agents/skills/reverse-engineer-anything/SKILL.md`:

1. Questions → required evidence, written to `plans/investigation-plan.md`.
2. Route the target to the first REA tool (static before runtime).
3. Smallest useful analysis first; follow-ups only for concrete gaps.
4. Record evidence (`E-###`) and findings (`F-###`) as you go.
5. Answer each question with **Verified / Inferred / Unknown**.

### CLI usage

```bash
npx -y rea-agents@6.5.0 --help
npx -y rea-agents@6.5.0 <command> --help
npx -y rea-agents@6.5.0 analyze-javascript-application "<absolute path>" --json > projects/<id>/artifacts/app-evidence.json
```

Large Evidence: project a summary view instead of reading the whole file
(`jq` is not required):

```bash
node -e "const fs=require('fs');fs.writeFileSync(process.argv[2],JSON.stringify({source:{kind:'inline',evidence:JSON.parse(fs.readFileSync(process.argv[1],'utf8'))},view:{kind:'summary'}}))" projects/<id>/artifacts/app-evidence.json projects/<id>/artifacts/app-view.json
npx -y rea-agents@6.5.0 inspect-analysis-view projects/<id>/artifacts/app-view.json --json
```

For a module page use
`view: {kind: "page", collection: "modules", offset: 0, limit: 32}`
(see `rea-core/docs/cli.md`). Exit status: `0` completed (may be partial),
`1` failed, `130`/`143` cancelled.

## Evidence management

| Kind | Location | In Git? |
| --- | --- | --- |
| Evidence register (IDs, provenance, hashes) | `evidence/register.md` | yes |
| Small redacted excerpts | `evidence/E-###-*.txt` | yes |
| Unredacted raw output kept for provenance | `evidence/raw/` | no |
| Full REA Evidence JSON, extracted apps, bundles, captures, screenshots | `artifacts/` | no |

- Hash files: `node scripts/check.mjs hash <file>`.
- Cite REA's `evidence_id` values in the register so results can be traced.
- Before writing anything into `evidence/`, `findings/` or `reports/`, redact
  credentials and unrelated personal data (`[REDACTED:<kind>]`).
- Review with `/rea-evidence-review <project-id>`.

## Workspace checks

```bash
node scripts/check.mjs            # health: Node, Git, rea-core, files, MCP registration
node scripts/check.mjs projects   # inventory: id, status, updated, git, title
node scripts/check.mjs sensitive  # sensitive file names, secret-like content, tracked secrets
node scripts/check.mjs all
```

All checks are read-only and mask anything that looks like a secret.
Exit 0 = clean, 1 = problems, 2 = usage error. `sensitive` is pattern-based —
a clean result is not a guarantee.

## Update REA

See [rea-maintenance.md](rea-maintenance.md). Short version: `git -C rea-core
pull --ff-only` for the source; re-register the MCP server with a new pinned
version for the tools.

## Close and archive a project

`/rea-project-closeout <project-id>` writes `reports/final-report.md` from the
template, checks evidence references and sets `status: completed`. Archiving
(moving to `archive/`) happens only on explicit request. See
[project-lifecycle.md](project-lifecycle.md).
