#!/usr/bin/env node
// Create a new project from templates/. See docs/operating-guide.md#create-a-project.
//
// Usage:
//   node scripts/new-project.mjs --name <short-name> --objective "<text>"
//        [--title "<text>"] [--target-type <type>] [--date YYYYMMDD]
//        [--git] [--dry-run]
//
// Safe by default: refuses existing destinations, builds the project in a
// temporary sibling directory and renames it into place only when complete.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { PROJECTS_DIR, REA_VERSION, ROOT, TARGET_TYPES, TEMPLATES_DIR, UsageError, parseArgs, today } from "./lib.mjs";

const HELP = `Create a REA workspace project.

Options:
  --name <short-name>     Required. Lowercase letters, digits and hyphens (3-48 chars).
  --objective "<text>"    Required. One-sentence objective (no secrets).
  --title "<text>"        Optional. Human title (default: derived from name).
  --target-type <type>    Optional. One of: ${TARGET_TYPES.join(", ")} (default: other).
  --date YYYYMMDD         Optional. Date prefix (default: today).
  --git                   Initialize a Git repository in the project (no remote, no commit).
  --dry-run               Print what would be created; write nothing.
  --help                  Show this help.

Example:
  node scripts/new-project.mjs --name electron-app-analysis \\
    --objective "Understand how the app syncs notes" --target-type javascript-electron`;

// Document templates copied into the project, keyed by destination.
const DOCUMENT_TEMPLATES = {
  "README.md": "project-brief.md",
  "plans/investigation-plan.md": "investigation-plan.md",
  "findings/findings.md": "findings.md",
  "evidence/register.md": "evidence-register.md",
};
// Template files renamed on copy (dotfiles inside templates/ would affect the workspace repo).
const RENAMES = { "gitignore.template": ".gitignore" };

function fail(message, code = 1) {
  console.error(`error: ${message}`);
  process.exit(code);
}

function validate(opts) {
  if (!opts.name) throw new UsageError("--name is required.");
  if (!opts.objective || !opts.objective.trim()) throw new UsageError("--objective is required.");
  const name = opts.name;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length < 3 || name.length > 48) {
    throw new UsageError(`Invalid --name "${name}": use 3-48 lowercase letters, digits and single hyphens (e.g. auth-flow-study).`);
  }
  if (/^\d{8}-/.test(name)) throw new UsageError("Do not include the date in --name; it is added automatically (use --date to override).");
  const date = opts.date ?? today().compact;
  if (!/^\d{8}$/.test(date) || Number.isNaN(Date.parse(`${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`))) {
    throw new UsageError(`Invalid --date "${date}": expected YYYYMMDD.`);
  }
  const targetType = opts["target-type"] ?? "other";
  if (!TARGET_TYPES.includes(targetType)) throw new UsageError(`Invalid --target-type "${targetType}". Allowed: ${TARGET_TYPES.join(", ")}.`);
  if (/[\r\n]/.test(opts.objective) || (opts.title && /[\r\n]/.test(opts.title))) {
    throw new UsageError("--objective and --title must be single-line.");
  }
  return { name, date, targetType };
}

function titleFromName(name) {
  return name.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

const yamlEscape = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

function render(text, values, isYaml) {
  return text.replace(/\{\{([A-Z_]+)\}\}/g, (match, key) => {
    if (!(key in values)) return match; // left in place; detected below
    return isYaml ? yamlEscape(values[key]) : values[key];
  });
}

function listFiles(dir, base = dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? listFiles(full, base) : [relative(base, full).replace(/\\/g, "/")];
  });
}

