# Search Engine Setup — V3C.12

## Implemented technical readiness

BiblicalMeal has one canonical production site URL:

`https://biblicalmeal.com`

The existing Astro sitemap integration uses that site URL and emits the canonical sitemap at:

`https://biblicalmeal.com/sitemap-index.xml`

The existing `public/robots.txt` exposes the same sitemap URL. Public search surfaces remain controlled by the existing publication architecture: only explicitly published and indexable public content can reach public routes, structured data, and internal links. The V3C.11 technical fallback remains `noindex, follow` and suppresses canonical, social, and JSON-LD output.

Optional ownership verification metadata is centralized in `BaseLayout` through `src/lib/search-engine-verification.ts`. Verification tags render only when real deployment values are configured:

- `PUBLIC_GOOGLE_SITE_VERIFICATION` → `google-site-verification`
- `PUBLIC_BING_SITE_VERIFICATION` → `msvalidate.01`

Do not commit real account-specific values. Configure them in the deployment environment or an untracked local environment file when needed. Meta verification values are public ownership challenges once rendered, but they should still not be committed as account configuration.

## Google Search Console — manual external steps still required

1. Add the canonical production property for `https://biblicalmeal.com`.
2. Choose the actual ownership verification method.
3. If using the supported meta-tag method, configure `PUBLIC_GOOGLE_SITE_VERIFICATION` with the real value issued by Google.
4. Deploy the configuration.
5. Verify ownership inside Google Search Console.
6. Submit `https://biblicalmeal.com/sitemap-index.xml`.
7. Inspect actual indexing status later from the Google Search Console dashboard.

No ownership verification, sitemap acceptance, crawl activity, indexing, impressions, clicks, or rankings are implied by this repository implementation.

## Bing Webmaster Tools — manual external steps still required

1. Add or import the canonical production site for `https://biblicalmeal.com`.
2. Choose the actual ownership verification method.
3. If using the supported meta-tag method, configure `PUBLIC_BING_SITE_VERIFICATION` with the real value issued by Bing.
4. Deploy the configuration.
5. Verify ownership inside Bing Webmaster Tools.
6. Submit `https://biblicalmeal.com/sitemap-index.xml`.
7. Inspect actual crawl and index status later from the Bing dashboard.

No ownership verification, sitemap acceptance, crawl activity, or indexing is claimed until it is externally confirmed.

## DNS or file verification

DNS verification must be completed through the real domain-management provider. File-based verification should only be added if a search engine actually requires a specific verification file and provides its exact required filename and content. Do not create speculative verification files or fake tokens.
