/**
 * POST-LAUNCH SEO SYSTEM & AUTHORITY STRATEGY (V3B expansion)
 * ===========================================================
 * FUTURE OPERATIONAL STRATEGY. No Search Console data exists today;
 * nothing here pretends otherwise. This documents the loop that starts
 * the day real traffic data begins arriving.
 */

export type LoopStage =
  | 'launch'
  | 'indexing'
  | 'search-console'
  | 'real-impressions'
  | 'real-queries'
  | 'real-average-positions'
  | 'position-11-20-review'
  | 'content-improvement'
  | 'internal-link-improvement'
  | 'ctr-improvement'
  | 'relevant-link-earning'
  | 'page-1-push';

export const POST_LAUNCH_LOOP: {
  stage: LoopStage;
  action: string;
  dataStatus: 'future' | 'ongoing';
}[] = [
  {
    stage: 'launch',
    action: 'Publish verified content; submit sitemap; verify indexing.',
    dataStatus: 'future',
  },
  {
    stage: 'indexing',
    action: 'Monitor index coverage until all published routes are indexed.',
    dataStatus: 'future',
  },
  {
    stage: 'search-console',
    action: 'GSC becomes the sole ranking-data source; Bing WMT secondary.',
    dataStatus: 'future',
  },
  {
    stage: 'real-impressions',
    action: 'Identify which mapped families actually earn impressions.',
    dataStatus: 'future',
  },
  {
    stage: 'real-queries',
    action: 'Log real queries per route; reconcile against keyword-family map.',
    dataStatus: 'future',
  },
  {
    stage: 'real-average-positions',
    action:
      'Track average positions only for queries with meaningful impressions.',
    dataStatus: 'future',
  },
  {
    stage: 'position-11-20-review',
    action: 'Page-2 targets are the improvement queue - highest ROI first.',
    dataStatus: 'future',
  },
  {
    stage: 'content-improvement',
    action: 'Deepen pages with real evidence gaps identified by query data.',
    dataStatus: 'future',
  },
  {
    stage: 'internal-link-improvement',
    action:
      'Strengthen paths into 11-20 positions from related pillars/profiles.',
    dataStatus: 'future',
  },
  {
    stage: 'ctr-improvement',
    action: 'Improve titles/descriptions honestly - accuracy over clickbait.',
    dataStatus: 'future',
  },
  {
    stage: 'relevant-link-earning',
    action: 'Pursue citations per authority strategy below.',
    dataStatus: 'future',
  },
  {
    stage: 'page-1-push',
    action: 'Iterate; document what moved and what did not.',
    dataStatus: 'future',
  },
];

/** Part 11 technical expansion - future requirements, no third-party code now. */
export const TECH_SEO_EXPANSION_CHECKLIST: {
  area: string;
  requirement: string;
  timing: string;
}[] = [
  {
    area: 'Google Search Console setup',
    requirement:
      'Verify property on launch day; submit sitemap-index.xml; confirm coverage of every published route.',
    timing: 'Launch-critical',
  },
  {
    area: 'Bing Webmaster Tools',
    requirement:
      'Mirror verification + sitemap submission for second engine visibility.',
    timing: 'Launch week',
  },
  {
    area: 'Indexation monitoring',
    requirement:
      'Weekly GSC coverage review until stable; investigate any valid-page exclusion.',
    timing: 'First 3 months',
  },
  {
    area: 'Sitemap monitoring',
    requirement:
      'Re-check sitemap after every deploy; ensure /seo-map/ exclusion still holds.',
    timing: 'Every deploy',
  },
  {
    area: '404 monitoring',
    requirement:
      'Watch GSC Pages report + host logs for crawl errors; fix or redirect within days, not months.',
    timing: 'Ongoing',
  },
  {
    area: 'Redirect policy',
    requirement:
      '301 for permanent URL changes; never chain redirects; no soft-404s.',
    timing: 'Policy now, enforcement ongoing',
  },
  {
    area: 'URL change policy',
    requirement:
      'URLs are permanent once published; changes require a documented redirect entry and internal-link sweep.',
    timing: 'Policy now',
  },
  {
    area: 'Content freshness',
    requirement:
      'Annual review cycle per cluster; refresh triggered by new scholarship, not by calendar anxiety.',
    timing: 'From month 12',
  },
  {
    area: 'OG image roadmap',
    requirement:
      'Branded 1200x630 social image (existing BaseLayout TODO) before first pillar publishes.',
    timing: 'Before Phase 2 pillar launches',
  },
  {
    area: 'Image SEO roadmap',
    requirement:
      'When photography arrives: descriptive filenames, alt text discipline, width/height, Astro image pipeline.',
    timing: 'With first photo asset',
  },
  {
    area: 'Schema eligibility review',
    requirement:
      'Quarterly check that JSON-LD still matches visible content exactly (Recipe/Article gating).',
    timing: 'Quarterly',
  },
  {
    area: 'Core Web Vitals monitoring',
    requirement:
      'CrUX/PageSpeed review once real field data exists; static site should hold green - verify, assume nothing.',
    timing: 'After indexing',
  },
];

export const OUTREACH_CATEGORIES: { category: string; fitRationale: string }[] =
  [
    {
      category: 'Christian publications',
      fitRationale: 'Natural audience for verified biblical-food content.',
    },
    {
      category: 'Bible study resources',
      fitRationale: 'Our scripture-verification workflow is directly citable.',
    },
    {
      category: 'Churches and teaching ministries',
      fitRationale: 'Small-group study material with honest sourcing.',
    },
    {
      category: 'Theological education',
      fitRationale: 'Methodology transparency invites classroom use.',
    },
    {
      category: 'Food history publications',
      fitRationale:
        'The historical-diet angle crosses into food-history media.',
    },
    {
      category: 'Archaeology/history education resources',
      fitRationale:
        'Where finds genuinely relate to food topics, our citations make linking natural.',
    },
  ];

export const LINKABLE_ASSETS: string[] = [
  'Seven-species hub article (once Deuteronomy 8:8 verification completes)',
  'Evidence-tier methodology page',
  'Ingredient profiles with translation notes',
  'Original SVG illustration system (unique visual identity)',
];

export const AUTHORITY_PRINCIPLES: string[] = [
  'RELEVANCE: outreach only where BiblicalMeal content genuinely serves that audience.',
  'EDITORIAL QUALITY: links are earned by content worth citing - never requested as favors.',
  'NATURAL CITATION VALUE: assets are built to be reference material first.',
];

export const PROHIBITED_TACTICS: string[] = [
  'Buying backlinks or sponsored-link placements without disclosure.',
  'Private blog networks (PBNs).',
  'Automated or mass link-submission spam.',
  'Low-quality directory blasts.',
];
