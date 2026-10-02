import type { Resource, ResourceKind } from './types';
import { dossiers } from '../../data/dossiers.mjs';

export interface BrowseFilters {
  q?: string;
  kind?: ResourceKind;
  environment?: string;
  technique?: string;
  critical?: boolean;
  reviewBasis?: string;
  sourceLanguage?: string;
  country?: string;
  page?: number;
  limit?: number;
}

export function ftsQuery(value: string): string | null {
  const terms =
    value
      .normalize('NFKC')
      .match(/[\p{L}\p{N}]{2,}/gu)
      ?.slice(0, 7) ?? [];
  return terms.length ? terms.map((t) => `"${t.replaceAll('"', '')}"*`).join(' AND ') : null;
}

export async function browseResources(
  db: D1Database,
  filters: BrowseFilters = {},
): Promise<{ items: Resource[]; total: number }> {
  const conditions = ["r.status = 'published'"];
  const params: Array<string | number> = [];
  const match = filters.q ? ftsQuery(filters.q) : null;
  if (match) {
    conditions.push('r.rowid IN (SELECT rowid FROM resource_search WHERE resource_search MATCH ?)');
    params.push(match);
  }
  if (filters.kind) {
    conditions.push('r.kind = ?');
    params.push(filters.kind);
  }
  if (filters.environment) {
    conditions.push("EXISTS (SELECT 1 FROM json_each(r.data,'$.environments') WHERE value = ?)");
    params.push(filters.environment);
  }
  if (filters.technique) {
    conditions.push("EXISTS (SELECT 1 FROM json_each(r.data,'$.techniques') WHERE value = ?)");
    params.push(filters.technique);
  }
  if (filters.critical) {
    const slugs = Object.keys(dossiers);
    conditions.push(`r.slug IN (${slugs.map(() => '?').join(',')})`);
    params.push(...slugs);
  }
  if (filters.reviewBasis) {
    conditions.push("json_extract(r.data,'$.review_basis') = ?");
    params.push(filters.reviewBasis);
  }
  if (filters.sourceLanguage) {
    conditions.push(
      "instr(lower(coalesce(json_extract(r.data,'$.source_language'),'')),lower(?)) > 0",
    );
    params.push(filters.sourceLanguage);
  }
  if (filters.country) {
    conditions.push("r.kind IN ('product','service')");
    conditions.push("json_extract(r.data,'$.organization_country') = ?");
    params.push(filters.country);
  }
  const where = conditions.join(' AND ');
  const limit = Math.min(Math.max(filters.limit ?? 24, 1), 100);
  const offset = (Math.max(filters.page ?? 1, 1) - 1) * limit;
  const count = await db
    .prepare(`SELECT count(*) AS total FROM resources r WHERE ${where}`)
    .bind(...params)
    .first<{ total: number }>();
  const rows = await db
    .prepare(
      `SELECT r.* FROM resources r WHERE ${where} ORDER BY r.year DESC, r.name COLLATE NOCASE ASC LIMIT ? OFFSET ?`,
    )
    .bind(...params, limit, offset)
    .all<Resource>();
  return { items: rows.results, total: count?.total ?? 0 };
}

export async function getResource(db: D1Database, slug: string): Promise<Resource | null> {
  return db
    .prepare("SELECT * FROM resources WHERE slug = ? AND status = 'published'")
    .bind(slug)
    .first<Resource>();
}

export async function relatedResources(db: D1Database, resource: Resource): Promise<Resource[]> {
  return (
    await db
      .prepare(
        "SELECT r.* FROM relationships x JOIN resources r ON r.id=x.to_id WHERE x.from_id=? AND r.status='published' ORDER BY r.year DESC LIMIT 8",
      )
      .bind(resource.id)
      .all<Resource>()
  ).results;
}

export async function catalogCounts(db: D1Database): Promise<{
  total: number;
  kinds: Record<string, number>;
  fullText: number;
  repositoryMetadata: number;
  critical: number;
}> {
  const criticalSlugs = Object.keys(dossiers);
  const [kinds, depth, critical] = await Promise.all([
    db
      .prepare("SELECT kind, count(*) AS n FROM resources WHERE status='published' GROUP BY kind")
      .all<{ kind: string; n: number }>(),
    db
      .prepare(
        "SELECT sum(CASE WHEN kind='paper' AND json_extract(data,'$.review_basis')='full-text' THEN 1 ELSE 0 END) AS fullText,sum(CASE WHEN json_extract(data,'$.review_basis')='repository-metadata' THEN 1 ELSE 0 END) AS repositoryMetadata FROM resources WHERE status='published'",
      )
      .first<{ fullText: number; repositoryMetadata: number }>(),
    db
      .prepare(
        `SELECT count(*) AS n FROM resources WHERE status='published' AND slug IN (${criticalSlugs.map(() => '?').join(',')})`,
      )
      .bind(...criticalSlugs)
      .first<{ n: number }>(),
  ]);
  const rows = kinds.results;
  return {
    total: rows.reduce((sum, row) => sum + row.n, 0),
    kinds: Object.fromEntries(rows.map((row) => [row.kind, row.n])),
    fullText: depth?.fullText ?? 0,
    repositoryMetadata: depth?.repositoryMetadata ?? 0,
    critical: critical?.n ?? 0,
  };
}

