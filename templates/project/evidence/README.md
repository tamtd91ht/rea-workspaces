# Evidence

- `register.md` — the evidence register (IDs `E-001`, ...). Every item cited by a
  finding must be listed there.
- Small, redacted, human-reviewable excerpts may be stored next to it
  (e.g. `E-003-ipc-handler.txt`). Name files after their evidence ID.
- `raw/` — unredacted or bulky tool output that must be kept for provenance.
  Ignored by Git. Create it only when needed.
- Bulky reproducible output (full REA Evidence JSON, extracted apps) belongs in
  `../artifacts/`.

Before saving anything here: remove cookies, tokens, passwords, keys and
unrelated personal data, replacing values with `[REDACTED:<kind>]`.
