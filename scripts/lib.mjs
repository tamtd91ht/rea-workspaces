// Shared helpers for workspace scripts. No dependencies beyond Node.js.
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Workspace root = parent of scripts/. Never depends on the caller's cwd. */
export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const PROJECTS_DIR = join(ROOT, "projects");
export const ARCHIVE_DIR = join(ROOT, "archive");
export const TEMPLATES_DIR = join(ROOT, "templates");
export const REA_CORE_DIR = join(ROOT, "rea-core");

/** REA release pinned by this workspace (MCP registration and CLI examples). */
export const REA_VERSION = "6.5.0";
export const REA_ORIGIN = "https://github.com/morluto/rea.git";

export const ECC_REF_DIR = join(ROOT, "ecc-reference");
export const UIUX_REF_DIR = join(ROOT, "ui-ux-pro-max-reference");
export const ECC_COMMIT = "76aaa77df6adc5b889e689007bf99b9a4f74af34";
export const UIUX_VERSION = "2.15.0";

export const LIFECYCLE = ["proposed", "initialized", "investigating", "design", "implementation", "review", "completed", "archived"];

/**
 * Project types and the modules they include. Modules decide which template
 * files new-project.mjs creates (see MODULE_FILES there).
 */
export const PROJECT_TYPES = {
  investigation: ["investigation"],
  "ui-design": ["design"],
  engineering: ["engineering"],
  combined: ["investigation", "design", "engineering"],
};
export const TARGET_TYPES = [
  "javascript-electron",
  "native-binary",
  "dotnet",
  "android-apk",
  "website",
  "network-capture",
  "firmware",
  "other",
];

/** Secret-like content patterns shared by check.mjs and the guard hook. */
export const SECRET_PATTERNS = [
  ["private key block", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["bearer token", /\bBearer\s+[A-Za-z0-9\-._~+/]{20,}=*/],
  ["authorization header", /\bAuthorization:\s*(?:Basic|Digest|Token|Negotiate)\s+(?!\[REDACTED)[A-Za-z0-9\-._~+/]{8,}/i],
  ["cookie header", /\b(Set-)?Cookie:\s*(?!\[REDACTED)[^\s;=]+=[^\s;]{8,}/i],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{36,}\b/],
  ["Anthropic/OpenAI-style key", /\bsk-(ant-)?[A-Za-z0-9_\-]{24,}/],
  ["JWT", /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ["password assignment", /\b(password|passwd|pwd)\s*[:=]\s*["']?(?!\[REDACTED|\$\{|%\(|["']?\s*$)[^\s"'<>]{4,}/i],
];

/** First secret-like match in text as { label, line } (1-based), or null. Never returns the value. */
export function findSecret(text) {
  const lines = String(text).split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    for (const [label, re] of SECRET_PATTERNS) if (re.test(lines[i])) return { label, line: i + 1 };
  }
  return null;
}

/** Local, Git-ignored marker naming the project currently being worked on. */
export const ACTIVE_PROJECT_FILE = join(ROOT, ".claude", "active-project");

/** Minimal argv parser: --key value, --key=value, --flag. Returns { _: [], ...opts }. */
export function parseArgs(argv, booleanFlags = []) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      out._.push(arg);
      continue;
    }
    const eq = arg.indexOf("=");
    const key = eq === -1 ? arg.slice(2) : arg.slice(2, eq);
    if (booleanFlags.includes(key)) {
      out[key] = eq === -1 ? true : arg.slice(eq + 1) !== "false";
    } else if (eq !== -1) {
      out[key] = arg.slice(eq + 1);
    } else if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) {
      out[key] = argv[++i];
    } else {
      throw new UsageError(`Option --${key} needs a value.`);
    }
  }
  return out;
}

export class UsageError extends Error {}

/**
 * Read top-level scalar keys of a project.yaml (schema_version 1).
 * Deliberately limited: nested maps are skipped; values may be quoted.
 */
export function readProjectYaml(path) {
  const data = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = /^([A-Za-z_][\w-]*):\s*(.*?)\s*$/.exec(line);
    if (!m || m[2] === "") continue;
    let value = m[2];
    if (/^".*"$/.test(value)) value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    else value = value.replace(/\s+#.*$/, "");
    data[m[1]] = value;
  }
  return data;
}

export function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return { compact: `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`, iso: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` };
}
