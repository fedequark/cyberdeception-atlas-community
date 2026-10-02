import { env } from 'cloudflare:workers';
import { beforeEach, describe, expect, it } from 'vitest';
import { editorCookie } from '../src/lib/admin-auth';
import { POST as decide } from '../src/pages/api/admin/submission';
import { callRoute, clearDatabase } from './helpers';

const url = 'https://atlas.test/api/admin/submission';
const secret = 'test-editor-secret-that-is-at-least-32-characters';
const id = '11111111-1111-4111-8111-111111111111';
beforeEach(clearDatabase);

async function request(actor: string, decision = 'rejected'): Promise<Response> {
  const form = new FormData();
  form.set('id', id);
  form.set('decision', decision);
  form.set('reason', 'Source does not support this claim');
  const cookie = await editorCookie(new Request(url), secret, actor);
  return callRoute(decide, new Request(url, { method:'POST', headers:{ origin:'https://atlas.test', cookie }, body:form }));
}

describe('editorial decisions', () => {
  it('records a reasoned reviewer rejection once', async () => {
    await env.DB.prepare('INSERT INTO submissions(id,name,url,kind,note,submitted_at) VALUES(?,?,?,?,?,?)').bind(id,'Example','https://example.com','paper','Check claim','2026-10-02').run();
    await env.DB.prepare('INSERT INTO editor_accounts(id,token_hash,role,created_at) VALUES(?,?,?,?)').bind('reviewer-a','a'.repeat(64),'reviewer','2026-10-02').run();
    expect((await request('reviewer-a')).status).toBe(303);
    const row = await env.DB.prepare('SELECT status,decision_reason,decided_by FROM submissions WHERE id=?').bind(id).first();
    expect(row).toMatchObject({ status:'rejected', decision_reason:'Source does not support this claim', decided_by:'reviewer-a' });
    expect((await request('reviewer-a')).status).toBe(409);
  });

  it('prevents a publisher from deciding submissions', async () => {
    await env.DB.prepare('INSERT INTO submissions(id,name,url,kind,note,submitted_at) VALUES(?,?,?,?,?,?)').bind(id,'Example','https://example.com','paper','Check claim','2026-10-02').run();
    await env.DB.prepare('INSERT INTO editor_accounts(id,token_hash,role,created_at) VALUES(?,?,?,?)').bind('publisher-a','b'.repeat(64),'publisher','2026-10-02').run();
    expect((await request('publisher-a')).status).toBe(403);
  });
});
