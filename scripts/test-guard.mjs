#!/usr/bin/env node
// Regression tests for .claude/hooks/guard.mjs. Run after changing the guard:
//   node scripts/test-guard.mjs
// Creates two throwaway projects (projects/19990101-guard-test-a|b), restores
// any existing active-project marker, and removes only what it created.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ACTIVE_PROJECT_FILE, PROJECTS_DIR, ROOT } from "./lib.mjs";

const GUARD = join(ROOT, ".claude", "hooks", "guard.mjs");
const A = "19990101-guard-test-a";
const B = "19990101-guard-test-b";
const TOKEN = ["Bearer", "abcdefghijklmnopqrstuvwxyz0123456789"].join(" ");

function run(event) {
  const r = spawnSync(process.execPath, [GUARD], { input: typeof event === "string" ? event : JSON.stringify(event), encoding: "utf8" });
  const decision = r.stdout ? JSON.parse(r.stdout).hookSpecificOutput.permissionDecision : "allow";
  return { decision, status: r.status, stderr: r.stderr };
}

const write = (path, content) => ({ tool_name: "Write", cwd: ROOT, tool_input: { file_path: path, content } });
const shell = (tool, command) => ({ tool_name: tool, cwd: ROOT, tool_input: { command } });
const P = (id, ...rest) => join(PROJECTS_DIR, id, ...rest);

const cases = [
  ["secret in findings is denied", () => write(P(A, "findings", "findings.md"), `x ${TOKEN}`), "deny"],
  ["secret via Edit new_string is denied", () => ({ tool_name: "Edit", cwd: ROOT, tool_input: { file_path: P(A, "README.md"), old_string: "a", new_string: TOKEN } }), "deny"],
  ["secret in artifacts/ is allowed", () => write(P(A, "artifacts", "raw.txt"), TOKEN), "allow"],
  ["secret in evidence/raw/ is allowed", () => write(P(A, "evidence", "raw", "x.txt"), TOKEN), "allow"],
  ["env placeholder password is allowed", () => write(P(A, "notes", "cfg.md"), ["pass", "word: ${DB_PASSWORD}"].join("")), "allow"],
  ["hardcoded password is denied", () => write(P(A, "notes", "cfg.md"), ["pass", "word: hunter2secret"].join("")), "deny"],
  ["redacted value is allowed", () => write(P(A, "evidence", "E-001.txt"), "Cookie: [REDACTED:cookie]"), "allow"],
  ["relative path is resolved", () => write(`projects/${A}/notes/log.md`, TOKEN), "deny"],
  ["path outside workspace is ignored", () => write(join(ROOT, "..", "elsewhere.txt"), TOKEN), "allow"],
  ["write into other project while active is denied", () => write(P(B, "notes", "log.md"), "hi"), "deny", A],
  ["write into active project is allowed", () => write(P(A, "notes", "log.md"), "hi"), "allow", A],
  ["write to workspace docs while active is allowed", () => write(join(ROOT, "docs", "x.md"), "hi"), "allow", A],
  ["other project without active marker is allowed", () => write(P(B, "notes", "log.md"), "hi"), "allow"],
  ["rm -rf projects asks", () => shell("Bash", `rm -rf projects/${B}`), "ask"],
  ["Remove-Item -Recurse archive asks", () => shell("PowerShell", "Remove-Item -Recurse -Force archive\\old"), "ask"],
  ["git reset --hard asks", () => shell("Bash", "git -C rea-core reset --hard origin/main"), "ask"],
  ["git clean -fd asks", () => shell("Bash", "git clean -fd"), "ask"],
  ["git push --force asks", () => shell("Bash", "git push --force origin main"), "ask"],
  ["rm -rf of a temp dir is allowed", () => shell("Bash", "rm -rf /tmp/foo"), "allow"],
  ["git status is allowed", () => shell("Bash", "git status"), "allow"],
  ["invalid input fails open", () => "not json", "allow"],
];

const savedMarker = existsSync(ACTIVE_PROJECT_FILE) ? readFileSync(ACTIVE_PROJECT_FILE, "utf8") : null;
for (const id of [A, B]) {
  if (existsSync(P(id))) {
    console.error(`refusing to run: ${P(id)} already exists`);
    process.exit(2);
  }
}
let failed = 0;
try {
  for (const id of [A, B]) {
    mkdirSync(P(id), { recursive: true });
    writeFileSync(P(id, "project.yaml"), `id: ${id}\n`);
  }
  for (const [name, make, expected, active] of cases) {
    if (active) writeFileSync(ACTIVE_PROJECT_FILE, `${active}\n`);
    else rmSync(ACTIVE_PROJECT_FILE, { force: true });
    const { decision, status } = run(make());
    const pass = decision === expected && status === 0;
    if (!pass) failed++;
    console.log(`${pass ? "ok  " : "FAIL"}  ${name} (expected ${expected}, got ${decision}, exit ${status})`);
  }
} finally {
  for (const id of [A, B]) rmSync(P(id), { recursive: true, force: true });
  if (savedMarker === null) rmSync(ACTIVE_PROJECT_FILE, { force: true });
  else writeFileSync(ACTIVE_PROJECT_FILE, savedMarker);
}
console.log(failed ? `\n${failed} failing case(s).` : `\nAll ${cases.length} cases passed.`);
process.exitCode = failed ? 1 : 0;
