---
name: rea-project-closeout
description: Close out a workspace REA project — write the final report from the template, verify evidence references, document unresolved questions, and prepare it for continued work or archival. Use when the user says a project is done, wants a final report, or wants to archive a project.
argument-hint: "<project-id> [archive]"
disable-model-invocation: true
---

# Close out a project

## 1. Preconditions

- Project from `$ARGUMENTS` (ask if missing). Read `project.yaml`, `README.md`,
  plan, findings and evidence register.
- Run the `/rea-evidence-review` checks first. Unresolved issues are listed in
  the report's limitations, not hidden.

## 2. Final report

1. If `reports/final-report.md` does not exist, create it from
   `templates/final-report.md`, replacing `{{PROJECT_ID}}`, `{{CREATED}}`
   (today, YYYY-MM-DD) and `{{REA_VERSION}}` (from `project.yaml` `rea.version`).
   If it exists, update it; do not overwrite user edits.
2. Fill the sections that apply to the project type: findings (F-/E- IDs with
   confidence labels), accepted design decisions (`design/design-system.md`),
   implementation summary and verification results copied from
   `tests/test-plan.md` exactly as recorded ("not run" stays "not run").
   Copy no secrets or raw captures into the report.
3. Unresolved questions and next steps are explicit.
4. Confirm no `{{...}}` placeholders remain.

5. If the report (or any excerpt) will be shared outside the workspace, run
   the `report-sanitizer` agent on the project and resolve every FAIL item.

## 3. Lessons learned

Ask the user whether to record reusable lessons. If yes, append a dated
section to `docs/playbooks/<target.type>.md` (create it from
`docs/playbooks/README.md`'s format if missing). Record only what transfers
to other projects: routes that worked, provider settings, dead ends,
REA limitations met, useful views/queries. **Never** include target names
that are confidential, secrets, evidence values or personal data — the
workspace repository is pushed to GitHub.

## 4. Status

- Update `project.yaml`: `status: completed` (or `review` if the user still
  needs to review), `updated: <today>`. Update the project README "Current state".
- If the project has its own Git repo, offer to commit (show `git status` first;
  ensure `artifacts/` and captures are not staged). Never push without approval.
- If this project is the active one, clear it: `node scripts/active-project.mjs clear`.

## 5. Archive (only on explicit request)

1. Confirm with the user, naming the exact source and destination.
2. Check `archive/<project-id>` does not already exist.
3. Set `status: archived` in `project.yaml`, then move
   `projects/<project-id>` → `archive/<project-id>` (`git mv` is not used; the
   workspace repo does not track projects).
4. Decide with the user whether `artifacts/` is kept, moved to external storage,
   or deleted — never delete without explicit approval.
5. Run `node scripts/check.mjs projects` to confirm.
