import { env } from 'cloudflare:workers';
import { beforeEach, describe, expect, it } from 'vitest';
import { editorCookie } from '../src/lib/admin-auth';
import { POST as setStatus } from '../src/pages/api/admin/resource-status';
import { callRoute, clearDatabase, insertResource } from './helpers';

const secret = 'test-editor-secret-that-is-at-least-32-characters';
const url = 'https://atlas.test/api/admin/resource-status';
beforeEach(clearDatabase);

async function account(id: string, role: 'reviewer' | 'publisher'): Promise<string> {
  await env.DB.prepare('INSERT INTO editor_accounts(id,token_hash,role,created_at) VALUES(?,?,?,?)').bind(id,id.padEnd(64,'0'),role,'2026-10-02').run();
  return editorCookie(new Request(url), secret, id);
}

async function request(cookie: string, reason = 'Source and wording checked'): Promise<Response> {
  const form = new FormData();
  form.set('slug','sample-record');
  form.set('status','published');
  form.set('reason',reason);
  return callRoute(setStatus, new Request(url, { method:'POST', headers:{ origin:'https://atlas.test', cookie }, body:form }));
}

describe('editor roles and publication', () => {
  it('requires a distinct publisher and records the actor and reason', async () => {
    const id = await insertResource({ slug:'sample-record', status:'draft' });
    await env.DB.prepare('INSERT INTO revisions(id,resource_id,actor,created_at,before_data,after_data,action) VALUES(?,?,?,?,?,?,?)').bind('initial',id,'reviewer-a','2026-10-02',null,'{}','edited-draft').run();
    const reviewer = await account('reviewer-a','reviewer');
    const publisher = await account('publisher-b','publisher');
    expect((await request(reviewer)).status).toBe(403);
    const published = await request(publisher);
    expect(published.status, await published.text()).toBe(303);
    const revision = await env.DB.prepare("SELECT actor,after_data FROM revisions WHERE action='status-change'").first<{actor:string;after_data:string}>();
    expect(revision?.actor).toBe('publisher-b');
    expect(JSON.parse(revision!.after_data).reason).toBe('Source and wording checked');
  });

  it('rejects publication by the same account that edited the draft', async () => {
    const id = await insertResource({ slug:'sample-record', status:'draft' });
    await env.DB.prepare('INSERT INTO revisions(id,resource_id,actor,created_at,before_data,after_data,action) VALUES(?,?,?,?,?,?,?)').bind('initial',id,'publisher-a','2026-10-02',null,'{}','edited-draft').run();
    const publisher = await account('publisher-a','publisher');
    expect((await request(publisher)).status).toBe(409);
    expect((await env.DB.prepare('SELECT status FROM resources WHERE id=?').bind(id).first<{status:string}>())?.status).toBe('draft');
  });
});
