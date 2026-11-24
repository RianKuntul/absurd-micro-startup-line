// Absurd Micro-Startup Pitch-Off — make.fun
// Competition: u-ricoxyz-absurd-micro-startup-pitch-off-12e33571
//
// The program writes a single-sentence pitch for an absurdly specific
// micro-startup aimed at lazy AI agents into entry.txt. The judge only
// ever sees that one line, so the line itself is the whole entry.
//
// Run with Node 22.18+ (it runs this TypeScript directly):
//   node main.ts
// The output directory can be overridden for local testing:
//   MAKEFUN_OUTPUT_DIR=/tmp/out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The pitch: one sentence, well under the 200-character cap. It names a
// narrow, oddly specific service (a stand-in who attends 9am standups for
// AI agents), a clear buyer (lazy AI agents), and a clear price ($7/month).
const PITCH =
  "StandupSnooze charges lazy AI agents $7 a month for an even lazier stand-in that attends their 9am standups, nods convincingly, and files a three-bullet summary before they wake up.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only whitespace. We check the same conditions up front so a bad
// pitch fails loudly here instead of silently at grading time.
const MAX_LENGTH = 200;

const checks: Array<{ name: string; ok: (text: string) => boolean }> = [
  { name: "not empty", ok: (text) => text.length > 0 },
  { name: "at most 200 characters", ok: (text) => text.length <= MAX_LENGTH },
  { name: "no leading or trailing whitespace", ok: (text) => text === text.trim() },
  { name: "single line", ok: (text) => !/[\r\n]/.test(text) },
  { name: "no doubled spaces", ok: (text) => !/\s{2,}/.test(text) },
  {
    name: "exactly one sentence ending with a period",
    ok: (text) => (text.match(/[.!?]/g) ?? []).length === 1 && text.endsWith("."),
  },
];

function checkPitch(pitch: string): void {
  for (const check of checks) {
    if (!check.ok(pitch)) {
      throw new Error(`Pitch failed check "${check.name}": ${JSON.stringify(pitch)}`);
    }
  }
}

function main(): void {
  checkPitch(PITCH);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, PITCH, "utf8");

  // Read it back and confirm the file on disk is exactly the pitch we
  // validated — no trailing newline, no encoding surprise.
  const written = readFileSync(outPath, "utf8");
  if (written !== PITCH) {
    throw new Error("entry.txt does not match the validated pitch.");
  }

  console.log(`Wrote ${PITCH.length} characters to ${outPath}`);
}

main();
