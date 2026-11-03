import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const componentsDir = join(process.cwd(), "src", "components");

// Match the raw JSX interpolation `{claim.amount}` only.
// `{formatStoredAmount(claim.amount)}` is the display helper and must pass.
const rawInterpolation = /\{\s*claim\.amount\s*\}/;

function tsxFiles(dir) {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...tsxFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      found.push(fullPath);
    }
  }
  return found;
}

const hits = tsxFiles(componentsDir).filter((file) =>
  rawInterpolation.test(readFileSync(file, "utf8")),
);

if (hits.length > 0) {
  for (const file of hits) {
    console.error(relative(process.cwd(), file));
  }
  process.exit(1);
}
