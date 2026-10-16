---
name: rea-evidence-review
description: Review a workspace project's findings for evidence quality — check every finding cites registered evidence, confidence labels (Verified/Inferred/Unknown) are justified, unknowns are explicit, and no secrets or unrelated personal data are stored. Use before review/close-out or when the user asks to audit findings.
argument-hint: "<project-id>"
---

# Review evidence quality

Review only; change files only for clear mechanical fixes (broken IDs,
missing labels) and list every change. Substantive re-labelling is proposed,
not applied.

## Inputs

Project from `$ARGUMENTS` or the conversation (ask if unclear). Read
`findings/findings.md`, `evidence/register.md`, `plans/investigation-plan.md`,
`scope/` and any report in `reports/`.

## Checks

1. **Traceability** — every `F-###` cites at least one `E-###`; every cited
   `E-###` exists in the register with source, location and (for files) SHA-256;
   referenced files exist (`artifacts/` may be absent on another machine — note it).
2. **Labels** — each finding is exactly one of Verified / Inferred / Unknown.
   - Verified needs direct evidence of the claimed thing (e.g. code path read,
     runtime observation), not just a name, string or file layout.
   - Static evidence claimed as runtime behavior → downgrade to Inferred.
   - Bounded searches are stated as bounded, not as absence.
3. **Alternatives** — Inferred findings list plausible alternative explanations.
4. **Coverage** — every plan question is answered / partial / unresolved;
   none is silently dropped.
5. **Scope** — evidence came from in-scope targets and permitted activities.
6. **Sensitive data** — run `node scripts/check.mjs sensitive projects/<id>` and
   read its output; also scan findings/evidence for personal data, internal
   hostnames or account identifiers that are not needed. Never echo a found
   secret in the review — reference file and line only.

## Output

A table: check → pass / issue → location → recommended fix. Then a short
verdict: ready for review / needs work. If ready, suggest setting
`status: review` in `project.yaml` (ask before changing it).
