---
name: rea-session-save
description: Save the current investigation session of a workspace project to projects/<id>/notes/sessions/ so a later Claude Code session can resume with full context. Use at the end of a work session, before context runs low, or before handing a project to someone else.
argument-hint: "<project-id>"
---

# Save an investigation session

Adapted from ECC's `/save-session` (MIT, see `.claude/THIRD_PARTY_NOTICES.md`),
but stored inside the project instead of `~/.claude/session-data/`.

## 1. Select the project

Project from `$ARGUMENTS` or the conversation; if unclear, run
`node scripts/check.mjs projects` and ask. Write only inside that project.

## 2. Gather facts (do not invent)

- What was done this session: REA tools/commands run, inputs, results.
- New or changed `E-###` / `F-###` entries (re-read `evidence/register.md`
  and `findings/findings.md`; do not restate them, reference IDs).
- What failed or was a dead end, with the exact error code/message
  (e.g. `capability_unavailable`), and bounded searches that found nothing.
- REA state worth reusing: retained Evidence IDs (`parent_evidence_id`),
  saved artifact paths, open native sessions (close them with `close_binary`
  unless the user wants them kept), browser/debug sessions still running.
- Decisions made (also add them to `plans/decisions.md`).

## 3. Write the file

Path: `projects/<id>/notes/sessions/YYYY-MM-DD-HHMM.md` (local time; never
overwrite — add `-2` if it exists). Sections:

```markdown
# Session YYYY-MM-DD HH:MM — <project-id>

**Topic:** <one line>
**Status after session:** <project.yaml status>

## Questions
| ID | Status (open/partial/answered/unresolved) | Change this session |

## Established this session
- F-### / E-### — <one line each>

## Dead ends and failures
- <approach> — <exact reason / error>

## Not tried yet
- 

## REA and environment state
- Retained Evidence IDs / artifact paths:
- Open sessions or running browsers/processes:
- Providers / versions used:

## Decisions
- D-### — <summary> (see plans/decisions.md)

## Blockers and questions for the user
- 

## Exact next step
<one concrete action, e.g. the next REA call with its input>
```

No secrets, cookies, tokens or personal data — reference evidence IDs instead
of copying captured values.

## 4. Finish

- Append a one-line entry to `notes/log.md` pointing to the session file.
- Update `updated:` in `project.yaml`.
- Show the user the file path and the "Exact next step".
