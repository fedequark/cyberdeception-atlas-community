import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import { canReview, editorIdentity, sameOrigin } from '../../../lib/admin-auth';
export const POST: APIRoute = async ({ request }) => {
  const identity = sameOrigin(request) ? await editorIdentity(request) : null;
  if (!canReview(identity)) return new Response('Forbidden', { status: 403 });
  const form = await request.formData();
  const id = String(form.get('id') ?? '');
  const status = String(form.get('decision') ?? '');
  const reason = String(form.get('reason') ?? '').trim().slice(0, 1000);
  if (!/^[\da-f-]{36}$/.test(id) || !['accepted','rejected'].includes(status) || reason.length < 10) return new Response('Invalid decision or missing reason', { status: 400 });
  const result = await env.DB.prepare("UPDATE submissions SET status=?,decision_reason=?,decided_by=?,decided_at=? WHERE id=? AND status='pending'").bind(status,reason,identity.id,new Date().toISOString(),id).run();
  if (result.meta.changes !== 1) return new Response('Submission already decided', { status: 409 });
  return Response.redirect(new URL('/es/editor', request.url), 303);
};
