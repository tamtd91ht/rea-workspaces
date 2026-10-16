#!/usr/bin/env node
// Create a new project from templates/. See docs/operating-guide.md#create-a-project.
//
// Usage:
//   node scripts/new-project.mjs --name <short-name> --objective "<text>"
//        [--type investigation|ui-design|engineering|combined]
//        [--title "<text>"] [--target-type <type>] [--date YYYYMMDD]
//        [--git] [--dry-run]
//
// Safe by default: refuses existing destinations, builds the project in a
// temporary sibling directory and renames it into place only when complete.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { PROJECTS_DIR, PROJECT_TYPES, REA_VERSION, ROOT, TARGET_TYPES, TEMPLATES_DIR, UIUX_VERSION, UsageError, parseArgs, today } from "./lib.mjs";

const HELP = `Create a workspace project.

Options:
  --name <short-name>     Required. Lowercase letters, digits and hyphens (3-48 chars).
  --objective "<text>"    Required. One-sentence objective (no secrets).
  --type <type>           Optional. ${Object.keys(PROJECT_TYPES).join(", ")} (default: investigation).
                            investigation  REA analysis of an authorized target
                            ui-design      UI/UX design with UI UX Pro Max
                            engineering    plan, implement, test, review (ECC workflows)
                            combined       investigation + design + engineering
  --title "<text>"        Optional. Human title (default: derived from name).
  --target-type <type>    Optional, investigation/combined only. One of: ${TARGET_TYPES.join(", ")} (default: other).
  --date YYYYMMDD         Optional. Date prefix (default: today).
  --git                   Initialize a Git repository in the project (no remote, no commit).
  --dry-run               Print what would be created; write nothing.
  --help                  Show this help.

Examples:
  node scripts/new-project.mjs --name electron-app-analysis \\
    --objective "Understand how the app syncs notes" --target-type javascript-electron
  node scripts/new-project.mjs --name notes-sync-feature --type combined \\
    --objective "Rebuild a notes sync feature for our own app" --target-type javascript-electron`;

// Document templates per module: destination -> template file.
const MODULE_DOCUMENTS = {
  common: { "README.md": "project-brief.md", "plans/decisions.md": "decisions.md" },
  investigation: {
    "plans/investigation-plan.md": "investigation-plan.md",
    "findings/findings.md": "findings.md",
    "evidence/register.md": "evidence-register.md",
  },
  design: { "design/design-brief.md": "design-brief.md", "design/design-system.md": "design-system.md" },
  engineering: { "plans/implementation-plan.md": "implementation-plan.md", "tests/test-plan.md": "test-plan.md" },
};
// Skeleton files (templates/project/) that belong to one module only.
const MODULE_SKELETON = { investigation: ["scope/", "evidence/"] };
// Template files renamed on copy (dotfiles inside templates/ would affect the workspace repo).
const RENAMES = { "gitignore.template": ".gitignore" };

// Rows for the README layout table, per module.
// Rendered into the project README (Vietnamese, like the templates).
const LAYOUT_ROWS = {
  common: [
    ["`project.yaml`", "Metadata, loại dự án, trạng thái vòng đời", "có"],
    ["`plans/decisions.md`", "Sổ quyết định (`D-###`)", "có"],
    ["`notes/`", "Nhật ký, phiên đã lưu (`notes/sessions/`)", "có"],
    ["`reports/`", "Sản phẩm bàn giao (`final-report.md` khi đóng dự án)", "có"],
    ["`artifacts/`", "Output lớn/tái tạo được, capture, ảnh chụp", "**không**"],
  ],
  investigation: [
    ["`scope/`", "Target, cơ sở được phép, loại trừ", "có"],
    ["`plans/investigation-plan.md`", "Câu hỏi → bằng chứng, định tuyến, các bước", "có"],
    ["`evidence/`", "Sổ đăng ký bằng chứng và trích đoạn nhỏ đã che", "có (`evidence/raw/` bị ignore)"],
    ["`findings/`", "Sổ phát hiện", "có"],
  ],
  design: [["`design/`", "Design brief, design system đã chấp nhận, `design-system/` sinh tự động", "có"]],
  engineering: [
    ["`plans/implementation-plan.md`", "Yêu cầu, các bước, rủi ro, vị trí code", "có"],
    ["`tests/test-plan.md`", "Các kiểm tra và kết quả", "có"],
  ],
};

