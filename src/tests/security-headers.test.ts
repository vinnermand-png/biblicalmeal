import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readSource = (path: string) =>
  readFileSync(new URL(path, import.meta.url), 'utf8');

/**
 * V3C.38 Security Headers Tests
 *
 * Tests cover:
 * - Security headers are configured in middleware
 * - Content Security Policy is present
 * - Clickjacking protection (X-Frame-Options)
 * - MIME type protection (X-Content-Type-Options)
 * - Referrer policy
 * - Permissions policy
 * - HSTS header
 */

describe('V3C.38 security headers', () => {
  const middlewareSource = readSource('../middleware.ts');

  it('configures X-Frame-Options for clickjacking protection', () => {
    expect(middlewareSource).toContain('X-Frame-Options');
    expect(middlewareSource).toContain('DENY');
  });

  it('configures X-Content-Type-Options for MIME type protection', () => {
    expect(middlewareSource).toContain('X-Content-Type-Options');
    expect(middlewareSource).toContain('nosniff');
  });

  it('configures Referrer-Policy', () => {
    expect(middlewareSource).toContain('Referrer-Policy');
    expect(middlewareSource).toContain('strict-origin-when-cross-origin');
  });

  it('configures Permissions-Policy', () => {
    expect(middlewareSource).toContain('Permissions-Policy');
    expect(middlewareSource).toContain('camera=()');
    expect(middlewareSource).toContain('microphone=()');
    expect(middlewareSource).toContain('geolocation=()');
  });

  it('configures Content-Security-Policy', () => {
    expect(middlewareSource).toContain('Content-Security-Policy');
    expect(middlewareSource).toContain("default-src 'self'");
    expect(middlewareSource).toContain("script-src 'self'");
    expect(middlewareSource).toContain("frame-ancestors 'none'");
  });

  it('configures HSTS header', () => {
    expect(middlewareSource).toContain('Strict-Transport-Security');
    expect(middlewareSource).toContain('max-age=31536000');
    expect(middlewareSource).toContain('includeSubDomains');
  });

  it('allows GA4 domains in CSP for analytics integration', () => {
    expect(middlewareSource).toContain('www.googletagmanager.com');
    expect(middlewareSource).toContain('www.google-analytics.com');
  });

  it('blocks frames and objects in CSP', () => {
    expect(middlewareSource).toContain("frame-src 'none'");
    expect(middlewareSource).toContain("object-src 'none'");
  });

  it('restricts form actions to self', () => {
    expect(middlewareSource).toContain("form-action 'self'");
  });

  it('restricts base URI to self', () => {
    expect(middlewareSource).toContain("base-uri 'self'");
  });

  it('uses Astro middleware pattern', () => {
    expect(middlewareSource).toContain('defineMiddleware');
    expect(middlewareSource).toContain('onRequest');
  });
});