export interface CoverageSnapshot {
  techniques: Array<{ label: string; count: number }>;
  environments: Array<{ label: string; count: number; papers: number; fullTextPapers: number }>;
  depths: Array<{ label: string; count: number }>;
  unknown: {
    organizationCountry: number;
    sourceLanguage: number;
  };
  maintenance: { reviewedWithin90: number; linksChecked: number; brokenLinks: number };
}

export async function coverageSnapshot(db: D1Database): Promise<CoverageSnapshot> {
  const [techniques, environments, depths, unknown, maintenance] = await Promise.all([
    db
      .prepare(
        "SELECT j.value AS label,count(*) AS count FROM resources r,json_each(r.data,'$.techniques') j WHERE r.status='published' GROUP BY j.value ORDER BY count DESC,j.value",
      )
      .all<{ label: string; count: number }>(),
    db
      .prepare(
        "SELECT j.value AS label,count(*) AS count,sum(CASE WHEN r.kind='paper' THEN 1 ELSE 0 END) AS papers,sum(CASE WHEN r.kind='paper' AND json_extract(r.data,'$.review_basis')='full-text' THEN 1 ELSE 0 END) AS fullTextPapers FROM resources r,json_each(r.data,'$.environments') j WHERE r.status='published' GROUP BY j.value ORDER BY count DESC,j.value",
      )
      .all<{ label: string; count: number; papers: number; fullTextPapers: number }>(),
    db
      .prepare(
        "SELECT json_extract(data,'$.review_basis') AS label,count(*) AS count FROM resources WHERE status='published' GROUP BY label ORDER BY count DESC",
      )
      .all<{ label: string; count: number }>(),
    db
      .prepare(
        "SELECT sum(CASE WHEN kind IN ('product','service') AND coalesce(json_extract(data,'$.organization_country'),'') = '' THEN 1 ELSE 0 END) AS organizationCountry,sum(CASE WHEN coalesce(json_extract(data,'$.source_language'),'') = '' THEN 1 ELSE 0 END) AS sourceLanguage FROM resources WHERE status='published'",
      )
      .first<{
        organizationCountry: number;
        sourceLanguage: number;
      }>(),
    db
      .prepare(
        "SELECT sum(CASE WHEN date(r.reviewed_at)>=date('now','-90 days') THEN 1 ELSE 0 END) AS reviewedWithin90,sum(CASE WHEN m.checked_at IS NOT NULL THEN 1 ELSE 0 END) AS linksChecked,sum(CASE WHEN m.last_status IN (404,410) THEN 1 ELSE 0 END) AS brokenLinks FROM resources r LEFT JOIN monitored_sources m ON m.id='link:'||r.id WHERE r.status='published'",
      )
      .first<{ reviewedWithin90: number; linksChecked: number; brokenLinks: number }>(),
  ]);
  return {
    techniques: techniques.results,
    environments: environments.results,
    depths: depths.results,
    unknown: unknown ?? {
      organizationCountry: 0,
      sourceLanguage: 0,
    },
    maintenance: maintenance ?? { reviewedWithin90: 0, linksChecked: 0, brokenLinks: 0 },
  };
}

export async function topicKindCounts(
  db: D1Database,
  group: 'technique' | 'environment',
  label: string,
): Promise<Record<string, number>> {
  const path = group === 'technique' ? '$.techniques' : '$.environments';
  const rows = (
    await db
      .prepare(
        `SELECT r.kind, count(*) AS n FROM resources r WHERE r.status='published' AND EXISTS (SELECT 1 FROM json_each(r.data,'${path}') WHERE value=?) GROUP BY r.kind`,
      )
      .bind(label)
      .all<{ kind: string; n: number }>()
  ).results;
  return Object.fromEntries(rows.map((row) => [row.kind, row.n]));
}
