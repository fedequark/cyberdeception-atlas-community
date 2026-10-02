import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import { canReview, editorIdentity, sameOrigin } from '../../../lib/admin-auth';
export const POST:APIRoute=async({request})=>{
  const identity=sameOrigin(request)?await editorIdentity(request):null;
  if(!canReview(identity))return new Response('Forbidden',{status:403});
  const form=await request.formData();const id=String(form.get('id')??'');
  if(!/^[\da-f-]{36}$/.test(id))return new Response('Invalid event',{status:400});
  await env.DB.prepare("UPDATE monitoring_events SET status='reviewed' WHERE id=?").bind(id).run();
  return Response.redirect(new URL('/es/editor',request.url),303);
};
