# Analytics & SEO Measurement — V3C.13

## Implemented analytics readiness

BiblicalMeal has one optional, centralized GA4 integration path:

```text
deployment environment
        ↓
PUBLIC_GA_MEASUREMENT_ID
        ↓
src/lib/analytics.ts
        ↓
resolveAnalytics()
        ↓
BaseLayout.astro
        ↓
public, indexable pages only
```

Analytics is disabled by default. No Google Analytics script or initialization is emitted unless a valid-looking GA4 measurement ID is configured. Empty, whitespace-only, malformed, and obvious placeholder values are rejected.

The integration is centralized in `BaseLayout.astro`. Individual food pages do not load their own analytics scripts.

Analytics is suppressed for `noindex` pages and V3C.11 `technicalFallback` pages. This preserves the existing 404 and technical fallback safety model.

### Manual external setup still required

1. Create or select the real GA4 web data stream for BiblicalMeal.
2. Obtain the real GA4 measurement ID.
3. Configure `PUBLIC_GA_MEASUREMENT_ID` in the deployment environment.
4. Do not commit the real measurement ID to the repository.
5. Deploy the configuration.
6. Verify the live implementation using the real GA4 tools, such as Realtime or DebugView.
7. Confirm that public pages are measured and technical fallback/noindex pages remain outside the normal public measurement path.

No tracking occurs through this implementation until a real valid measurement ID is configured.

## SEO measurement framework

Real SEO and traffic data must come from the external platforms after they are actually configured and verified. BiblicalMeal does not maintain an internal database of invented metrics.

### Content performance

Review by canonical public page:

- impressions
- clicks
- CTR
- average position

Primary source: Google Search Console. Bing Webmaster Tools can provide complementary search visibility data.

### Traffic performance

Review:

- sessions
- users
- organic traffic
- landing pages

Primary source: GA4 after real deployment configuration.

### SEO health

Review from the real search-engine platforms:

- indexed pages
- crawl issues
- sitemap status
- structured-data status

### Content decision signals

Prioritize investigation when real data shows:

- pages gaining impressions
- pages gaining clicks
- high impressions with low CTR
- pages ranking near page one
- pages losing visibility

These are decision signals, not fabricated repository metrics. Any future content or SEO decision should be based on actual externally observed data and the existing publication, evidence, and content architecture.

## External integration status

This repository implementation does not claim that any of the following have happened:

- GA4 property or data stream connection
- Google Search Console connection
- Bing Webmaster Tools connection
- data collection
- sessions or users
- impressions or clicks
- CTR or average position
- rankings
- indexing or crawl success
- conversions or engagement results

Those results must be verified from the actual external platforms after the required manual setup and deployment steps are complete.