const WORKFLOWS = {
  investigation: "`/rea-investigation` (REA)",
  design: "`/rea-ui-design` (UI UX Pro Max)",
  engineering: "`/rea-engineering` (ECC agents and skills)",
};

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
  const type = opts.type ?? "investigation";
  if (!(type in PROJECT_TYPES)) throw new UsageError(`Invalid --type "${type}". Allowed: ${Object.keys(PROJECT_TYPES).join(", ")}.`);
  const modules = PROJECT_TYPES[type];
  if (opts["target-type"] && !modules.includes("investigation")) {
    throw new UsageError(`--target-type applies only to project types with an investigation stage (investigation, combined), not "${type}".`);
  }
  const targetType = modules.includes("investigation") ? opts["target-type"] ?? "other" : "none";
  if (targetType !== "none" && !TARGET_TYPES.includes(targetType)) throw new UsageError(`Invalid --target-type "${targetType}". Allowed: ${TARGET_TYPES.join(", ")}.`);
  if (/[\r\n]/.test(opts.objective) || (opts.title && /[\r\n]/.test(opts.title))) {
    throw new UsageError("--objective and --title must be single-line.");
  }
  return { name, date, type, modules, targetType };
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
  const { name, date, type, modules, targetType } = validated;
  const active = ["common", ...modules];

  const id = `${date}-${name}`;
  const dest = join(PROJECTS_DIR, id);
  const iso = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`;
  const layout = active.flatMap((m) => LAYOUT_ROWS[m]).map((r) => `| ${r.join(" | ")} |`).join("\n");
  const values = {
    PROJECT_ID: id,
    TITLE: opts.title?.trim() || titleFromName(name),
    OBJECTIVE: opts.objective.trim(),
    CREATED: iso,
    PROJECT_TYPE: type,
    MODULES: modules.join(", "),
    HAS_DESIGN: modules.includes("design") ? "true" : "false",
    TARGET_TYPE: targetType,
    REA_VERSION,
    UIUX_VERSION,
    GIT: opts.git ? "true" : "false",
    LAYOUT_ROWS: layout,
    WORKFLOWS: modules.map((m) => WORKFLOWS[m]).join(" → "),
  };

  const skeletonDir = join(TEMPLATES_DIR, "project");
  if (!existsSync(skeletonDir)) fail(`Template directory not found: ${relative(ROOT, skeletonDir)}`);
  if (existsSync(dest)) fail(`Destination already exists: ${relative(ROOT, dest).replace(/\\/g, "/")} — choose another name or date. Nothing was changed.`);
  // Same short name on another date is allowed but worth flagging.
  const sameName = existsSync(PROJECTS_DIR) ? readdirSync(PROJECTS_DIR).filter((d) => d.endsWith(`-${name}`) && /^\d{8}-/.test(d)) : [];

  // Plan: [relative destination, rendered content]
  const plan = [];
  const excludedPrefixes = Object.entries(MODULE_SKELETON)
    .filter(([m]) => !active.includes(m))
    .flatMap(([, prefixes]) => prefixes);
  for (const rel of listFiles(skeletonDir)) {
    if (excludedPrefixes.some((p) => rel.startsWith(p))) continue;
    const target = rel.split("/").map((p) => RENAMES[p] ?? p).join("/");
    plan.push([target, render(readFileSync(join(skeletonDir, rel), "utf8"), values, rel.endsWith(".yaml"))]);
  }
  for (const m of active) {
    for (const [target, src] of Object.entries(MODULE_DOCUMENTS[m])) {
      const srcPath = join(TEMPLATES_DIR, src);
      if (!existsSync(srcPath)) fail(`Template not found: templates/${src}`);
      plan.push([target, render(readFileSync(srcPath, "utf8"), values, false)]);
    }
  }
  const leftovers = plan.filter(([, content]) => /\{\{[A-Z_]+\}\}/.test(content)).map(([t]) => t);
  if (leftovers.length) fail(`Unresolved template placeholders in: ${leftovers.join(", ")}. Fix the templates; nothing was written.`);

  console.log(`Project: ${id} (type: ${type}; modules: ${modules.join(", ")})`);
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
  const steps = [`Write the objective, questions/requirements and success criteria in ${relDest}/README.md.`];
  if (modules.includes("investigation")) steps.push(`Fill in scope/target.md and scope/authorization.md (set authorization.basis / confirmed in project.yaml).`);
  if (modules.includes("design")) steps.push(`Fill in design/design-brief.md.`);
  steps.push(`In Claude Code (started from the workspace root): ${modules.map((m) => WORKFLOWS[m].split(" ")[0].replace(/`/g, "") + " " + id).join(", then ")}`);
  console.log(`\nCreated ${relDest}/\n\nNext steps:\n${steps.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}`);
}

main();
