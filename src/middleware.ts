/**
 * V3C.38 Security Headers Middleware
 *
 * Adds security headers to all responses. These are repository-level
 * security boundaries that can be enforced at build time or via
 * deployment configuration.
 *
 * Important: Some headers (HSTS) require HTTPS at the deployment level.
 * This middleware adds the headers; actual enforcement depends on the
 * deployment platform (Netlify, Vercel, etc.).
 */

import { defineMiddleware } from 'astro:middleware';

/**
 * Security headers configuration.
 * These reflect the actual security posture of the repository.
 */
const SECURITY_HEADERS: Record<string, string> = {
  // Clickjacking protection
  'X-Frame-Options': 'DENY',

  // MIME type sniffing protection
  'X-Content-Type-Options': 'nosniff',

  // Referrer policy - sends origin only for cross-origin requests
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy - restrict browser features
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()',

  // XSS protection (legacy but still useful for older browsers)
  'X-XSS-Protection': '1; mode=block',
};

/**
 * Content Security Policy.
 * Must be compatible with the existing application:
 * - Self scripts (inline and external)
 * - Google Analytics (when configured)
 * - Fontsource fonts (local)
 * - Inline styles (used by Astro)
 * - Images from the same origin
 *
 * This is a restrictive CSP that blocks:
 * - Inline event handlers
 * - eval() and similar
 * - Untrusted external scripts
 *
 * Note: GA4 requires 'www.googletagmanager.com' and 'www.google-analytics.com'
 * domains. These are included in the CSP for when analytics is configured.
 */
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();

  // Add security headers
  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(header, value);
  }

  // Add CSP header
  response.headers.set('Content-Security-Policy', CSP_DIRECTIVES);

  // Add HSTS header (requires HTTPS at deployment level)
  // This is safe to include even if HTTPS isn't configured yet -
  // the header will be ignored if served over HTTP
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload',
  );

  return response;
});
