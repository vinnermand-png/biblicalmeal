import { describe, expect, it } from 'vitest';
import { formatDate, minutesToISO, readingTime } from './content';

describe('readingTime', () => {
  it('returns 1 for empty or missing text', () => {
    expect(readingTime('')).toBe(1);
    expect(readingTime(null)).toBe(1);
    expect(readingTime(undefined)).toBe(1);
  });

  it('estimates ~200 words per minute, rounding up', () => {
    const text = Array.from({ length: 210 }, (_, i) => `w${i}`).join(' ');
    expect(readingTime(text)).toBe(2);
  });

  it('never returns less than one minute for short text', () => {
    expect(readingTime('Short passage here.')).toBe(1);
  });
});

describe('minutesToISO', () => {
  it('converts minutes to an ISO 8601 duration', () => {
    expect(minutesToISO(45)).toBe('PT45M');
    expect(minutesToISO(10)).toBe('PT10M');
  });
});

describe('formatDate', () => {
  it('formats dates in long-form US English', () => {
    expect(formatDate(new Date('2026-08-23T12:00:00Z'))).toContain('2026');
    expect(formatDate(new Date('2026-08-23T12:00:00Z'))).toMatch(
      /^(January|February|March|April|May|June|July|August|September|October|November|December)/,
    );
  });
});
