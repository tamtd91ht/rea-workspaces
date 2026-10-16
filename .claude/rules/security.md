# Security and privacy rules

- Confirm `scope/authorization.md` records an authorization basis before any
  runtime interaction (browser, Electron, process capture, device). If it is
  empty, stop and ask.
- Stay inside the declared scope and exclusions. No destructive or state-changing
  requests unless the scope explicitly authorizes them. Never bypass
  authentication, access controls or licensing.
- Never write passwords, session cookies, bearer/refresh tokens, API keys or
  private keys into project files, reports, prompts or commits. Replace values
  with `[REDACTED:<kind>]`.
- HAR/SAZ/PCAP captures and browser profiles stay in `artifacts/` (Git-ignored).
- Remote debugging endpoints (CDP, Node Inspector) bind to `127.0.0.1` only.
- Avoid capturing unrelated personal data; if captured, do not quote it.
- Reviewer agents and build/test skills (`java-reviewer`, `go-reviewer`,
  `springboot-verification`, ...) run commands only on the user's own or
  reconstructed code, never on target artifacts or recovered target code.
- Run the `report-sanitizer` agent before any deliverable leaves the workspace.
- The guard hook (`.claude/hooks/guard.mjs`) blocks secret-like content and
  cross-project writes; never try to bypass it — redact, or ask the user.
- Remember: REA analyzes locally, but tool results sent to the model provider
  leave the machine. Do not feed sensitive data to the agent unnecessarily.
- Detail: `docs/security-and-privacy.md`.
