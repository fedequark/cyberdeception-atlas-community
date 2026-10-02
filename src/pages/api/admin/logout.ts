import type { APIRoute } from 'astro';
import { clearEditorCookie, sameOrigin } from '../../../lib/admin-auth';
export const POST: APIRoute = async ({ request }) => {
  if (!sameOrigin(request)) return new Response('Forbidden', { status: 403 });
  return new Response(null, { status: 303, headers: { Location: new URL('/es/editor', request.url).toString(), 'Set-Cookie': clearEditorCookie() } });
};
