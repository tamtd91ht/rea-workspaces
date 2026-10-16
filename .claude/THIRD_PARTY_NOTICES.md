# Third-party notices

Some workspace Claude Code components are copied from or adapted from
**ECC — Everything Claude Code** (https://github.com/affaan-m/ECC),
commit `76aaa77df6adc5b889e689007bf99b9a4f74af34` (version 2.2.3), MIT License.

## Copied verbatim

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
| `.claude/agents/java-reviewer.md` | `agents/java-reviewer.md` |
| `.claude/agents/go-reviewer.md` | `agents/go-reviewer.md` |
| `.claude/agents/security-reviewer.md` | `agents/security-reviewer.md` |

## Adapted (ideas and structure, rewritten for this workspace)

| Workspace path | ECC inspiration |
| --- | --- |
| `.claude/hooks/guard.mjs` | `skills/safety-guard`, `skills/gateguard` |
| `.claude/skills/rea-session-save/`, `rea-session-resume/` | `commands/save-session.md`, `commands/resume-session.md` |
| `.claude/agents/report-sanitizer.md` | `agents/opensource-sanitizer.md` |
| `templates/decisions.md` | `skills/architecture-decision-records` |

Updating: re-copy the listed files from a newer ECC commit, review the diff
(`git diff` in this repository) before committing, and update the commit hash
above. Do not install ECC's hooks or installer into this workspace.

## ECC license

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
