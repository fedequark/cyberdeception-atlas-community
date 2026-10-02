# Architecture

## Deployment

Astro renders the public site and API on Cloudflare Workers. Static assets are served directly. D1 is the authoritative runtime store for resources, sources, editorial revisions, submissions and monitoring candidates. A small scheduled Worker performs bounded, incremental source checks. No paid-plan resources are required.

## Data ownership

The initial editorial catalog is committed as JSON with source provenance and imported into D1. Subsequent editorial changes are made in D1 and exported as versioned public snapshots. Re-import never silently overwrites later editorial changes. Private submissions and private audit information must never be included in public exports.

## Search and assistant

D1 FTS5 handles text queries. The assistant retrieves a small set of published records and uses Workers AI only when explicitly enabled after verifying Free-plan access. Global daily and per-client request caps are enforced in D1. Inference does not use paid-only models or a prepaid gateway. Quota exhaustion returns the supporting search results.

## Editorial access

The editorial surface requires a private owner key stored only as a Cloudflare Worker secret. A signed, short-lived HttpOnly cookie is issued after login; POST requests require a matching Origin. Login attempts are capped. Revisions track publication decisions. Community submissions are stored separately for moderation. The private key is not included in GitHub or public exports. Cloudflare Access can be added later if the owner configures it, but the current release has no Access dependency.

## Recovery

Versioned SQL migrations and non-destructive catalog imports support recovery. Public snapshots can be regenerated from the reviewed catalog. Runtime editorial changes must be backed up separately with D1 export before re-import or restoration. D1 recovery availability depends on the account's actual free-tier limits.
