# REA Workspace

A long-term local workspace for independent projects that combine three
open-source tools, orchestrated by Claude Code:

| Layer | Tool | Role |
| --- | --- | --- |
| A — Investigation | [REA](https://github.com/morluto/rea) | Authorized reverse engineering and evidence (MCP + CLI) |
| B — Engineering | [ECC](https://github.com/affaan-m/ECC) (selected components) | Planning, TDD, build fixes, code/security review, verification |
| C — Design | [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Design systems, styles, palettes, typography, UX guidance |
| D — Orchestration | Claude Code + this workspace | Projects, templates, tool selection, evidence, validation |

The tools do not integrate on their own; this workspace defines how they work
together. Documentation is in Vietnamese under [docs/](docs/).

## Architecture

```
rea-workspaces/
├── CLAUDE.md                  Instructions Claude Code loads every session
├── .claude/                   settings, rules, skills (workspace + ECC + UI UX Pro Max), agents, guard hook
├── rea-core/                  morluto/rea clone (reference, not tracked)
├── ecc-reference/             affaan-m/ECC clone (reference, not tracked)
├── ui-ux-pro-max-reference/   ui-ux-pro-max-skill clone (reference, not tracked)
├── projects/                  One directory per project (not tracked)
├── templates/                 Project skeleton + document templates
├── docs/                      Guides
├── scripts/                   new-project, check, active-project, test-guard
└── archive/                   Closed projects
```

Details: [docs/architecture.md](docs/architecture.md).

## Quick start

Requirements: Node.js 22.19+/24.11+/26+, npm, Git, Python 3, Claude Code.
First-time setup (REA registration, reference clones): [docs/getting-started.md](docs/getting-started.md).

```bash
node scripts/check.mjs                      # environment, repos, MCP, UI UX Pro Max
node scripts/new-project.mjs --help         # create a project
node scripts/check.mjs projects             # list projects
```

## First project

Start Claude Code **from this directory**, then:

```text
/rea-project-init notes-sync-feature Rebuild a notes-sync feature for our app
/rea-investigation <id>      # REA: how does the reference app do it? (authorized target)
/rea-ui-design <id>          # UI UX Pro Max: design system, reviewed and accepted
/rea-engineering <id>        # ECC: plan, TDD, review, verify
/rea-project-closeout <id>
```

Use only the stages a project needs (`--type investigation | ui-design | engineering | combined`).
Workflow: [docs/combined-workflows.md](docs/combined-workflows.md).

## Documentation

| Guide | Use it for |
| --- | --- |
| [getting-started](docs/getting-started.md) | Prerequisites, setup, verification, first workflows |
| [operating-guide](docs/operating-guide.md) | Daily workflow, projects, evidence, CLI |
| [combined-workflows](docs/combined-workflows.md) | Investigation → design → implementation; tool selection |
| [rea-guide](docs/rea-guide.md) | REA capabilities, readiness, updates |
| [ecc-guide](docs/ecc-guide.md) | ECC components and installation strategy |
| [ui-ux-pro-max-guide](docs/ui-ux-pro-max-guide.md) | Design workflow and commands |
| [project-lifecycle](docs/project-lifecycle.md) | Types, stages, metadata schema |
| [security-and-privacy](docs/security-and-privacy.md) | Authorization, credentials, hooks, data flows |
| [maintenance](docs/maintenance.md) | Independent updates, backup, rollback |
| [claude-code-guide](docs/claude-code-guide.md) | `.claude/` configuration and guard hook |
| [troubleshooting](docs/troubleshooting.md) | Common failures |

## Responsible use

Analyze only software and systems you own or are authorized to examine. See
[docs/security-and-privacy.md](docs/security-and-privacy.md) and REA's
[DISCLAIMER](https://github.com/morluto/rea/blob/main/DISCLAIMER.md).
Third-party components: [.claude/THIRD_PARTY_NOTICES.md](.claude/THIRD_PARTY_NOTICES.md).
