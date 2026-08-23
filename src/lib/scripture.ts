export interface ScriptureRef {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
}

const REFERENCE_PATTERN =
  /^([1-3]?\s?[A-Za-z][A-Za-z .]*?)\s+(\d+):(\d+)(?:\s*[–-]\s*(\d+))?$/;

/**
 * Parses a human reference string ("Genesis 3:2", "Luke 24:42–43",
 * "1 Corinthians 10:4") into canonical structure. Accepts hyphen and en dash
 * ranges; returns undefined on malformed input so callers can reject rather
 * than guess.
 */
export function parseCanonicalReference(
  input: string,
): ScriptureRef | undefined {
  const match = REFERENCE_PATTERN.exec(input.trim());
  if (!match) return undefined;
  const book = match[1].trim();
  const chapter = Number(match[2]);
  const verseStart = Number(match[3]);
  const verseEndRaw = match[4];
  const verseEnd = verseEndRaw ? Number(verseEndRaw) : undefined;
  if (
    chapter < 1 ||
    verseStart < 1 ||
    (verseEnd !== undefined && verseEnd < verseStart)
  ) {
    return undefined;
  }
  return verseEnd !== undefined
    ? { book, chapter, verseStart, verseEnd }
    : { book, chapter, verseStart };
}

/** Structural validity of a reference object. */
export function isValidReferenceStructure(
  ref: ScriptureRef | undefined | null,
): ref is ScriptureRef {
  return (
    !!ref &&
    typeof ref.book === 'string' &&
    ref.book.trim().length > 0 &&
    Number.isInteger(ref.chapter) &&
    ref.chapter > 0 &&
    Number.isInteger(ref.verseStart) &&
    ref.verseStart > 0 &&
    (ref.verseEnd === undefined ||
      (Number.isInteger(ref.verseEnd) && ref.verseEnd >= ref.verseStart))
  );
}

function formatVerses(ref: ScriptureRef): string {
  if (ref.verseEnd && ref.verseEnd !== ref.verseStart) {
    return `${ref.verseStart}\u2013${ref.verseEnd}`;
  }
  return String(ref.verseStart);
}

export function formatScriptureRef(ref: ScriptureRef): string {
  return `${ref.book} ${ref.chapter}:${formatVerses(ref)}`;
}

export function formatScriptureRefs(refs: readonly ScriptureRef[]): string[] {
  return refs.map(formatScriptureRef);
}
