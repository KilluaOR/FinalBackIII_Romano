import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const jestPath = path.join(root, "node_modules", "jest", "bin", "jest.js");

let argv = process.argv.slice(2);
// pnpm run test -- --coverage passes a literal "--" before flags; Jest then treats
// the next token as a test path pattern instead of an option.
if (argv[0] === "--" && argv.length > 1 && argv[1].startsWith("-")) {
  argv = argv.slice(1);
}

const result = spawnSync(
  process.execPath,
  ["--experimental-vm-modules", jestPath, "--forceExit", ...argv],
  { stdio: "inherit", cwd: root }
);

process.exit(result.status === null ? 1 : result.status);
