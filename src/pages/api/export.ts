import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import { browseResources } from '../../lib/catalog';
import { parseData, resourceKinds, type ResourceKind } from '../../lib/types';
import { dossiers } from '../../../data/dossiers.mjs';
const csvField = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const dataLicense = {
  id: 'CC-BY-4.0',
  url: 'https://creativecommons.org/licenses/by/4.0/',
  scope:
    'Original Cyberdeception Atlas summaries, classifications and critical-reading notes; linked third-party sources retain their own rights.',
};
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const format = url.searchParams.get('format') ?? 'json';
  if (!['json', 'csv', 'bibtex'].includes(format))
    return new Response('Invalid format', { status: 400 });
  const k = url.searchParams.get('kind');
  const kind = resourceKinds.includes(k as ResourceKind) ? (k as ResourceKind) : undefined;
  const query = (url.searchParams.get('q') ?? '').slice(0, 120);
  const requestedPage = url.searchParams.get('page');
  const first = await browseResources(env.DB, {
    q: query,
    kind,
    limit: 100,
    page: requestedPage ? Math.max(Number(requestedPage) || 1, 1) : 1,
  });
  const items = [...first.items];
  const total = first.total;
  if (!requestedPage) {
    for (let page = 2; items.length < total && page <= 5; page++) {
      items.push(...(await browseResources(env.DB, { q: query, kind, limit: 100, page })).items);
    }
  }
  const publicItems = items.map((r) => {
    const data = parseData(r);
    const note = dossiers[r.slug];
    return {
      id: r.id,
      slug: r.slug,
      kind: r.kind,
      name: r.name,
      summary_es: r.summary_es,
      summary_en: r.summary_en,
      organization: r.organization,
      year: r.year,
      source_url: r.source_url,
      evidence: r.evidence,
      reviewed_at: r.reviewed_at,
      techniques: data.techniques,
      environments: data.environments,
      doi: data.doi ?? null,
      review_basis: data.review_basis,
      full_text_reviewed_at: data.full_text_reviewed_at ?? null,
      design_es: data.design_es ?? null,
      design_en: data.design_en ?? null,
      finding_es: data.finding_es ?? null,
      finding_en: data.finding_en ?? null,
      evidence_limits_es: data.limits_es ?? null,
      evidence_limits_en: data.limits_en ?? null,
      organization_country:
        r.kind === 'product' || r.kind === 'service' ? (data.organization_country ?? null) : null,
      source_language: data.source_language ?? null,
      critical_reading: Boolean(note),
      critical_reviewed_at: note?.reviewed_at ?? null,
      critical_observation_es: note?.observation_es ?? null,
      critical_observation_en: note?.observation_en ?? null,
      limitations_es: data.limitations_es ?? note?.limitations_es ?? null,
      limitations_en: data.limitations_en ?? note?.limitations_en ?? null,
      question_es: note?.question_es ?? null,
      question_en: note?.question_en ?? null,
    };
  });
  let releaseVersion = 'v2026.09.2';
  try {
    const state = await env.DB.prepare(
      'SELECT version FROM release_state WHERE singleton=1',
    ).first<{ version: string }>();
    if (state?.version) releaseVersion = state.version;
  } catch {
    // Existing deployments can serve the historical release before migration 0005.
  }
  if (format === 'json')
    return Response.json({
      version: releaseVersion,
      license: dataLicense,
      total,
      items: publicItems,
    });
  if (format === 'csv') {
    const columns = [
      'id',
      'kind',
      'name',
      'organization',
      'year',
      'source_url',
      'reviewed_at',
      'review_basis',
      'full_text_reviewed_at',
      'doi',
      'summary_es',
      'summary_en',
      'design_es',
      'design_en',
      'finding_es',
      'finding_en',
      'evidence_limits_es',
      'evidence_limits_en',
      'organization_country',
      'source_language',
      'critical_reading',
      'critical_reviewed_at',
      'critical_observation_es',
      'critical_observation_en',
      'limitations_es',
      'limitations_en',
      'question_es',
      'question_en',
    ] as const;
    const csv = [
      columns.join(','),
      ...publicItems.map((item) => columns.map((key) => csvField(item[key])).join(',')),
    ].join('\r\n');
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="cyberdeception-catalog.csv"',
        'X-Data-License': dataLicense.id,
        Link: `<${dataLicense.url}>; rel="license"`,
      },
    });
  }
  const bib = items
    .filter((r) => r.kind === 'paper')
    .map((r) => {
      const data = parseData(r);
      const key = (data.doi ?? r.slug).replace(/[^a-zA-Z0-9]/g, '_');
      return `@misc{${key},\n  title={${r.name.replace(/[{}]/g, '')}},\n  year={${r.year ?? ''}},\n  url={${r.source_url}},\n  note={Cyberdeception Atlas catalog; reviewed ${r.reviewed_at}}\n}`;
    })
    .join('\n\n');
  return new Response(bib + '\n', {
    headers: {
      'Content-Type': 'application/x-bibtex; charset=utf-8',
      'Content-Disposition': 'attachment; filename="cyberdeception-bibliography.bib"',
      'X-Data-License': dataLicense.id,
      Link: `<${dataLicense.url}>; rel="license"`,
    },
  });
};
