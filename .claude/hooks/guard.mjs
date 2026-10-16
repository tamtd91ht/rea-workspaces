#!/usr/bin/env node
// PreToolUse guard for this workspace (registered in .claude/settings.json).
// Turns three workspace rules into enforced checks:
//   1. deny  writing secret-like content outside artifacts/ and evidence/raw/
//   2. deny  writing into another project while an active project is set
//            (.claude/active-project, managed by scripts/active-project.mjs)
//   3. ask   before destructive shell commands (recursive deletes of workspace
//            data, git reset --hard / clean -f / push --force)
// Ideas adapted from ECC safety-guard / gateguard (MIT); see
// .claude/THIRD_PARTY_NOTICES.md. Documentation: docs/claude-code-guide.md#guard-hook
//
// Fails open: any internal error lets the tool call proceed and prints a
// warning to stderr, so a guard bug never blocks a session.
import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import { ACTIVE_PROJECT_FILE, ROOT, findSecret } from "../../scripts/lib.mjs";

const WRITE_TOOLS = new Set(["Write", "Edit", "MultiEdit", "NotebookEdit"]);
const SHELL_TOOLS = new Set(["Bash", "PowerShell"]);
// Directories where raw, unredacted material is allowed (both Git-ignored).
const RAW_DIRS = /(^|\/)(artifacts|evidence\/raw)(\/|$)/;

const DESTRUCTIVE = [
  [/\brm\s+(-[a-zA-Z]*[rR][a-zA-Z]*|--recursive)\b[^|;&]*\b(projects|archive|rea-core|templates|\.claude|docs|scripts)\b/, "recursive delete of workspace data"],
  [/\bRemove-Item\b[^|;&]*-Recurse\b[^|;&]*\b(projects|archive|rea-core|templates|\.claude|docs|scripts)\b/i, "recursive delete of workspace data"],
  [/\bRemove-Item\b[^|;&]*\b(projects|archive|rea-core|templates|\.claude|docs|scripts)\b[^|;&]*-Recurse\b/i, "recursive delete of workspace data"],
  [/\bgit\b[^|;&]*\breset\s+--hard\b/, "git reset --hard discards work"],
  [/\bgit\b[^|;&]*\bclean\s+-[a-zA-Z]*f/, "git clean -f deletes untracked files"],
  [/\bgit\b[^|;&]*\bpush\b[^|;&]*(--force\b|--force-with-lease\b|\s-f\b)/, "force push rewrites remote history"],
  [/\bgit\b[^|;&]*\bcheckout\s+(--\s+)?\.(\s|$)/, "git checkout . discards changes"],
];

function decide(decision, reason) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: decision, permissionDecisionReason: reason } }));
  process.exit(0);
}

function relToRoot(filePath, cwd) {
  const abs = isAbsolute(filePath) ? filePath : resolve(cwd || ROOT, filePath);
  const rel = relative(ROOT, abs).replace(/\\/g, "/");
  return rel.startsWith("../") || rel === ".." || isAbsolute(rel) ? null : rel; // null = outside workspace
}

function newContent(tool, input) {
  if (tool === "Write") return input.content ?? "";
  if (tool === "Edit") return input.new_string ?? "";
  if (tool === "MultiEdit") return (input.edits ?? []).map((e) => e.new_string ?? "").join("\n");
  if (tool === "NotebookEdit") return input.new_source ?? "";
  return "";
}

function activeProject() {
  try {
    const id = readFileSync(ACTIVE_PROJECT_FILE, "utf8").trim();
    return /^\d{8}-[a-z0-9-]+$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

function main(raw) {
  const event = JSON.parse(raw);
  const tool = event.tool_name;
  const input = event.tool_input ?? {};

  if (WRITE_TOOLS.has(tool)) {
    const target = input.file_path ?? input.notebook_path;
    if (!target) return;
    const rel = relToRoot(target, event.cwd);
    if (rel === null) return; // outside the workspace: not this guard's business

    const active = activeProject();
    const m = /^(projects|archive)\/([^/]+)\//.exec(rel);
    if (active && m && m[2] !== active && existsSync(resolve(ROOT, m[1], m[2], "project.yaml"))) {
      decide("deny", `Workspace guard: the active project is ${active}, but this writes into ${m[1]}/${m[2]}/. Projects must not mix artifacts. If the user really switched projects, run: node scripts/active-project.mjs set ${m[2]}`);
    }

    if (!RAW_DIRS.test(rel)) {
      const hit = findSecret(newContent(tool, input));
      if (hit) {
        decide("deny", `Workspace guard: the new content of ${rel} contains a possible ${hit.label} (line ${hit.line} of the inserted text). Redact it as [REDACTED:<kind>] or store the raw material under artifacts/ or evidence/raw/ (Git-ignored). See docs/security-and-privacy.md.`);
      }
    }
    return;
  }

  if (SHELL_TOOLS.has(tool)) {
    const command = String(input.command ?? "");
    for (const [re, why] of DESTRUCTIVE) {
      if (re.test(command)) decide("ask", `Workspace guard: ${why}. Confirm this is intended and the target was inspected first.`);
    }
  }
}

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  try {
    main(raw);
  } catch (e) {
    process.stderr.write(`workspace guard skipped (internal error: ${e.message})\n`);
  }
  process.exit(0);
});
