import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { canReview, editorIdentity, sameOrigin } from '../../../lib/admin-auth';
import { resourceKinds } from '../../../lib/types';
const input = z.object({
  name:z.string().trim().min(3).max(120),kind:z.enum(resourceKinds),source_url:z.url().startsWith('https://').max(500),
  summary_es:z.string().trim().min(20).max(2000),summary_en:z.string().trim().min(20).max(2000),
  organization:z.string().trim().max(120),year:z.union([z.literal(''),z.coerce.number().int().min(1900).max(2100)])
});
export const POST: APIRoute = async ({ request }) => {
  const identity = sameOrigin(request) ? await editorIdentity(request) : null;
  if (!canReview(identity)) return new Response('Forbidden', { status: 403 });
  const form = await request.formData();
  const parsed = input.safeParse(Object.fromEntries(['name','kind','source_url','summary_es','summary_en','organization','year'].map(key => [key,String(form.get(key)??'')])));
  if (!parsed.success) return new Response('Invalid record', { status: 400 });
  const record = parsed.data;
  const id=crypto.randomUUID();
  const slug=record.name.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80)+'-'+id.slice(0,8);
  const now=new Date().toISOString();
  const data=JSON.stringify({techniques:[],environments:[],tags:[],review_basis:'source-page',access_date:now.slice(0,10),source_title:record.name});
  await env.DB.batch([
    env.DB.prepare("INSERT INTO resources(id,slug,kind,name,summary_es,summary_en,organization,year,source_url,evidence,status,reviewed_at,updated_at,data,tags_text) VALUES(?,?,?,?,?,?,?,?,?,'Primary source awaiting editorial review','draft',?,?,?,'')").bind(id,slug,record.kind,record.name,record.summary_es,record.summary_en,record.organization,record.year||null,record.source_url,now.slice(0,10),now,data),
    env.DB.prepare('INSERT INTO sources(id,resource_id,url,title,accessed_at,review_basis,note) VALUES(?,?,?,?,?,?,?)').bind(id+':primary',id,record.source_url,record.name,now.slice(0,10),'source-page','Editor-created draft'),
    env.DB.prepare('INSERT INTO revisions(id,resource_id,actor,created_at,before_data,after_data,action) VALUES(?,?,?,?,?,?,?)').bind(crypto.randomUUID(),id,identity.id,now,null,data,'created-draft')
  ]);
  return Response.redirect(new URL('/es/editor',request.url),303);
};
