---
name: rea-project-init
description: Create a new REA reverse-engineering project in this workspace from the approved template (validated name, metadata, scope and authorization records). Use when the user wants to start a new investigation, analysis or project.
argument-hint: "<short-name> [objective]"
---

# Initialize a REA project

Creates `projects/YYYYMMDD-<short-name>/` with `scripts/new-project.mjs`.
Never copy `templates/project/` by hand.

## 1. Collect the inputs

From `$ARGUMENTS` and the conversation, determine:

| Input | Rule |
| --- | --- |
| Short name | 3–48 chars, lowercase letters/digits/hyphens, no date, no account/customer names or secrets. Suggest one if the user gave only a description. |
| Objective | One sentence. |
| Target type | `javascript-electron`, `native-binary`, `dotnet`, `android-apk`, `website`, `network-capture`, `firmware`, `other`. |
| Target location | Local path or URL without credentials. |
| Authorization basis | owned / employer-owned / written-permission / open-source-license / ctf / other. |
| Project Git repo? | Ask; default no. Useful for long-running projects with reports worth versioning. |

Ask concise questions for anything missing. **Never invent target details or
the authorization basis.** Do not ask for or record credentials.

## 2. Preview, then create

```bash
node scripts/new-project.mjs --name <short-name> --objective "<objective>" --target-type <type> --dry-run
```

Show the preview. If it is fine, run the same command without `--dry-run`
(add `--git` only if the user agreed). The script refuses existing destinations;
if it does, pick another name — never delete or overwrite the existing project.

## 3. Record scope and authorization

In the new project:

1. `scope/target.md` — name, type, version, location, in/out of scope as the
   user stated. Leave unknown fields blank rather than guessing.
2. `scope/authorization.md` — basis, granted-by role, reference to the record.
3. `project.yaml` — set `target.location`, `authorization.basis`; set
   `authorization.confirmed: true` only when the user explicitly confirmed it.
4. `README.md` — the user's investigation questions, if given.

If the target is a file the user supplied, record its SHA-256
(`node scripts/check.mjs hash <file>`) in `scope/target.md`.

## 4. Report

Make the new project active (`node scripts/active-project.mjs set <id>`), then
print the project path, what is still incomplete (e.g. authorization not
confirmed), and the next step: `/rea-investigation <project-id>`.
