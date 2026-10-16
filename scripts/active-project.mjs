#!/usr/bin/env node
// Set, show or clear the active project used by the workspace guard hook
// (.claude/hooks/guard.mjs). While a project is active, Claude Code may not
// write into any other project. See docs/claude-code-guide.md#guard-hook.
//
// Usage:
//   node scripts/active-project.mjs show
//   node scripts/active-project.mjs set <project-id>
//   node scripts/active-project.mjs clear
//
// The marker file .claude/active-project is local and Git-ignored.
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ACTIVE_PROJECT_FILE, PROJECTS_DIR } from "./lib.mjs";

const [cmd = "show", id] = process.argv.slice(2);
const current = () => (existsSync(ACTIVE_PROJECT_FILE) ? readFileSync(ACTIVE_PROJECT_FILE, "utf8").trim() : null);

switch (cmd) {
  case "show":
    console.log(current() ?? "(no active project)");
    break;
  case "set":
    if (!id || !/^\d{8}-[a-z0-9-]+$/.test(id)) {
      console.error("usage: node scripts/active-project.mjs set <YYYYMMDD-name>");
      process.exit(2);
    }
    if (!existsSync(join(PROJECTS_DIR, id, "project.yaml"))) {
      console.error(`error: projects/${id}/project.yaml not found; list projects with: node scripts/check.mjs projects`);
      process.exit(1);
    }
    writeFileSync(ACTIVE_PROJECT_FILE, `${id}\n`);
    console.log(`active project: ${id}`);
    break;
  case "clear":
    if (existsSync(ACTIVE_PROJECT_FILE)) rmSync(ACTIVE_PROJECT_FILE);
    console.log("active project cleared");
    break;
  default:
    console.error(`unknown command "${cmd}"; use show | set <id> | clear`);
    process.exit(2);
}
