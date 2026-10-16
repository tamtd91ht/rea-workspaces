---
name: rea-session-resume
description: Resume a workspace project's investigation from its latest saved session file (projects/<id>/notes/sessions/) — reload state, verify it is still accurate, and continue from the recorded next step. Use when starting a new Claude Code session on an existing project.
argument-hint: "<project-id> [session-file]"
---

# Resume an investigation session

Counterpart of `/rea-session-save` (adapted from ECC's `/resume-session`, MIT).

## 1. Load

1. Project from `$ARGUMENTS`; if missing, run `node scripts/check.mjs projects`
   and ask.
2. Session file: the one named in `$ARGUMENTS`, else the newest file in
   `projects/<id>/notes/sessions/` (by file name). If none exists, fall back to
   `notes/log.md` and `README.md` "Current state" and say so.
3. Read alongside it: `project.yaml`, `scope/authorization.md`,
   `plans/investigation-plan.md`, `plans/decisions.md`, and the findings and
   evidence entries the session references.

## 2. Verify before acting

The session file is a note, not ground truth. Check:

- Referenced artifacts and evidence files still exist.
- Retained REA Evidence IDs are only valid in the MCP session that produced
  them; after a restart, re-derive views from saved files in `artifacts/`
  instead of assuming the IDs still resolve.
- REA tools are available in this session (otherwise see
  `docs/troubleshooting.md`); provider readiness if the next step needs one.
- Authorization still covers the next step (runtime steps need
  `authorization.confirmed: true`).

## 3. Brief the user

In a few lines: project and status, what is established (F- IDs), open
questions, blockers, any state that no longer holds, and the recorded exact
next step. Ask before running it if it involves runtime interaction or the
state check found discrepancies; otherwise continue with `/rea-investigation`.
