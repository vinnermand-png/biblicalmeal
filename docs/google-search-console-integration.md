# Google Search Console & SEO Data Integration — V3C.35

## What this phase adds

BiblicalMeal now has a canonical, validated boundary for importing real Google Search Console measurements into the existing SEO architecture:

```text
Google Search Console export/API data
        ↓
validated import rows
        ↓
canonical SEO target route matching
        ↓
V3C.26 SERP snapshots
        ↓
V3C.27 refresh context
        ↓
V3C.28 ranking optimization context
```

The implementation reuses existing canonical SEO targets. It does not create a second keyword registry or a second page-target registry.

## Provider status

The repository is currently **import-ready**, not connected.

No Google Search Console API credential, OAuth flow, account connection, property connection, or live measurement feed is configured in the repository. Real deployment credentials must remain outside committed source code.

The supported import row fields are:

- `date`
- `page`
- `query`
- `clicks`
- `impressions`
- `ctr`
- `position`

Rows are rejected when they have an invalid date, unknown canonical route, empty query, negative clicks/impressions, CTR outside `0..1`, or non-positive position.

## Missing data

An empty repository snapshot set means no measurement has been imported. It does not mean zero clicks, zero impressions, a poor ranking, or any other performance result.

Until a real source is connected or imported, canonical targets report `future-source` availability.

## Canonical history and integrity

Imported measurements are grouped into canonical V3C.26 snapshots by:

```text
target ID + calendar date
```

Multiple query rows can therefore belong to one page/date snapshot, while duplicate target/date snapshots are rejected by audit validation. Unknown targets and route mismatches are rejected rather than silently creating new SEO targets.

## Downstream boundaries

Real measurements can inform V3C.27 content refresh and V3C.28 ranking optimization context, but the import layer does not:

- rewrite content
- create automatic refresh records
- create automatic ranking opportunities
- approve content
- publish content
- guarantee ranking improvements

Existing research, authority, citation, editorial, and publication gates remain authoritative for any actual change.
