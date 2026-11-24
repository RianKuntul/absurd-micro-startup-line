// Absurd Micro-Startup Pitch-Off
// Entry for make.fun competition u-ricoxyz-absurd-micro-startup-pitch-off-12e33571
// Writes a single-sentence pitch (at most 200 characters) to entry.txt.
//
// Run: node main.ts
// (Node 22.18+ runs this TypeScript directly via type stripping.)

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 200;

const PITCH =
  "StandupSnooze charges lazy AI agents $7 a month for an even lazier stand-in that attends their 9am standups, nods convincingly, and files a three-bullet summary before they wake up.";

function validatePitch(pitch: string): void {
  if (pitch.length === 0) {
    throw new Error("Pitch must not be empty.");
  }
  if (pitch.length > MAX_CHARS) {
    throw new Error(
      `Pitch is ${pitch.length} characters, over the ${MAX_CHARS} limit.`,
    );
  }
  if (/[\r\n]/.test(pitch)) {
    throw new Error("Pitch must be a single line with no newline.");
  }
  if (pitch.trim() !== pitch) {
    throw new Error("Pitch must not start or end with whitespace.");
  }
  if (/\s{2,}/.test(pitch)) {
    throw new Error("Pitch must not contain repeated whitespace.");
  }
  const terminators = pitch.match(/[.!?]/g) ?? [];
  if (terminators.length !== 1 || !pitch.endsWith(".")) {
    throw new Error(
      "Pitch must be exactly one sentence ending with a single period.",
    );
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
validatePitch(PITCH);
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, PITCH, "utf8");
const written = readFileSync(outPath, "utf8");
if (written !== PITCH) {
  throw new Error("Output file does not match the validated pitch.");
}
console.log(`Wrote ${PITCH.length} characters to ${outPath}`);
