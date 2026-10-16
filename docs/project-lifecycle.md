# Project lifecycle

```
proposed → initialized → investigating → review → completed → archived
                              ↑______________|
```

`review → investigating` is normal when new questions appear. Small projects
may go straight from `investigating` to `completed`; skip ceremony that adds
nothing.

| Stage | Entry criteria | Work | Exit criteria / deliverables |
| --- | --- | --- | --- |
| proposed | An idea; no directory yet (track it wherever you track ideas) | Clarify objective and target | Name, objective, target type known |
| initialized | `new-project.mjs` created the directory | Fill `scope/target.md`, `scope/authorization.md`, questions | Authorization basis recorded; plan has questions |
| investigating | Plan has at least one question | REA analysis, evidence register, findings | Every question answered / partial / unresolved |
| review | Findings drafted | `/rea-evidence-review`; user reads findings | Labels justified; no secrets; gaps explicit |
| completed | Review passed | `/rea-project-closeout` | `reports/final-report.md`; README "Current state" updated |
| archived | User asked to archive | Move to `archive/<id>/`; decide artifact retention | `status: archived` |

Update `status` and `updated` in `project.yaml` at every transition and add a
line to `notes/log.md`.

## Naming

`YYYYMMDD-short-descriptive-name`, e.g. `20261016-auth-flow-study`,
`20261016-electron-app-analysis`, `20261016-legacy-binary-review`.
No account names, customer names, hostnames or secrets in names.

## Metadata schema (`project.yaml`, schema_version 1)

| Key | Type | Notes |
| --- | --- | --- |
| `schema_version` | int | `1` |
| `id` | string | Equals the directory name |
| `title`, `objective` | string | Single line, no secrets |
| `status` | enum | Lifecycle stage above |
| `created`, `updated` | date | `YYYY-MM-DD` |
| `owner` | string | Role or team, not a login |
| `target.type` | enum | `javascript-electron`, `native-binary`, `dotnet`, `android-apk`, `website`, `network-capture`, `firmware`, `other` |
| `target.location` | string | Path or URL without credentials/tokens |
| `authorization.basis` | enum | `owned`, `employer-owned`, `written-permission`, `open-source-license`, `ctf`, `other` |
| `authorization.confirmed` | bool | `true` only after the user confirms; required for runtime interaction |
| `authorization.record` | path | `scope/authorization.md` |
| `rea.version` | string | REA release used |
| `rea.providers` | list | e.g. `[ghidra-12.1.2]` |
| `git` | bool | Project has its own repository |
| `tags` | list | Free-form |

`scripts/check.mjs` reads only top-level scalar keys (`id`, `title`,
`status`, `updated`, …); keep them on one line.

## Project contents

| Path | Purpose |
| --- | --- |
| `README.md` | Brief: objective, questions, deliverables, current state |
| `CLAUDE.md` | Project context for Claude Code |
| `project.yaml` | Metadata (above) |
| `scope/target.md`, `scope/authorization.md` | What, where, why permitted, exclusions |
| `plans/investigation-plan.md` | Questions → evidence, routing, stages, log |
| `evidence/register.md`, `evidence/README.md` | Evidence register and storage rules |
| `findings/findings.md` | Findings ledger |
| `reports/` | Deliverables (`final-report.md` at close-out) |
| `notes/log.md` | Dated working log |
| `artifacts/` | Bulky/sensitive output (Git-ignored) |
| `.gitignore` | Applied if the project gets its own repo |
