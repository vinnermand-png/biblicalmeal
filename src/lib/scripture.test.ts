import { describe, expect, it } from 'vitest';
import { formatScriptureRef, formatScriptureRefs } from './scripture';

describe('formatScriptureRef', () => {
  it('formats a single verse', () => {
    expect(
      formatScriptureRef({ book: 'Deuteronomy', chapter: 8, verseStart: 8 }),
    ).toBe('Deuteronomy 8:8');
  });

  it('formats a verse range with an en dash', () => {
    expect(
      formatScriptureRef({
        book: 'Genesis',
        chapter: 3,
        verseStart: 6,
        verseEnd: 7,
      }),
    ).toBe('Genesis 3:6\u20137');
  });

  it('collapses a range where start equals end', () => {
    expect(
      formatScriptureRef({
        book: 'Ruth',
        chapter: 2,
        verseStart: 14,
        verseEnd: 14,
      }),
    ).toBe('Ruth 2:14');
  });
});

describe('formatScriptureRefs', () => {
  it('formats a list of references in order', () => {
    expect(
      formatScriptureRefs([
        { book: 'Exodus', chapter: 16, verseStart: 31 },
        { book: 'John', chapter: 21, verseStart: 9, verseEnd: 13 },
      ]),
    ).toEqual(['Exodus 16:31', 'John 21:9\u201313']);
  });
});
