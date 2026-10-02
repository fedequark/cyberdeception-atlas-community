import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import type { ResourceKind } from '../src/lib/types';

let sequence = 0;

export async function clearDatabase(): Promise<void> {
  await env.DB.batch([
    env.DB.prepare('DELETE FROM monitoring_events'),
    env.DB.prepare('DELETE FROM monitored_sources'),
    env.DB.prepare('DELETE FROM usage_limits'),
    env.DB.prepare('DELETE FROM revisions'),
    env.DB.prepare('DELETE FROM editor_accounts'),
    env.DB.prepare('DELETE FROM submissions'),
    env.DB.prepare('DELETE FROM relationships'),
    env.DB.prepare('DELETE FROM sources'),
    env.DB.prepare('DELETE FROM resources'),
  ]);
}

export async function insertResource(overrides: {
  id?: string;
  slug?: string;
  kind?: ResourceKind;
  name?: string;
  status?: 'draft' | 'review' | 'published' | 'archived';
  year?: number;
  techniques?: string[];
  environments?: string[];
  data?: Record<string, unknown>;
} = {}): Promise<string> {
  sequence += 1;
  const id = overrides.id ?? `resource-${sequence}`;
  const slug = overrides.slug ?? id;
  const name = overrides.name ?? `Resource ${sequence}`;
  const data = {
    techniques: overrides.techniques ?? ['Honeypot'],
    environments: overrides.environments ?? ['Network'],
    tags: ['test'],
    review_basis: 'source-page',
    access_date: '2026-09-16',
    ...overrides.data,
  };
  await env.DB.prepare('INSERT INTO resources(id,slug,kind,name,summary_es,summary_en,organization,year,source_url,evidence,status,reviewed_at,updated_at,data,tags_text) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
    .bind(id, slug, overrides.kind ?? 'software', name, `Resumen ${name}`, `Summary ${name}`, 'Test Org', overrides.year ?? 2026, `https://example.com/${slug}`, 'Primary source', overrides.status ?? 'published', '2026-09-16', '2026-09-16', JSON.stringify(data), 'test honeypot')
    .run();
  return id;
}

export async function callRoute(route: APIRoute, request: Request): Promise<Response> {
  const handler = route as (context: { request: Request }) => Response | Promise<Response>;
  return handler({ request });
}

export async function quotaBucket(scope: 'ask' | 'submit' | 'login', ip: string): Promise<string> {
  const date = new Date().toISOString().slice(0, 10);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${date}:${scope}:${ip}`));
  return `${scope}:${date}:` + Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}
