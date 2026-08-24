# Production Launch & Domain Operations

V3C.41 — BiblicalMeal Production Launch Documentation

---

## Current Repository Readiness

The repository is **release-ready** through V3C.40:

- ✅ Release-readiness pipeline (`npm run release-readiness`)
- ✅ Type checking passes
- ✅ Linting passes
- ✅ 465 tests pass
- ✅ Build succeeds
- ✅ Security headers configured
- ✅ Accessibility implemented
- ✅ Privacy/consent architecture complete

**The repository is ready for production deployment.**

---

## External Requirements

The following require external access and cannot be performed from the repository alone:

### Domain & DNS

| Requirement         | Status            | Notes                                                            |
| ------------------- | ----------------- | ---------------------------------------------------------------- |
| Domain registration | ❓ Unknown        | biblicalmeal.com registration status must be verified externally |
| DNS configuration   | ❌ Not configured | A/CNAME records must point to hosting provider                   |
| www redirect        | ❌ Not configured | Requires DNS or platform configuration                           |
| SSL/TLS certificate | ❌ Not configured | Provided by hosting platform                                     |

### Hosting

| Requirement           | Status            | Notes                           |
| --------------------- | ----------------- | ------------------------------- |
| Hosting provider      | ❌ Not selected   | Requires external decision      |
| Repository connection | ❌ Not configured | Requires platform setup         |
| Build configuration   | ❌ Not configured | Requires platform setup         |
| Environment variables | ❌ Not set        | Requires platform configuration |

### Analytics & Search

| Requirement               | Status          | Notes                              |
| ------------------------- | --------------- | ---------------------------------- |
| Google Analytics property | ❌ Not created  | Optional, requires external access |
| GA4 measurement ID        | ❌ Not set      | Optional, requires GA4 property    |
| Google Search Console     | ❌ Not verified | Optional, requires external access |
| Bing Webmaster Tools      | ❌ Not verified | Optional, requires external access |

---

## Hosting Recommendation

**Recommended option pending owner decision:** Cloudflare Pages

### Why Cloudflare Pages

- Free tier sufficient for static sites
- Excellent Astro support
- Automatic HTTPS/SSL
- Global CDN
- Preview deployments
- Git-based deployment
- Good performance

### Alternative Options

Equivalent supported static hosting platforms may also work:

- Vercel
- Netlify
- GitHub Pages (limited - no middleware support)

---

## Canonical Domain Strategy

### Intended Canonical Domain

```
https://biblicalmeal.com
```

### www Handling

**Intended strategy:** Redirect www → non-www

- `www.biblicalmeal.com` → `biblicalmeal.com`

**Status:** Requires external hosting/platform configuration

### Configuration

The repository is configured with:

- `astro.config.mjs`: `site: 'https://biblicalmeal.com'`
- `src/config.ts`: `url: 'https://biblicalmeal.com'`
- `public/robots.txt`: `Sitemap: https://biblicalmeal.com/sitemap-index.xml`

---

## Launch Checklist

### Pre-Launch (External)

- [ ] Verify domain registration status
- [ ] Choose hosting provider
- [ ] Configure repository connection to hosting provider
- [ ] Configure build settings:
  - Node version: `>=22.12.0`
  - Build command: `npm run build`
  - Output directory: `dist`
- [ ] Configure production domain
- [ ] Configure DNS records
- [ ] Verify HTTPS/SSL is working
- [ ] Configure www → non-www redirect
- [ ] Configure optional environment variables:
  - `PUBLIC_GOOGLE_SITE_VERIFICATION` (if using Search Console)
  - `PUBLIC_BING_SITE_VERIFICATION` (if using Bing)
  - `PUBLIC_GA_MEASUREMENT_ID` (if using Analytics)

### Launch

- [ ] Deploy to production
- [ ] Run production smoke test:
  ```bash
  npm run smoke-test -- https://biblicalmeal.com
  ```
- [ ] Perform browser smoke test (see below)
- [ ] Verify CI/release-readiness still passes

### Post-Launch (Optional)

- [ ] Set up Google Search Console
- [ ] Verify domain ownership
- [ ] Submit sitemap
- [ ] Set up Google Analytics (optional)
- [ ] Configure analytics consent (already implemented)

---

## Production Smoke Test

### Automated Check

```bash
npm run smoke-test -- https://biblicalmeal.com
```

This validates:

- Homepage loads
- HTTPS works
- robots.txt exists
- Sitemap exists
- 404 handling works
- Canonical URL is correct
- Security headers are present

### Browser Smoke Test

Manual checks to perform:

| Check                 | Expected Result            |
| --------------------- | -------------------------- |
| Homepage loads        | Full page renders          |
| Navigation works      | All links functional       |
| Recipe pages work     | Content displays correctly |
| Ingredient pages work | Content displays correctly |
| Cookbook page works   | Teaser section renders     |
| Images load           | All images display         |
| Search works          | Pagefind search functions  |
| Mobile navigation     | Hamburger menu works       |
| Consent banner        | Shows on first visit       |
| Privacy page          | Loads correctly            |
| Cookie page           | Loads correctly            |
| Admin page            | Loads correctly (noindex)  |
| No console errors     | No critical JS errors      |

---

## Post-Launch Validation

### Release Readiness

```bash
npm run release-readiness
```

Verifies all repository validation gates pass.

### Production Smoke Test

```bash
npm run smoke-test -- https://biblicalmeal.com
```

Verifies production deployment is healthy.

---

## Rollback

### Repository-Level Rollback

The repository uses git for version control. To rollback:

1. Identify the commit to rollback to
2. Create a revert commit or reset to previous commit
3. Push to main
4. Platform auto-deploys the previous version

### Platform-Level Rollback

Most hosting platforms (Cloudflare, Vercel, Netlify) support:

- Rollback to previous deployment
- Preview deployments for testing
- Branch-based deployments

**Note:** Specific rollback mechanisms depend on the chosen hosting provider.

---

## Security Headers

The repository includes security headers via middleware:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: restricted`
- `Content-Security-Policy: restrictive`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

**Note:** HSTS requires HTTPS to be effective.

---

## Environment Variables

### Required for Launch

None. The site will function correctly without any environment variables.

### Optional

| Variable                          | Purpose                     | Notes                        |
| --------------------------------- | --------------------------- | ---------------------------- |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console verification | Only if using Search Console |
| `PUBLIC_BING_SITE_VERIFICATION`   | Bing verification           | Only if using Bing           |
| `PUBLIC_GA_MEASUREMENT_ID`        | Google Analytics            | Only if using Analytics      |

### Not for Production

| Variable             | Purpose          | Notes                  |
| -------------------- | ---------------- | ---------------------- |
| `OPENAI_API_KEY`     | Image generation | Local development only |
| `OPENAI_IMAGE_MODEL` | Image model      | Local development only |

---

## Known Limitations

1. **Newsletter form is demo-only** - Email delivery not connected
2. **Admin page is visibility-only** - No authentication/persistence
3. **Analytics requires consent** - No tracking without user consent
4. **Search Console data not imported** - Framework ready, not connected

---

## Support

For questions about production deployment, refer to this documentation or the repository README.
