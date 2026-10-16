# Evidence rules

- Confidence labels, used exactly: **Verified** (directly supported by sufficient
  evidence), **Inferred** (reasoned interpretation of evidence), **Unknown**
  (not established by current evidence).
- Register every piece of evidence in the project's `evidence/register.md` with an
  ID (`E-001`), source (tool + command/MCP tool + input), date, location and SHA-256
  when the artifact is a file.
- Findings live in `findings/findings.md` with IDs (`F-001`), each citing `E-` IDs
  and, where available, REA Evidence IDs.
- Record bounded searches as bounded ("not found in modules X–Y"), not as absence.
- Static analysis never proves runtime behavior; say which kind of evidence was used.
- Large or reproducible tool output goes to `artifacts/` (ignored by Git);
  `evidence/` holds small, redacted, reviewable excerpts.
- Never fabricate output, paths, endpoints, addresses or Evidence IDs.
- Detail: `docs/operating-guide.md#evidence-management`.
