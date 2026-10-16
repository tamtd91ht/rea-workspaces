---
name: rea-investigation
description: Run or continue an evidence-backed REA investigation inside a workspace project — turn the question into checkable sub-questions, route the target to the right REA workflow, run the smallest useful analysis, record evidence and findings. Use when the user asks to analyze, reverse engineer, trace or explain a target in a project.
argument-hint: "<project-id> [question]"
---

# Run a REA investigation

## 0. Select the project

- Project = first word of `$ARGUMENTS`, or the project named in the conversation.
  If none: run `node scripts/check.mjs projects` and ask. If no project exists,
  offer `/rea-project-init` first.
- Read `projects/<id>/project.yaml`, `CLAUDE.md`, `scope/target.md`,
  `scope/authorization.md`, `plans/investigation-plan.md`, `findings/findings.md`
  and the latest `notes/log.md` entries. Reuse prior evidence; do not repeat
  identical analysis.
- Stop and ask if the authorization basis is empty. For any runtime interaction
  (browser, Electron, process, device) also require `authorization.confirmed: true`
  and that the planned action is listed as permitted.

## 1. Plan

1. Rewrite the user's request as numbered questions in
   `plans/investigation-plan.md`, each with the evidence that would answer it.
2. Route the target. Read the official REA routing guidance — the
   "Route the target first" section of
   `rea-core/.agents/skills/reverse-engineer-anything/SKILL.md` — and only the
   relevant reference under that skill's `references/`. Common first steps:

   | Target | First REA step |
   | --- | --- |
   | ASAR / extracted JS or Electron app | `analyze_javascript_application` (use `"detail": "summary"` for large apps) |
   | .NET assembly | `inspect_managed_artifact` |
   | Android APK | `inspect_android_package` (needs JADX + JDK) |
   | Native binary | `open_binary` (needs Ghidra / IDA / Hopper — check readiness) |
   | Website (user-owned page open) | `list_browser_targets`; actions via `capture_browser_scenario` |
   | HAR / SAZ capture | `inspect_web_network_capture` |
   | Go / Rust binary metadata | `inspect_go_binary` / `inspect_rust_binary` |

   The connected server's live tool list and schemas win over this table and
   over `rea-core` main documentation (registered release: rea-agents@6.5.0).
   If a tool is not advertised, call `binary_session` with `{}` and read
   `result.tool_availability`.
3. Record the chosen route, required providers, readiness and limitations in
   the plan's "Target routing" table. Provider readiness:
   `npx -y rea-agents@6.5.0 doctor --provider ghidra --json` (read-only).

## 2. Investigate

- Run the smallest useful analysis first; expand only when a concrete question
  remains. Batch related calls around one hypothesis.
- If the REA MCP tools are absent in this session, use the CLI fallback
  (`npx -y rea-agents@6.5.0 <command> --json`, verified with `--help`) and see
  `docs/troubleshooting.md`. Do not run setup without approval.
- Save large outputs to `projects/<id>/artifacts/` (e.g.
  `... --json > projects/<id>/artifacts/app-evidence.json`) and inspect views
  of them instead of loading everything into context.
- Runtime observation only when static evidence cannot answer, scope permits
  it, and the user has approved the specific action. Debug ports on 127.0.0.1.

## 3. Record as you go

- `evidence/register.md`: one `E-###` row per evidence item — tool, MCP tool or
  command, input, location, SHA-256 for files, REA Evidence ID.
- `findings/findings.md`: one `F-###` block per significant finding with
  description, evidence refs, method, **Verified / Inferred / Unknown**,
  alternative explanations, verification status, search bounds.
- `notes/log.md`: dated summary of what was done and what is next.
- Redact tokens, cookies, passwords and personal data before writing anything.
- Update `project.yaml`: `status: investigating`, `updated: <today>`.

## 4. Report back

Answer each question with its confidence label and F-/E- references. List
what remains unknown and the next concrete step. Never present inferred
behavior as observed, or static results as runtime proof. Close native
sessions with `close_binary` when done.
