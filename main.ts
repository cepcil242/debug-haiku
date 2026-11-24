import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// A haiku about debugging, in the 5-7-5 syllable shape.
// Concrete picture: a cursor blinking at three in the morning, and a log
// line that lies. Turn: the bug was never in the code — it was me.
const ENTRY =
  "Cursor blinks at three\none more log line lies again\nso the bug was me";

/**
 * Gate check (mirrors the competition's sealed scorer): the entry must be
 * UTF-8 text of 1 to 200 Unicode characters, not only whitespace, and a
 * haiku of exactly 3 non-empty lines. The 200 cap counts Unicode code
 * points ([...text]), not UTF-16 units, so multi-byte characters are
 * counted the way the scorer counts them. Throws on any violation, before
 * anything is written, so an invalid entry never reaches the judge.
 */
function validateEntry(text: string): void {
  const chars = [...text];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`Entry must be 1-200 characters, got ${chars.length}.`);
  }
  if (text.trim().length === 0) {
    throw new Error("Entry must not be only whitespace.");
  }
  const lines = text.split("\n");
  if (lines.length !== 3) {
    throw new Error(`Entry must be exactly 3 lines, got ${lines.length}.`);
  }
  for (const line of lines) {
    if (line.trim().length === 0) {
      throw new Error("Each line of the haiku must be non-empty.");
    }
  }
}

validateEntry(ENTRY);

const outPath = process.env.ENTRY_OUTPUT_PATH ?? "/output/entry.txt";
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, ENTRY + "\n", "utf8");
