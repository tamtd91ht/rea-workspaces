# Third-party notices

Workspace Claude Code components that come from other projects. Each upstream
keeps its own license; reference checkouts (`ecc-reference/`,
`ui-ux-pro-max-reference/`) are not tracked by this repository.

## 1. ECC — Everything Claude Code

https://github.com/affaan-m/ECC, commit `76aaa77df6adc5b889e689007bf99b9a4f74af34`
(v2.2.3), MIT License. **Installation method: selective verbatim copy.** ECC's
own selective installer was evaluated (`npx ecc-universal@2.2.3 install
--target claude-project --skills ... --dry-run`) and rejected: requesting two
skills planned 114 file operations across ~40 skills, including hook scripts.
ECC's README states that manual component-by-component copying is supported.
ECC hooks, commands, rules, installer and plugin are **not** installed.

### Copied verbatim

| Workspace path | ECC source |
| --- | --- |
| `.claude/skills/api-design/` | `skills/api-design/` |
| `.claude/skills/springboot-patterns/` | `skills/springboot-patterns/` |
| `.claude/skills/springboot-security/` | `skills/springboot-security/` |
| `.claude/skills/springboot-tdd/` | `skills/springboot-tdd/` |
| `.claude/skills/springboot-verification/` | `skills/springboot-verification/` |
| `.claude/skills/jpa-patterns/` | `skills/jpa-patterns/` |
| `.claude/skills/java-coding-standards/` | `skills/java-coding-standards/` |
| `.claude/skills/golang-patterns/` | `skills/golang-patterns/` |
| `.claude/skills/golang-testing/` | `skills/golang-testing/` |
| `.claude/skills/tdd-workflow/` | `skills/tdd-workflow/` |
| `.claude/skills/verification-loop/` | `skills/verification-loop/` |
| `.claude/skills/codebase-onboarding/` | `skills/codebase-onboarding/` |
| `.claude/skills/e2e-testing/` | `skills/e2e-testing/` |
| `.claude/skills/browser-qa/` | `skills/browser-qa/` |
| `.claude/agents/java-reviewer.md` | `agents/java-reviewer.md` |
| `.claude/agents/go-reviewer.md` | `agents/go-reviewer.md` |
| `.claude/agents/security-reviewer.md` | `agents/security-reviewer.md` |
| `.claude/agents/planner.md` | `agents/planner.md` |
| `.claude/agents/architect.md` | `agents/architect.md` |
| `.claude/agents/code-reviewer.md` | `agents/code-reviewer.md` |
| `.claude/agents/tdd-guide.md` | `agents/tdd-guide.md` |
| `.claude/agents/java-build-resolver.md` | `agents/java-build-resolver.md` |
| `.claude/agents/go-build-resolver.md` | `agents/go-build-resolver.md` |
| `.claude/agents/code-explorer.md` | `agents/code-explorer.md` |

Known upstream references that do not resolve here: `tdd-workflow` mentions
`node scripts/setup-package-manager.js` (an ECC script, not copied).

### Adapted (ideas and structure, rewritten for this workspace)

| Workspace path | ECC inspiration |
| --- | --- |
| `.claude/hooks/guard.mjs` | `skills/safety-guard`, `skills/gateguard` |
| `.claude/skills/rea-session-save/`, `rea-session-resume/` | `commands/save-session.md`, `commands/resume-session.md` |
| `.claude/agents/report-sanitizer.md` | `agents/opensource-sanitizer.md` |
| `templates/decisions.md` | `skills/architecture-decision-records` |

Updating: in `ecc-reference/`, `git pull --ff-only`; diff each listed file
against the workspace copy; re-copy, review `git diff` here, update the commit
hash in this file, `scripts/lib.mjs` (`ECC_COMMIT`) and `CHANGELOG.md`.

### ECC license

```
MIT License

Copyright (c) 2026 Affaan Mustafa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 2. UI UX Pro Max

https://github.com/nextlevelbuilder/ui-ux-pro-max-skill, MIT License
(Copyright (c) 2024 Next Level Builder). **Installation method: official CLI,
project scope**, from the workspace root:

```bash
npx -y ui-ux-pro-max-cli@2.15.0 init --ai claude
```

It installed 7 skills (172 files) into `.claude/skills/`: `ui-ux-pro-max`,
`design-system`, `design`, `ui-styling`, `brand`, `banner-design`, `slides`.
They are committed as installed (not modified). `ui-styling` carries its own
Apache-2.0 license in `.claude/skills/ui-styling/LICENSE.txt`. Not installed:
the Claude marketplace plugin and any global (`--global`) copy.

### UI UX Pro Max license

```
MIT License

Copyright (c) 2024 Next Level Builder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
