# Security and privacy

## Authorization

- Only analyze software, systems and data you own or are authorized to examine
  (REA [DISCLAIMER](https://github.com/morluto/rea/blob/main/DISCLAIMER.md)).
- Record the basis in `scope/authorization.md` and `project.yaml` before any
  analysis; set `authorization.confirmed: true` only after explicit confirmation.
- Runtime interaction (browser, Electron, process capture, device) additionally
  requires the activity to be ticked as permitted in `scope/authorization.md`.
- Commercial tools (IDA, Hopper, JEB) must be properly licensed; never bypass
  licensing, authentication or access controls.

## Credentials

- Never store passwords, session cookies, bearer/refresh tokens, API keys or
  private keys in project files, reports, prompts, screenshots or commits.
- Name test accounts by role ("test user A"); keep their secrets in a password
  manager.
- Redact as `[REDACTED:cookie]`, `[REDACTED:token]`, etc. REA itself redacts
  transport credentials and explicitly marked values but does not infer secrecy
  from names — review its output before copying excerpts.
- Claude Code is denied reading `.env`, `*.pem`, `*.key`, `*.p12`, `*.pfx` and
  SSH keys in this workspace (`.claude/settings.json`).

## Website investigations

- Use dedicated test accounts and a separate browser profile:
  ```powershell
  & "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="$env:TEMP\rea-browser-profile" http://127.0.0.1:3000
  ```
  REA does not launch or stop this browser; close it when done. Never expose
  the debugging port beyond loopback (`127.0.0.1`). Source:
  `rea-core/docs/browser-observation.md`.
- Prefer passive observation. Declared scenarios must avoid destructive or
  state-changing requests unless authorized.
- Avoid capturing unrelated personal data; do not quote it if captured.

## Evidence retention

- `artifacts/` and `evidence/raw/` hold bulky or unredacted material and are
  Git-ignored. Captures (`*.har`, `*.saz`, `*.pcap`, `*.pcapng`, `*.qlog`) are
  ignored everywhere.
- At close-out decide with the owner whether artifacts are kept, moved to
  approved storage, or deleted.

## Git hygiene

- The workspace repo has a GitHub remote: it must never contain project data.
  Its `.gitignore` excludes `projects/*`, `archive/*`, `rea-core/`, secrets and captures.
- A project repo must not get a remote until you have decided where its data may live.
- `.gitignore` does not protect files that are already tracked. If a secret was
  committed: `git rm --cached <file>`, commit, **rotate the secret**, and treat
  history as exposed (rewriting history is a separate, approved operation).
- Run `node scripts/check.mjs sensitive` before committing or pushing.

## AI provider considerations

REA analyzes targets locally, but every tool result, file excerpt and prompt
that Claude Code processes is sent to the model provider (Anthropic) under its
data policy and your account's settings. "Local analysis" does not mean the
results stay local. For sensitive targets:

- Keep bulky raw output in `artifacts/` and send summaries/views to the agent.
- Do not paste secrets or personal data into the conversation.
- Check your organization's policy on sending proprietary code or data to AI
  providers before starting the project.
