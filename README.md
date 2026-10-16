# REA Workspace

A long-term local workspace for independent, authorized reverse-engineering
projects using [REA](https://github.com/morluto/rea) (Reverse Engineer
Anything) with Claude Code.

- One upstream clone of REA (`rea-core/`), kept pristine.
- One directory per project (`projects/YYYYMMDD-name/`) with scope,
  authorization, plan, evidence register, findings and reports.
- Claude Code rules and skills that enforce evidence and security standards.
- Small, dependency-free scripts to create projects and check the workspace.

## Architecture

```
rea-workspaces/
├── CLAUDE.md              Instructions Claude Code loads every session
├── .claude/               settings.json, rules/, skills/ (workspace-scoped)
├── rea-core/              Official morluto/rea clone (own Git history, not tracked here)
├── projects/              One directory per project (not tracked here)
├── templates/             project/ skeleton + document templates
├── docs/                  Guides (start with getting-started.md)
├── scripts/               new-project.mjs, check.mjs
├── archive/               Closed projects
├── WORKSPACE_STATUS.md    Current environment and REA status
└── CHANGELOG.md           Changes to the workspace itself
```

Details: [docs/architecture.md](docs/architecture.md).

## Quick start

Requirements: Node.js 22.19+ / 24.11+ / 26+, npm, Git, Claude Code.

```bash
node scripts/check.mjs                     # environment, rea-core, MCP registration
node scripts/new-project.mjs --help        # create a project
node scripts/check.mjs projects            # list projects and status
```

Start Claude Code **from this directory**, then:

```text
/rea-project-init electron-app-analysis Understand how the app syncs notes
/rea-investigation 20261016-electron-app-analysis
```

First-time setup on a new machine: [docs/getting-started.md](docs/getting-started.md).

## Documentation

| Guide | Use it for |
| --- | --- |
| [getting-started](docs/getting-started.md) | Prerequisites, REA registration, first test |
| [operating-guide](docs/operating-guide.md) | Daily workflow, projects, investigations, evidence |
| [project-lifecycle](docs/project-lifecycle.md) | Stages, entry/exit criteria, metadata schema |
| [security-and-privacy](docs/security-and-privacy.md) | Authorization, credentials, captures, AI provider data |
| [rea-maintenance](docs/rea-maintenance.md) | Updating the clone, the package, the MCP registration |
| [claude-code-guide](docs/claude-code-guide.md) | What the `.claude/` configuration does |
| [troubleshooting](docs/troubleshooting.md) | Common failures and fixes |

## Responsible use

Analyze only software and systems you own or are authorized to examine. See
[docs/security-and-privacy.md](docs/security-and-privacy.md) and REA's
[DISCLAIMER](https://github.com/morluto/rea/blob/main/DISCLAIMER.md).
