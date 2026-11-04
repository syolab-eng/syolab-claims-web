#!/usr/bin/env node
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");

const directAmount = /\{\s*claim\s*\.\s*amount\s*\}/g;

function collectTsx(dir) {
  const files = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`check:money: cannot read ${dir}: ${message}`);
    process.exit(1);
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTsx(full));
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      files.push(full);
    }
  }
  return files;
}

function isFormatUsdArgument(source, index) {
  return /formatUsd\(\s*$/.test(source.slice(0, index));
}

function lineOf(source, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (source.charCodeAt(i) === 10) line += 1;
  }
  return line;
}

const violations = [];
for (const file of collectTsx(srcDir)) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(directAmount)) {
    const index = match.index ?? 0;
    if (isFormatUsdArgument(source, index)) continue;
    const rel = relative(root, file);
    const line = lineOf(source, index);
    violations.push(
      `${rel}:${line}: JSX renders the stored claim amount directly ({claim.amount}). Use formatUsd(claim.amount).`,
    );
  }
}

if (violations.length > 0) {
  console.error("check:money failed");
  for (const violation of violations) console.error(violation);
  process.exit(1);
}
