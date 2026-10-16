# {{TITLE}}

| Field | Value |
| --- | --- |
| Project ID | `{{PROJECT_ID}}` |
| Status | initialized (source of truth: `project.yaml`) |
| Created | {{CREATED}} |
| Target type | {{TARGET_TYPE}} |
| REA version | rea-agents@{{REA_VERSION}} |

## Objective

{{OBJECTIVE}}

## Investigation questions

<!-- Concrete, answerable questions. Each should name the evidence that would answer it. -->

1. Q1 —
2. Q2 —

## Scope

- Target and location: see [scope/target.md](scope/target.md)
- Authorization basis: see [scope/authorization.md](scope/authorization.md)

## Deliverables

- [ ] Findings ledger — [findings/findings.md](findings/findings.md)
- [ ] Final report — `reports/final-report.md` (created at close-out)
- [ ] Other: 

## Layout

| Path | Contents | In project Git? |
| --- | --- | --- |
| `project.yaml` | Metadata and lifecycle status | yes |
| `scope/` | Target description, authorization, exclusions | yes |
| `plans/` | Investigation plan and stage notes | yes |
| `evidence/` | Evidence register and small redacted excerpts | yes (`evidence/raw/` ignored) |
| `findings/` | Findings ledger | yes |
| `reports/` | Deliverables | yes |
| `notes/` | Working log | yes |
| `artifacts/` | Large/reproducible tool output, extracted targets, captures | **no** |

## Current state

<!-- Update at the end of each working session: where things stand and the next step. -->

- Next step: complete `scope/target.md` and `scope/authorization.md`, then
  fill in `plans/investigation-plan.md`.
