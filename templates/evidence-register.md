# Evidence register — {{PROJECT_ID}}

One row per piece of evidence. Files larger than a few hundred KB, raw
captures and reproducible tool output stay in `artifacts/` or `evidence/raw/`
(both Git-ignored); reference them by path and SHA-256.

Compute SHA-256: `node scripts/check.mjs hash <file>` (from the workspace root),
`certutil -hashfile <file> SHA256` (Windows) or `shasum -a 256 <file>`.

| ID | Date | Description | Source (tool, command / MCP tool, input) | Location | SHA-256 | REA Evidence ID | Redacted? |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Provenance notes

- Target identity (path, version, SHA-256): 
- REA version: rea-agents@{{REA_VERSION}}
- Providers used and versions: 
