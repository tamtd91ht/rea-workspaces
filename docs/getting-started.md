# Getting started

Sets up this workspace on a machine and verifies REA end to end. Commands were
verified on Windows 11 with Node.js 22.22.2, npm 10.9.7, Git 2.44 and
Claude Code 2.1.301 against `rea-agents@6.5.0` (2026-10-16).

## 1. Prerequisites

| Tool | Requirement | Check |
| --- | --- | --- |
| Node.js + npm | 22.x ≥ 22.19, 24.x ≥ 24.11, or 26+ (23/25 unsupported) | `node --version` |
| Git | any recent | `git --version` |
| Claude Code | installed and signed in | `claude --version` |
| Chrome-family browser | only for website investigations | — |
| Ghidra / IDA / JADX + JDK | only for native or Android analysis (bring your own) | `npx -y rea-agents@6.5.0 doctor --provider ghidra --json` |

REA never installs or upgrades Node.js, Java, Ghidra, IDA or JADX.

## 2. Get the workspace and REA source

```bash
git clone https://github.com/tamtd91ht/rea-workspaces.git
cd rea-workspaces
git clone https://github.com/morluto/rea.git rea-core
```

If `rea-core/` already exists, do not re-clone: check it with
`git -C rea-core remote -v` and `git -C rea-core status`.

## 3. Register REA with Claude Code (this workspace only)

REA's MCP server is registered at Claude Code **local scope**, keyed to this
directory, so other projects do not load REA's 207 tools.

Run from the workspace root, **in PowerShell** (Git Bash rewrites `/d` and `/c`
into drive paths and produces a broken registration):

```powershell
claude mcp add --scope local rea -- cmd.exe /d /c npx -y rea-agents@6.5.0 mcp
```

macOS / Linux:

```bash
claude mcp add --scope local rea -- npx -y rea-agents@6.5.0 mcp
```

Keep `CLAUDE_CONFIG_DIR` unset for the whole lifecycle of a local-scope
registration (add, list, update, remove). Source: `rea-core/docs/installation.md`,
section "Limit REA to one project or agent profile".

This route does not install REA's user-level skill; the workspace's
`/rea-investigation` skill reads the official instructions from
`rea-core/.agents/skills/reverse-engineer-anything/` instead.

Alternative (not used here): `npx rea-agents setup` registers REA for **every**
Claude Code project (user scope) and installs the skill in `~/.claude/skills`.

## 4. Verify

```bash
node scripts/check.mjs                         # files, rea-core, registration
npx -y rea-agents@6.5.0 mcp doctor --json      # server starts; 207 tools, 6 prompts
claude mcp list                                # "rea: ... - ✓ Connected"
```

Then start `claude` in the workspace root and ask it to list the `rea` tools
(e.g. "call binary_session with {}"). `check.mjs` cannot test the live session.

## 5. First test workflow (static, no external target)

Create a throwaway project and a tiny synthetic Electron app you own:

```bash
node scripts/new-project.mjs --name rea-smoke-test --objective "Verify REA static JavaScript analysis" --target-type javascript-electron
```

Put these files in `projects/<id>/artifacts/sample-app/`:

- `package.json`: `{ "name": "rea-sample-app", "version": "1.0.0", "main": "main.js" }`
- `main.js`:
  ```js
  const { app, BrowserWindow, ipcMain } = require("electron");
  const path = require("path");
  ipcMain.handle("notes:save", async (_e, text) => ({ saved: text.length }));
  app.whenReady().then(() => {
    const win = new BrowserWindow({ webPreferences: { preload: path.join(__dirname, "preload.js") } });
    win.loadFile("index.html");
  });
  ```
- `preload.js`:
  ```js
  const { contextBridge, ipcRenderer } = require("electron");
  contextBridge.exposeInMainWorld("notes", { save: (t) => ipcRenderer.invoke("notes:save", t) });
  ```

Run (absolute path required):

```bash
npx -y rea-agents@6.5.0 analyze-javascript-application "D:/…/projects/<id>/artifacts/sample-app" --json > "projects/<id>/artifacts/sample-evidence.json"
```

Expected: exit 0, an Evidence record with an `evidence_id`, and the
`notes:save` IPC channel in the result. Or, in Claude Code:
`/rea-investigation <id> How does the renderer save notes?`

Delete the smoke-test project afterwards if you do not need it.

## Next

- Daily use: [operating-guide.md](operating-guide.md)
- Problems: [troubleshooting.md](troubleshooting.md)
