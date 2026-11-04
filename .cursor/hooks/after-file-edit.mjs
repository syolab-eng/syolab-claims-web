#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function run(command, args) {
  spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    timeout: 90_000,
  });
}

function isTsxUnderSrc(filePath) {
  if (extname(filePath).toLowerCase() !== ".tsx") return false;
  const abs = resolve(root, filePath);
  const rel = relative(resolve(root, "src"), abs);
  return rel !== "" && !rel.startsWith("..") && !rel.split(sep).includes("..");
}

function runMoneyCheck() {
  const script = resolve(root, "scripts/check-claim-amount-display.mjs");
  const result = spawnSync(process.execPath, [script], {
    cwd: root,
    stdio: "inherit",
    timeout: 90_000,
  });
  if (result.status !== 0) {
    if (result.error) console.error(`check:money: ${result.error.message}`);
    process.exit(result.status ?? 1);
  }
}

const raw = await readStdin();
let filePath = "";
try {
  const payload = JSON.parse(raw);
  if (payload && typeof payload.file_path === "string") {
    filePath = payload.file_path;
  }
} catch {
  process.exit(0);
}

if (!filePath || !existsSync(filePath)) {
  process.exit(0);
}

const bin = (name) => resolve(root, "node_modules", ".bin", name);
const hasNodeModules = existsSync(resolve(root, "node_modules"));
if (!hasNodeModules && !isTsxUnderSrc(filePath)) {
  process.exit(0);
}

const extension = extname(filePath).toLowerCase();
const formattable = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".json",
  ".css",
  ".md",
  ".yml",
  ".yaml",
  ".html",
]);

if (hasNodeModules && formattable.has(extension) && existsSync(bin("prettier"))) {
  run(bin("prettier"), ["--write", "--ignore-unknown", filePath]);
}

if (
  hasNodeModules &&
  (extension === ".ts" || extension === ".tsx") &&
  existsSync(bin("eslint"))
) {
  run(bin("eslint"), ["--fix", "--no-error-on-unmatched-pattern", filePath]);
}

if (
  hasNodeModules &&
  (extension === ".ts" || extension === ".tsx") &&
  existsSync(bin("tsc"))
) {
  run(bin("tsc"), ["--noEmit", "--pretty", "false", "--incremental"]);
}

if (isTsxUnderSrc(filePath)) {
  runMoneyCheck();
}

process.exit(0);
