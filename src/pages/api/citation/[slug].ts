import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import { getResource } from '../../../lib/catalog';
import { parseData } from '../../../lib/types';

const clean = (value: string) => value.replace(/[\r\n{}]/g, ' ').trim();
export const GET: APIRoute = async ({ params, request }) => {
  const resource = await getResource(env.DB, params.slug ?? '');
  if (!resource) return new Response('Not found', { status: 404 });
  const format = new URL(request.url).searchParams.get('format') ?? 'ris';
  if (!['ris', 'bibtex'].includes(format)) return new Response('Invalid format', { status: 400 });
  const data = parseData(resource);
  const name = clean(resource.name);
  const organization = clean(resource.organization);
  const source = clean(resource.source_url);
  const year = resource.year ? String(resource.year) : '';
  const doi = data.doi ? clean(data.doi) : '';
  if (format === 'ris') {
    const text = [
      `TY  - ${resource.kind === 'paper' ? 'JOUR' : resource.kind === 'software' ? 'COMP' : 'ELEC'}`,
      `TI  - ${name}`, `PB  - ${organization}`,
      ...(year ? [`PY  - ${year}`] : []), `UR  - ${source}`,
      ...(doi ? [`DO  - ${doi}`] : []),
      `N1  - Cyberdeception Atlas catalog record; review basis: ${clean(data.review_basis)}; reviewed: ${resource.reviewed_at}`,
      'ER  -'
    ].join('\r\n') + '\r\n';
    return new Response(text, { headers: { 'Content-Type': 'application/x-research-info-systems; charset=utf-8', 'Content-Disposition': `attachment; filename="${resource.slug}.ris"` } });
  }
  const key = clean(resource.slug).replace(/[^a-zA-Z0-9_]/g, '_');
  const bib = `@misc{${key},\n  title={${name}},\n  howpublished={${organization}},\n  year={${year}},\n  url={${source}},\n  note={Cyberdeception Atlas catalog record; review basis: ${clean(data.review_basis)}; reviewed ${resource.reviewed_at}}${doi ? `,\n  doi={${doi}}` : ''}\n}\n`;
  return new Response(bib, { headers: { 'Content-Type': 'application/x-bibtex; charset=utf-8', 'Content-Disposition': `attachment; filename="${resource.slug}.bib"` } });
};
