import { env } from 'cloudflare:workers';
import { beforeEach, describe, expect, it } from 'vitest';
import { editorCookie } from '../src/lib/admin-auth';
import { POST as edit } from '../src/pages/api/admin/resource-edit';
import { callRoute, clearDatabase, insertResource } from './helpers';

beforeEach(clearDatabase);

async function submit(expectedUpdatedAt: string): Promise<Response> {
  const url = 'https://atlas.test/api/admin/resource-edit';
  const form = new FormData();
  for (const [key,value] of Object.entries({
    slug:'sample-record', expected_updated_at:expectedUpdatedAt, name:'Revised example record', organization:'Test Org', source_url:'https://example.com/revised', year:'2026', summary_es:'Resumen actualizado con fuente.', summary_en:'Updated summary with a source.', evidence:'Primary source', techniques:'Honeypot', environments:'Network', organization_country:'', deployment_regions:'', sectors:'', source_language:'en', review_basis:'source-page', limitations_es:'', limitations_en:'',
  })) form.set(key,value);
  const cookie = await editorCookie(new Request(url), 'test-editor-secret-that-is-at-least-32-characters');
  return callRoute(edit, new Request(url, { method:'POST', headers:{ origin:'https://atlas.test', cookie }, body:form }));
}

describe('optimistic editorial editing', () => {
  it('rejects a stale form without changing the resource', async () => {
    const id = await insertResource({ slug:'sample-record' });
    expect((await submit('stale')).status).toBe(409);
    expect((await env.DB.prepare('SELECT status FROM resources WHERE id=?').bind(id).first<{status:string}>())?.status).toBe('published');
  });

  it('moves a current edit to draft and records its actor', async () => {
    const id = await insertResource({ slug:'sample-record' });
    const before = await env.DB.prepare('SELECT updated_at FROM resources WHERE id=?').bind(id).first<{updated_at:string}>();
    expect((await submit(before!.updated_at)).status).toBe(303);
    const resource = await env.DB.prepare('SELECT status,name FROM resources WHERE id=?').bind(id).first<{status:string;name:string}>();
    expect(resource).toMatchObject({ status:'draft', name:'Revised example record' });
    const revision = await env.DB.prepare("SELECT actor FROM revisions WHERE resource_id=? AND action='edited-draft'").bind(id).first<{actor:string}>();
    expect(revision?.actor).toBe('owner');
  });
});
