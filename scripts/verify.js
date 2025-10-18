#!/usr/bin/env node
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");
function runNpmScript(name) {
  const useNpmExecPath = Boolean(process.env.npm_execpath);
  const command = useNpmExecPath ? process.execPath : "npm";
  const args = useNpmExecPath
    ? [process.env.npm_execpath, "run", name]
    : ["run", name];

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: "inherit",
      env: process.env,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`npm run ${name} failed with exit code ${code}`));
      }
    });
  });
}

async function main() {
  try {
    await runNpmScript("typecheck");
    await runNpmScript("build");
    console.log("🎉 Alles erledigt: typecheck + build erfolgreich.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
