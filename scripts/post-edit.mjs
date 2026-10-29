// PostToolUse hook. After Claude edits a file: typecheck the owning package and
// its dependents, then run the Vitest tests related to that file. Exit 2 blocks
// further work until the failure is fixed.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const input = JSON.parse(readFileSync(0, "utf8") || "{}");
const file = input.tool_input?.file_path;

if (!file || !/\.(ts|tsx|js|mjs|cjs|json)$/.test(file) || !file.startsWith(root)) {
  process.exit(0);
}

function findPackageDir(start) {
  let dir = start;
  while (dir.startsWith(root)) {
    if (existsSync(path.join(dir, "package.json"))) return dir;
    if (dir === root) break;
    dir = path.dirname(dir);
  }
  return root;
}

function run(args, cwd) {
  const result = spawnSync("pnpm", args, { cwd, encoding: "utf8" });
  return { ok: result.status === 0, output: `${result.stdout ?? ""}${result.stderr ?? ""}` };
}

function fail(label, output) {
  process.stderr.write(`${label} failed after editing ${path.relative(root, file)}\n${output}`);
  process.exit(2);
}

const pkgDir = findPackageDir(path.dirname(file));
const pkgName = JSON.parse(readFileSync(path.join(pkgDir, "package.json"), "utf8")).name;

const typecheckArgs =
  pkgDir === root
    ? ["exec", "turbo", "run", "typecheck", "--output-logs=errors-only"]
    : ["exec", "turbo", "run", "typecheck", `--filter=...${pkgName}`, "--output-logs=errors-only"];
const typecheck = run(typecheckArgs, root);
if (!typecheck.ok) fail("typecheck", typecheck.output);

const hasVitest = pkgDir !== root && existsSync(path.join(pkgDir, "vitest.config.ts"));
if (hasVitest && /\.(ts|tsx)$/.test(file) && !file.includes(`${path.sep}e2e${path.sep}`)) {
  const tests = run(["exec", "vitest", "related", file, "--run", "--passWithNoTests"], pkgDir);
  if (!tests.ok) fail("tests", tests.output);
}
