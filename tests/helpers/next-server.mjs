import { spawn } from "node:child_process";

export async function startNextServer(port = 3100) {
  const preferredBaseUrl =
    process.env.TEST_BASE_URL || `http://127.0.0.1:${port}`;
  const fallbackBaseUrl = "http://127.0.0.1:3000";

  if (await isReady(preferredBaseUrl)) {
    return { baseUrl: preferredBaseUrl, stop: async () => {} };
  }

  if (preferredBaseUrl !== fallbackBaseUrl && (await isReady(fallbackBaseUrl))) {
    return { baseUrl: fallbackBaseUrl, stop: async () => {} };
  }

  const baseUrl = preferredBaseUrl;

  const isWindows = process.platform === "win32";
  const child = isWindows
    ? spawn(`npm.cmd run dev -- --port ${port}`, {
        cwd: process.cwd(),
        env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
        shell: true,
        stdio: ["ignore", "pipe", "pipe"],
      })
    : spawn("npm", ["run", "dev", "--", "--port", String(port)], {
        cwd: process.cwd(),
        env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
        stdio: ["ignore", "pipe", "pipe"],
      });

  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Next server exited early:\n${output}`);
    }
    if (await isReady(baseUrl)) {
      return {
        baseUrl,
        stop: async () => {
          child.kill();
        },
      };
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  child.kill();
  throw new Error(`Next server did not become ready:\n${output}`);
}

async function isReady(baseUrl) {
  try {
    const res = await fetch(baseUrl, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}