function main() {
  let opts, validated;
  try {
    opts = parseArgs(process.argv.slice(2), ["git", "dry-run", "help"]);
    if (opts.help) {
      console.log(HELP);
      return;
    }
    validated = validate(opts);
  } catch (e) {
    if (e instanceof UsageError) fail(`${e.message}\n\n${HELP}`, 2);
    throw e;
  }
  const { name, date, targetType } = validated;

  const id = `${date}-${name}`;
  const dest = join(PROJECTS_DIR, id);
  const iso = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`;
  const values = {
    PROJECT_ID: id,
    TITLE: opts.title?.trim() || titleFromName(name),
    OBJECTIVE: opts.objective.trim(),
    CREATED: iso,
    TARGET_TYPE: targetType,
    REA_VERSION,
    GIT: opts.git ? "true" : "false",
  };

  const skeletonDir = join(TEMPLATES_DIR, "project");
  if (!existsSync(skeletonDir)) fail(`Template directory not found: ${relative(ROOT, skeletonDir)}`);
  if (existsSync(dest)) fail(`Destination already exists: ${relative(ROOT, dest).replace(/\\/g, "/")} — choose another name or date. Nothing was changed.`);
  // Same short name on another date is allowed but worth flagging.
  const sameName = existsSync(PROJECTS_DIR) ? readdirSync(PROJECTS_DIR).filter((d) => d.endsWith(`-${name}`) && /^\d{8}-/.test(d)) : [];

  // Plan: [relative destination, rendered content]
  const plan = [];
  for (const rel of listFiles(skeletonDir)) {
    const target = rel.split("/").map((p) => RENAMES[p] ?? p).join("/");
    plan.push([target, render(readFileSync(join(skeletonDir, rel), "utf8"), values, rel.endsWith(".yaml"))]);
  }
  for (const [target, src] of Object.entries(DOCUMENT_TEMPLATES)) {
    const srcPath = join(TEMPLATES_DIR, src);
    if (!existsSync(srcPath)) fail(`Template not found: templates/${src}`);
    plan.push([target, render(readFileSync(srcPath, "utf8"), values, false)]);
  }
  const leftovers = plan.filter(([, content]) => /\{\{[A-Z_]+\}\}/.test(content)).map(([t]) => t);
  if (leftovers.length) fail(`Unresolved template placeholders in: ${leftovers.join(", ")}. Fix the templates; nothing was written.`);

  console.log(`Project: ${id}`);
  console.log(`Destination: ${relative(ROOT, dest).replace(/\\/g, "/")}/`);
  for (const [t] of plan.sort((a, b) => a[0].localeCompare(b[0]))) console.log(`  + ${t}`);
  if (sameName.length) console.log(`note: existing project(s) with the same short name: ${sameName.join(", ")}`);
  if (opts["dry-run"]) {
    console.log("\nDry run: nothing was written.");
    return;
  }

  const staging = join(PROJECTS_DIR, `.staging-${id}-${process.pid}`);
  mkdirSync(PROJECTS_DIR, { recursive: true });
  try {
    for (const [target, content] of plan) {
      const full = join(staging, target);
      mkdirSync(join(full, ".."), { recursive: true });
      writeFileSync(full, content, { flag: "wx" });
    }
    renameSync(staging, dest);
  } catch (e) {
    // Remove only the staging directory this run created.
    if (existsSync(staging)) rmSync(staging, { recursive: true, force: true });
    fail(`Could not create project: ${e.message}. Nothing was left behind.`);
  }

  if (opts.git) {
    try {
      execFileSync("git", ["init", "-b", "main"], { cwd: dest, stdio: "pipe" });
      console.log("Initialized an empty Git repository (no remote, no commit).");
      console.log("Keep starting Claude Code from the workspace root: sessions started inside this repo do not see REA or the workspace skills.");
    } catch (e) {
      console.error(`warning: project created, but git init failed: ${e.message.split("\n")[0]}`);
    }
  }

  const relDest = relative(ROOT, dest).replace(/\\/g, "/");
  console.log(`
Created ${relDest}/

Next steps:
  1. Fill in ${relDest}/scope/target.md and scope/authorization.md
     (set authorization.basis / confirmed in project.yaml).
  2. Write the questions in ${relDest}/README.md and plans/investigation-plan.md.
  3. In Claude Code (started from the workspace root): /rea-investigation ${id}`);
}

main();
