#!/usr/bin/env node
// Read-only workspace checks. See docs/operating-guide.md#workspace-checks.
//
// Usage:
//   node scripts/check.mjs [health]        Environment, rea-core and MCP registration
//   node scripts/check.mjs projects        Project inventory and status
//   node scripts/check.mjs sensitive [dir] Sensitive file names / secret-like content
//   node scripts/check.mjs hash <file>     SHA-256 of a file (for the evidence register)
//   node scripts/check.mjs all             health + projects + sensitive
//
// Exit status: 0 = no problems, 1 = problems found, 2 = usage error.
// Never modifies files, never prints secret values (matches are masked).
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join, relative, resolve } from "node:path";
import { ARCHIVE_DIR, ECC_COMMIT, ECC_REF_DIR, LIFECYCLE, PROJECTS_DIR, REA_CORE_DIR, REA_ORIGIN, REA_VERSION, ROOT, SECRET_PATTERNS, UIUX_REF_DIR, UIUX_VERSION, readProjectYaml } from "./lib.mjs";

let problems = 0;
const ok = (msg) => console.log(`  ok    ${msg}`);
const warn = (msg) => console.log(`  warn  ${msg}`);
const bad = (msg) => {
  problems++;
  console.log(`  FAIL  ${msg}`);
};
const rel = (p) => relative(ROOT, p).replace(/\\/g, "/") || ".";

