import { mkdir, appendFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export async function appendLead(file: string, payload: Record<string, unknown>) {
  const record = {
    ...payload,
    createdAt: new Date().toISOString(),
  };

  const candidates = [
    {
      directory: path.join(/* turbopackIgnore: true */ process.cwd(), "data"),
      output: path.join(/* turbopackIgnore: true */ process.cwd(), "data", file),
    },
    {
      directory: path.join(os.tmpdir(), "sass-prime"),
      output: path.join(os.tmpdir(), "sass-prime", file),
    },
  ];

  for (const candidate of candidates) {
    try {
      await mkdir(candidate.directory, { recursive: true });
      await appendFile(candidate.output, `${JSON.stringify(record)}\n`, "utf8");
      return;
    } catch {
      // Try the next writable location.
    }
  }

  throw new Error("No writable storage location is available.");
}

export function isEmail(value: unknown) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
