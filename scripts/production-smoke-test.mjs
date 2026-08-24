#!/usr/bin/env node

/**
 * V3C.41 Production Smoke Test
 *
 * Validates production deployment readiness by checking critical
 * endpoints, security headers, canonical URLs, and 404 behavior.
 *
 * Usage:
 *   npm run smoke-test -- https://biblicalmeal.com
 *
 * Exit codes:
 *   0 - All critical checks passed
 *   1 - One or more critical checks failed
 */

import https from 'node:https';
import http from 'node:http';
import { URL } from 'node:url';

const args = process.argv.slice(2);
const targetUrl = args[0];

if (!targetUrl) {
  console.error('Error: No target URL provided.');
  console.error('Usage: npm run smoke-test -- https://biblicalmeal.com');
  process.exit(1);
}

let baseUrl;
try {
  baseUrl = new URL(targetUrl);
} catch {
  console.error(`Error: Invalid URL provided: ${targetUrl}`);
  process.exit(1);
}

// Normalize URL (remove trailing slash)
const normalizedBase = baseUrl.origin;

console.log('');
console.log('BIBLICALMEAL PRODUCTION SMOKE TEST');
console.log('═'.repeat(40));
console.log(`Target: ${normalizedBase}`);
console.log('');

const results = [];
let allPassed = true;

/**
 * Fetch a URL and return response details
 */
async function fetchUrl(url, options = {}) {
  const { maxRedirects = 5, followRedirects = true } = options;
  const parsedUrl = new URL(url);
  const client = parsedUrl.protocol === 'https:' ? https : http;

  return new Promise((resolve, reject) => {
    const req = client.get(url, { timeout: 10000 }, (res) => {
      // Handle redirects
      if (
        followRedirects &&
        [301, 302, 303, 307, 308].includes(res.statusCode) &&
        res.headers.location
      ) {
        if (maxRedirects <= 0) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            redirected: true,
            redirectCount: 5,
            finalUrl: res.headers.location,
          });
          return;
        }

        const redirectUrl = new URL(res.headers.location, url).toString();
        fetchUrl(redirectUrl, {
          maxRedirects: maxRedirects - 1,
          followRedirects,
        }).then(resolve);
        return;
      }

      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body,
          redirected: false,
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
  });
}

/**
 * Run a smoke test check
 */
function check(name, passed, warning = false, details = '') {
  const status = warning ? 'WARN' : passed ? 'PASS' : 'FAIL';
  results.push({ name, status, details });

  if (!passed && !warning) {
    allPassed = false;
  }

  const detailsStr = details ? ` (${details})` : '';
  console.log(`${status}  ${name}${detailsStr}`);
}

// === CORE AVAILABILITY CHECKS ===

console.log('Gates:');
console.log('');

try {
  // 1. Homepage check
  const homepageResponse = await fetchUrl(normalizedBase);
  check(
    'Homepage',
    homepageResponse.status === 200,
    false,
    `Status: ${homepageResponse.status}`,
  );

  // 2. HTTPS check
  const isHttps = baseUrl.protocol === 'https:';
  check('HTTPS', isHttps, false, isHttps ? 'Secure' : 'Not HTTPS');

  // 3. robots.txt check
  try {
    const robotsResponse = await fetchUrl(`${normalizedBase}/robots.txt`);
    check(
      'robots.txt',
      robotsResponse.status === 200,
      false,
      `Status: ${robotsResponse.status}`,
    );
  } catch {
    check('robots.txt', false, false, 'Failed to fetch');
  }

  // 4. Sitemap check
  try {
    const sitemapResponse = await fetchUrl(
      `${normalizedBase}/sitemap-index.xml`,
    );
    check(
      'Sitemap',
      sitemapResponse.status === 200,
      false,
      `Status: ${sitemapResponse.status}`,
    );
  } catch {
    check('Sitemap', false, false, 'Failed to fetch');
  }

  // 5. 404 handling check
  try {
    const notFoundResponse = await fetchUrl(
      `${normalizedBase}/this-page-does-not-exist-12345`,
    );
    check(
      '404 handling',
      notFoundResponse.status === 404,
      false,
      `Status: ${notFoundResponse.status}`,
    );
  } catch {
    check('404 handling', false, false, 'Failed to fetch');
  }

  // 6. Canonical URL check
  if (homepageResponse.body) {
    const canonicalMatch = homepageResponse.body.match(
      /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/,
    );
    if (canonicalMatch) {
      const canonicalUrl = canonicalMatch[1];
      const canonicalNormalized = canonicalUrl.replace(/\/$/, '');
      check(
        'Canonical URL',
        canonicalNormalized === normalizedBase,
        false,
        canonicalNormalized === normalizedBase
          ? 'Matches'
          : `Expected ${normalizedBase}, got ${canonicalNormalized}`,
      );
    } else {
      check('Canonical URL', false, false, 'Not found in homepage');
    }
  }

  // 7. Security headers check
  const headers = homepageResponse.headers || {};

  const criticalHeaders = [
    'x-frame-options',
    'x-content-type-options',
    'referrer-policy',
    'permissions-policy',
    'content-security-policy',
  ];

  const missingCritical = criticalHeaders.filter(
    (h) => !headers[h] && !headers[h.toLowerCase()],
  );

  check(
    'Security headers (critical)',
    missingCritical.length === 0,
    false,
    missingCritical.length === 0
      ? 'All present'
      : `Missing: ${missingCritical.join(', ')}`,
  );

  // HSTS check (only meaningful over HTTPS)
  if (isHttps) {
    const hasHsts =
      headers['strict-transport-security'] ||
      headers['Strict-Transport-Security'];
    check('HSTS header', !!hasHsts, !hasHsts, hasHsts ? 'Present' : 'Missing');
  } else {
    check('HSTS header', true, true, 'Skipped (not HTTPS)');
  }
} catch (error) {
  console.error('');
  console.error(`Error: ${error.message}`);
  allPassed = false;
}

// === FINAL VERDICT ===

console.log('');
console.log('─'.repeat(40));

if (allPassed) {
  console.log('Verdict: PRODUCTION SMOKE TEST PASSED');
  console.log('');
  console.log('All critical production checks passed.');
  process.exit(0);
} else {
  console.log('Verdict: PRODUCTION SMOKE TEST FAILED');
  console.log('');
  console.log('One or more critical production checks failed.');

  const failed = results.filter((r) => r.status === 'FAIL');
  if (failed.length > 0) {
    console.log('');
    console.log('Failed checks:');
    for (const item of failed) {
      console.log(`  - ${item.name}: ${item.details}`);
    }
  }

  process.exit(1);
}