function git(args, cwd) {
  try {
    return execFileSync("git", args, { cwd, stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- health
function health() {
  console.log("Environment");
  const [major, minor] = process.versions.node.split(".").map(Number);
  const nodeOk = (major === 22 && minor >= 19) || (major === 24 && minor >= 11) || major >= 26;
  nodeOk ? ok(`Node.js ${process.versions.node} (REA requires ^22.19 || ^24.11 || >=26)`) : bad(`Node.js ${process.versions.node} is outside REA's supported range ^22.19 || ^24.11 || >=26`);
  const gitVersion = git(["--version"], ROOT);
  gitVersion ? ok(gitVersion) : bad("git not found on PATH");

  console.log("\nrea-core (upstream clone)");
  if (!existsSync(join(REA_CORE_DIR, ".git"))) {
    bad(`rea-core/ is missing or not a Git clone — see docs/rea-guide.md`);
  } else {
    const origin = git(["remote", "get-url", "origin"], REA_CORE_DIR);
    origin === REA_ORIGIN ? ok(`origin ${origin}`) : bad(`origin is "${origin}", expected ${REA_ORIGIN}`);
    const branch = git(["rev-parse", "--abbrev-ref", "HEAD"], REA_CORE_DIR);
    const head = git(["describe", "--tags", "--always"], REA_CORE_DIR);
    ok(`branch ${branch} @ ${head}`);
    const status = git(["status", "--porcelain"], REA_CORE_DIR);
    status === "" ? ok("working tree clean (unmodified)") : warn(`working tree has local changes:\n${status.split("\n").map((l) => `          ${l}`).join("\n")}`);
    const counts = git(["rev-list", "--left-right", "--count", "HEAD...@{upstream}"], REA_CORE_DIR);
    if (counts) {
      const [ahead, behind] = counts.split(/\s+/).map(Number);
      if (ahead) warn(`${ahead} local commit(s) not in upstream`);
      behind ? warn(`${behind} commit(s) behind last fetched upstream (git -C rea-core pull --ff-only)`) : ok("up to date with last fetched upstream");
    }
  }

  console.log("\nReference checkouts (not installations)");
  for (const [dir, url, pin] of [
    [ECC_REF_DIR, "https://github.com/affaan-m/ECC.git", ECC_COMMIT],
    [UIUX_REF_DIR, "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git", null],
  ]) {
    const name = rel(dir);
    if (!existsSync(join(dir, ".git"))) {
      warn(`${name}/ not present (optional; clone with: git clone ${url} ${name})`);
      continue;
    }
    const origin = git(["remote", "get-url", "origin"], dir);
    origin === url ? ok(`${name} origin ${origin}`) : bad(`${name} origin is "${origin}", expected ${url}`);
    const head = git(["rev-parse", "HEAD"], dir);
    if (pin) head === pin ? ok(`${name} at pinned commit ${pin.slice(0, 7)}`) : warn(`${name} at ${head?.slice(0, 7)}; workspace components were copied from ${pin.slice(0, 7)}`);
    const st = git(["status", "--porcelain"], dir);
    st === "" ? ok(`${name} unmodified`) : warn(`${name} has local changes`);
  }

  console.log("\nUI UX Pro Max (project-scope install)");
  const searchPy = join(ROOT, ".claude/skills/ui-ux-pro-max/scripts/search.py");
  if (!existsSync(searchPy)) {
    bad(`not installed; run from the workspace root: npx -y ui-ux-pro-max-cli@${UIUX_VERSION} init --ai claude`);
  } else {
    let py = null;
    for (const cmd of ["python3", "python"]) {
      try {
        execFileSync(cmd, ["--version"], { stdio: "pipe" });
        py = cmd;
        break;
      } catch {}
    }
    if (!py) bad("Python 3 not found on PATH (required by search.py)");
    else {
      try {
        const out = execFileSync(py, [searchPy, "dashboard", "--domain", "ux", "-n", "1"], { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8", timeout: 60000 });
        out.trim() ? ok(`search.py runs (${py}, offline query)`) : bad("search.py returned no output");
      } catch (e) {
        bad(`search.py failed: ${String(e.message).split("\n")[0]}`);
      }
    }
    if (existsSync(join(homedir(), ".claude/skills/ui-ux-pro-max"))) warn("a global copy also exists in ~/.claude/skills/ui-ux-pro-max (duplicate install)");
  }

  console.log("\nWorkspace files");
  for (const p of ["CLAUDE.md", ".claude/settings.json", "templates/project/project.yaml", "scripts/new-project.mjs", "docs/operating-guide.md"]) {
    existsSync(join(ROOT, p)) ? ok(p) : bad(`${p} is missing`);
  }
  const skills = ["rea-project-init", "rea-investigation", "rea-ui-design", "rea-engineering", "rea-session-save", "rea-session-resume", "rea-evidence-review", "rea-project-closeout"];
  const missingSkills = skills.filter((s) => !existsSync(join(ROOT, ".claude/skills", s, "SKILL.md")));
  missingSkills.length ? bad(`workspace skills missing: ${missingSkills.join(", ")}`) : ok(`${skills.length} workspace skills`);
  const agents = ["report-sanitizer", "planner", "architect", "code-reviewer", "code-explorer", "tdd-guide", "java-reviewer", "go-reviewer", "security-reviewer", "java-build-resolver", "go-build-resolver"];
  const missingAgents = agents.filter((a) => !existsSync(join(ROOT, ".claude/agents", `${a}.md`)));
  missingAgents.length ? bad(`agents missing: ${missingAgents.join(", ")}`) : ok(`${agents.length} agents`);
  existsSync(join(ROOT, ".claude/hooks/guard.mjs")) ? ok("guard hook (test: node scripts/test-guard.mjs)") : bad(".claude/hooks/guard.mjs is missing");
  try {
    JSON.parse(readFileSync(join(ROOT, ".claude/settings.json"), "utf8"));
    ok(".claude/settings.json is valid JSON");
  } catch (e) {
    bad(`.claude/settings.json is not valid JSON: ${e.message}`);
  }

  console.log("\nClaude Code MCP registration (read-only; no values printed)");
  const cfgDir = process.env.CLAUDE_CONFIG_DIR;
  const cfgPath = cfgDir ? join(cfgDir, ".claude.json") : join(homedir(), ".claude.json");
  if (cfgDir) warn(`CLAUDE_CONFIG_DIR is set; reading ${cfgPath}`);
  let cfg = null;
  try {
    cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
  } catch {
    warn(`could not read ${cfgPath}`);
  }
  if (cfg) {
    const norm = (p) => resolve(p).replace(/\\/g, "/").toLowerCase();
    const entry = Object.entries(cfg.projects ?? {}).find(([p]) => norm(p) === norm(ROOT));
    const local = entry?.[1]?.mcpServers?.rea;
    if (local) {
      const cmd = [local.command, ...(local.args ?? [])].join(" ");
      ok(`local-scope "rea" registered for this workspace: ${cmd}`);
      cmd.includes(`rea-agents@${REA_VERSION}`) ? ok(`pinned to rea-agents@${REA_VERSION}`) : warn(`registration is not pinned to rea-agents@${REA_VERSION} (see docs/rea-guide.md)`);
    } else {
      bad("no local-scope \"rea\" MCP server for this workspace — see docs/getting-started.md#register-rea-with-claude-code");
    }
    if (cfg.mcpServers?.rea) warn("a user-scope \"rea\" registration also exists (available in every project)");
  }
  console.log("  info  live connection is not tested here; run: npx -y rea-agents@" + REA_VERSION + " mcp doctor --json");
}

// -------------------------------------------------------------- projects
function projects() {
  console.log("Projects");
  const rows = [];
  for (const [base, location] of [[PROJECTS_DIR, "projects"], [ARCHIVE_DIR, "archive"]]) {
    if (!existsSync(base)) continue;
    for (const dir of readdirSync(base).sort()) {
      const full = join(base, dir);
      if (!statSync(full).isDirectory() || dir.startsWith(".")) continue;
      const yamlPath = join(full, "project.yaml");
      if (!existsSync(yamlPath)) {
        if (location === "projects") bad(`projects/${dir} has no project.yaml`);
        continue;
      }
      const meta = readProjectYaml(yamlPath);
      if (!LIFECYCLE.includes(meta.status)) bad(`${location}/${dir}: unknown status "${meta.status}"`);
      if (meta.id && meta.id !== dir) warn(`${location}/${dir}: project.yaml id "${meta.id}" differs from directory name`);
      if (location === "archive" && meta.status !== "archived") warn(`${location}/${dir}: in archive/ but status is "${meta.status}"`);
      rows.push([location === "archive" ? `archive/${dir}` : dir, meta.type ?? "investigation", meta.status ?? "?", meta.updated ?? "?", existsSync(join(full, ".git")) ? "git" : "-", meta.title ?? ""]);
    }
  }
  const stray = existsSync(PROJECTS_DIR) ? readdirSync(PROJECTS_DIR).filter((d) => d.startsWith(".staging-")) : [];
  for (const s of stray) warn(`leftover staging directory projects/${s} (from an interrupted new-project run; inspect, then remove manually)`);
  if (!rows.length) {
    console.log("  (no projects yet — create one with: node scripts/new-project.mjs --help)");
    return;
  }
  const header = ["PROJECT", "TYPE", "STATUS", "UPDATED", "VCS", "TITLE"];
  const widths = header.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  for (const r of [header, ...rows]) console.log("  " + r.map((c, i) => c.padEnd(widths[i])).join("  "));
}

// ------------------------------------------------------------- sensitive
const SENSITIVE_NAMES = [/^\.env(\..*)?$/, /\.(pem|key|p12|pfx|kdbx|token)$/i, /^id_(rsa|ed25519)/, /credentials.*\.json$/i, /\.(har|saz|pcap|pcapng|qlog|dmp)$/i];
// Upstream reference checkouts are other projects' sources, not workspace data.
const SKIP_DIRS = new Set([".git", "node_modules", "rea-core", "ecc-reference", "ui-ux-pro-max-reference", "artifacts", "raw"]);
const MAX_SCAN_BYTES = 2 * 1024 * 1024;

function walk(dir, visit) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(full, visit);
    } else if (entry.isFile()) visit(full, entry.name);
  }
}

function mask(s) {
  return s.length <= 8 ? "****" : `${s.slice(0, 4)}…(${s.length} chars)`;
}

function loadAllowlist() {
  const file = join(ROOT, "scripts", "sensitive-allowlist.txt");
  if (!existsSync(file)) return new Set();
  return new Set(
    readFileSync(file, "utf8")
      .split(/\r?\n/)
      .filter((l) => l.trim() && !l.startsWith("#"))
      .map((l) => l.split("|").map((s) => s.trim()))
      .filter(([p]) => !/^(projects|archive)\//.test(p))
      .map(([p, label]) => `${p}|${label}`),
  );
}

function sensitive(target) {
  const base = target ? resolve(target) : ROOT;
  const allow = loadAllowlist();
  let allowed = 0;
  console.log(`Sensitive files and secret-like content under ${rel(base)}/ (skips rea-core, artifacts/, evidence/raw/, .git)`);
  let findings = 0;
  walk(base, (full, name) => {
    if (SENSITIVE_NAMES.some((re) => re.test(name))) {
      findings++;
      warn(`sensitive file name: ${rel(full)} (keep it in artifacts/ or evidence/raw/, never commit)`);
    }
    const size = statSync(full).size;
    if (size > MAX_SCAN_BYTES) return;
    const buf = readFileSync(full);
    if (buf.includes(0)) return; // binary
    buf.toString("utf8").split(/\r?\n/).forEach((line, i) => {
      for (const [label, re] of SECRET_PATTERNS) {
        const m = re.exec(line);
        if (m && allow.has(`${rel(full)}|${label}`)) {
          allowed++;
        } else if (m) {
          findings++;
          bad(`${rel(full)}:${i + 1}: possible ${label}: ${mask(m[0])}`);
        }
      }
    });
  });
  // Files already tracked by Git are not protected by .gitignore.
  for (const repo of [ROOT, ...listProjectRepos()]) {
    const tracked = git(["ls-files"], repo);
    if (!tracked) continue;
    for (const f of tracked.split("\n")) {
      const name = f.split("/").pop();
      if (SENSITIVE_NAMES.some((re) => re.test(name))) {
        findings++;
        bad(`tracked by Git in ${rel(repo)}: ${f} (remove with git rm --cached; rotate any exposed secret)`);
      }
    }
  }
  if (allowed) console.log(`  info  ${allowed} match(es) skipped by scripts/sensitive-allowlist.txt`);
  if (!findings) ok("nothing suspicious found (pattern-based; not a guarantee)");
}

function listProjectRepos() {
  if (!existsSync(PROJECTS_DIR)) return [];
  return readdirSync(PROJECTS_DIR).map((d) => join(PROJECTS_DIR, d)).filter((p) => existsSync(join(p, ".git")));
}

// ------------------------------------------------------------------ hash
function hash(file) {
  if (!file || !existsSync(file) || !statSync(file).isFile()) {
    console.error("usage: node scripts/check.mjs hash <file>");
    process.exit(2);
  }
  const h = createHash("sha256");
  createReadStream(file)
    .on("data", (d) => h.update(d))
    .on("end", () => console.log(`${h.digest("hex")}  ${file}`))
    .on("error", (e) => {
      console.error(`error: ${e.message}`);
      process.exit(1);
    });
}

// ------------------------------------------------------------------ main
const [cmd = "health", arg] = process.argv.slice(2);
switch (cmd) {
  case "health":
    health();
    break;
  case "projects":
    projects();
    break;
  case "sensitive":
    sensitive(arg);
    break;
  case "hash":
    hash(arg);
    break;
  case "all":
    health();
    console.log();
    projects();
    console.log();
    sensitive();
    break;
  case "--help":
  case "help":
    console.log(readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 12).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
    break;
  default:
    console.error(`unknown command "${cmd}"; try: node scripts/check.mjs help`);
    process.exit(2);
}
if (["health", "projects", "sensitive", "all"].includes(cmd)) {
  console.log(problems ? `\n${problems} problem(s) found.` : "\nNo problems found.");
  process.exitCode = problems ? 1 : 0;
}
