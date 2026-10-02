import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import { authenticateEditor, editorCookie, sameOrigin } from '../../../lib/admin-auth';

export const POST: APIRoute = async ({ request }) => {
  if (!sameOrigin(request)) return new Response('Forbidden', { status: 403 });
  const form = await request.formData();
  const secret = String(form.get('secret') ?? '');
  const date = new Date().toISOString().slice(0, 10);
  const ip = request.headers.get('cf-connecting-ip') ?? 'local';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${date}:login:${ip}`));
  const bucket = 'login:' + date + ':' + Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  const usage = await env.DB.prepare('INSERT INTO usage_limits(bucket,count,expires_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1 RETURNING count').bind(bucket, new Date(Date.now() + 86400000).toISOString()).first<{ count: number }>();
  if ((usage?.count ?? 1) > 10) return new Response('Too many login attempts', { status: 429 });
  const identity = await authenticateEditor(secret);
  if (!identity) return Response.redirect(new URL('/es/editor?error=1', request.url), 303);
  return new Response(null, { status: 303, headers: { Location: new URL('/es/editor', request.url).toString(), 'Set-Cookie': await editorCookie(request, undefined, identity.id) } });
};
