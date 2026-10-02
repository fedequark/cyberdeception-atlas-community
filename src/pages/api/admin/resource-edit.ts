import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { canReview, editorIdentity, sameOrigin } from '../../../lib/admin-auth';
import type { Resource } from '../../../lib/types';
const input = z.object({
  slug: z.string().regex(/^[a-z0-9-]{3,120}$/),
  name: z.string().trim().min(3).max(120),
  organization: z.string().trim().max(120),
  source_url: z.url().startsWith('https://').max(500),
  year: z.union([z.literal(''), z.coerce.number().int().min(1900).max(2100)]),
  summary_es: z.string().trim().min(20).max(2000),
  summary_en: z.string().trim().min(20).max(2000),
  evidence: z.string().trim().min(8).max(500),
  techniques: z.string().max(300),
  environments: z.string().max(300),
  organization_country: z.string().trim().max(80),
  deployment_regions: z.string().max(300),
  sectors: z.string().max(300),
  source_language: z.union([
    z.literal(''),
    z
      .string()
      .regex(/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/)
      .max(20),
  ]),
  review_basis: z.enum([
    'source-page',
    'repository-metadata',
    'publisher-metadata',
    'abstract',
    'full-text',
  ]),
  limitations_es: z.string().trim().max(2000),
  limitations_en: z.string().trim().max(2000),
});
export const POST: APIRoute = async ({ request }) => {
  const identity = sameOrigin(request) ? await editorIdentity(request) : null;
  if (!canReview(identity))
    return new Response('Forbidden', { status: 403 });
  const form = await request.formData();
  const parsed = input.safeParse(
    Object.fromEntries(
      [
        'slug',
        'name',
        'organization',
        'source_url',
        'year',
        'summary_es',
        'summary_en',
        'evidence',
        'techniques',
        'environments',
        'organization_country',
        'deployment_regions',
        'sectors',
        'source_language',
        'review_basis',
        'limitations_es',
        'limitations_en',
      ].map((key) => [key, String(form.get(key) ?? '')]),
    ),
  );
  if (!parsed.success) return new Response('Invalid record', { status: 400 });
  const value = parsed.data;
  const expectedUpdatedAt = String(form.get('expected_updated_at') ?? '');
  const before = await env.DB.prepare('SELECT * FROM resources WHERE slug=?')
    .bind(value.slug)
    .first<Resource>();
  if (!before) return new Response('Not found', { status: 404 });
  if (!expectedUpdatedAt || expectedUpdatedAt !== before.updated_at) return new Response('Record changed during review', { status: 409 });
  const now = new Date().toISOString();
  const data = JSON.parse(before.data) as Record<string, unknown>;
  const split = (text: string) =>
    [
      ...new Set(
        text
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean),
      ),
    ].slice(0, 15);
  const techniques = split(value.techniques),
    environments = split(value.environments);
  data.techniques = techniques;
  data.environments = environments;
  data.access_date = now.slice(0, 10);
  data.review_basis = value.review_basis;
  const optionalString = (key: string, text: string) => {
    if (text) data[key] = text;
    else delete data[key];
  };
  const optionalList = (key: string, text: string) => {
    const items = split(text);
    if (items.length) data[key] = items;
    else delete data[key];
  };
  optionalString('organization_country', value.organization_country);
  optionalString('source_language', value.source_language);
  optionalString('limitations_es', value.limitations_es);
  optionalString('limitations_en', value.limitations_en);
  optionalList('deployment_regions', value.deployment_regions);
  optionalList('sectors', value.sectors);
  const tags = [
    ...(Array.isArray(data.tags) ? data.tags : []),
    ...techniques,
    ...environments,
  ].join(' ');
  const after = {
    ...before,
    ...value,
    year: value.year || null,
    data: JSON.stringify(data),
    tags_text: tags,
    status: 'draft',
    reviewed_at: now.slice(0, 10),
    updated_at: now,
  };
  const revisionId = crypto.randomUUID();
  await env.DB.batch([
    env.DB.prepare(
      "UPDATE resources SET name=?,organization=?,source_url=?,year=?,summary_es=?,summary_en=?,evidence=?,data=?,tags_text=?,status='draft',reviewed_at=?,updated_at=? WHERE id=? AND updated_at=?",
    ).bind(
      after.name,
      after.organization,
      after.source_url,
      after.year,
      after.summary_es,
      after.summary_en,
      after.evidence,
      after.data,
      after.tags_text,
      after.reviewed_at,
      now,
      before.id,
      expectedUpdatedAt,
    ),
    env.DB.prepare(
      'UPDATE sources SET url=?,accessed_at=?,review_basis=? WHERE resource_id=? AND id=? AND EXISTS (SELECT 1 FROM resources WHERE id=? AND updated_at=?)',
    ).bind(
      after.source_url,
      now.slice(0, 10),
      value.review_basis,
      before.id,
      before.id + ':primary',
      before.id,
      now,
    ),
    env.DB.prepare(
      'INSERT INTO revisions(id,resource_id,actor,created_at,before_data,after_data,action) SELECT ?,?,?,?,?,?,? FROM resources WHERE id=? AND updated_at=?',
    ).bind(
      revisionId,
      before.id,
      identity.id,
      now,
      JSON.stringify(before),
      JSON.stringify(after),
      'edited-draft',
      before.id,
      now,
    ),
  ]);
  const recorded = await env.DB.prepare('SELECT id FROM revisions WHERE id=?').bind(revisionId).first();
  if (!recorded) return new Response('Record changed during review', { status: 409 });
  return Response.redirect(new URL('/es/editor', request.url), 303);
};
