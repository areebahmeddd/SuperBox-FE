const { spawnSync, execSync } = require("child_process");
const path = require("path");

// Resolve docs root relative to this script so it works no matter where npm is invoked.
const repoRoot = path.resolve(__dirname, "..");
const docsRoot = path.join(repoRoot, "docs");

try {
  // Try spawnSync first for consistency.
  const result = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["mintlify", "dev"],
    { stdio: "inherit", cwd: docsRoot },
  );

  if (result.error) {
    throw result.error;
  }

  process.exit(result.status ?? 0);
} catch (err) {
  // Fallback to execSync with shell to avoid platform-specific spawn issues.
  try {
    execSync("npx mintlify dev", {
      stdio: "inherit",
      cwd: docsRoot,
      shell: true,
    });
  } catch (execErr) {
    console.error("Failed to start docs preview:", execErr.message);
    process.exit(1);
  }
}
