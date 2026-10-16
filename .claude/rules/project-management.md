# Project management rules

- Project directories are named `YYYYMMDD-short-name` (lowercase letters, digits,
  hyphens). No account names, customer names, hostnames or secrets in names.
- Create projects only with `node scripts/new-project.mjs` (or `/rea-project-init`).
  Never copy `templates/project/` by hand and never edit templates to fit one project.
- `project.yaml` is the project's metadata record. Update `status` and `updated`
  whenever the lifecycle stage changes:
  `proposed → initialized → investigating → review → completed → archived`
  (`review → investigating` is allowed when new questions arise).
- Work in one project at a time. Cross-project references use the project ID,
  never copied evidence.
- Do not `git init` a project, add remotes, or push without the user's confirmation.
- Archiving (moving a project to `archive/`) requires explicit user approval.
- Detail: `docs/project-lifecycle.md`.
