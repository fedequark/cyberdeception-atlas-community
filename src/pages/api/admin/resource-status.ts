import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import { canPublish, editorIdentity, sameOrigin } from '../../../lib/admin-auth';

export const POST: APIRoute = async ({ request }) => {
  const identity = sameOrigin(request) ? await editorIdentity(request) : null;
  if (!canPublish(identity)) return new Response('Forbidden', { status: 403 });
  const form = await request.formData();
  const slug = String(form.get('slug') ?? '');
  const status = String(form.get('status') ?? '');
  const reason = String(form.get('reason') ?? '').trim().slice(0, 1000);
  if (!/^[a-z0-9-]{3,120}$/.test(slug) || !['published','archived'].includes(status) || reason.length < 10) {
    return new Response('Invalid action or missing reason', { status: 400 });
  }
  const before = await env.DB.prepare('SELECT id,status,data,updated_at FROM resources WHERE slug=?').bind(slug).first<{id:string;status:string;data:string;updated_at:string}>();
  if (!before) return new Response('Not found', { status: 404 });
  if (before.status === status) return new Response('Already in requested status', { status: 409 });
  if (identity.role !== 'owner') {
    const lastEdit = await env.DB.prepare("SELECT actor FROM revisions WHERE resource_id=? AND action IN ('created-draft','edited-draft') ORDER BY created_at DESC LIMIT 1").bind(before.id).first<{actor:string}>();
    if (!lastEdit || lastEdit.actor === identity.id) return new Response('Separate reviewer required', { status: 409 });
  }
  const now = new Date().toISOString();
  const revisionId = crypto.randomUUID();
  await env.DB.batch([
    env.DB.prepare('UPDATE resources SET status=?,updated_at=? WHERE id=? AND status=? AND updated_at=?').bind(status,now,before.id,before.status,before.updated_at),
    env.DB.prepare('INSERT INTO revisions(id,resource_id,actor,created_at,before_data,after_data,action) SELECT ?,?,?,?,?,?,? FROM resources WHERE id=? AND status=? AND updated_at=?').bind(revisionId,before.id,identity.id,now,JSON.stringify({status:before.status,data:before.data}),JSON.stringify({status,data:before.data,reason}),'status-change',before.id,status,now),
  ]);
  const recorded = await env.DB.prepare('SELECT id FROM revisions WHERE id=?').bind(revisionId).first();
  if (!recorded) return new Response('Record changed during review', { status: 409 });
  return Response.redirect(new URL('/es/editor',request.url),303);
};
