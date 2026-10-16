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

export const LIFECYCLE = ["proposed", "initialized", "investigating", "review", "completed", "archived"];
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
