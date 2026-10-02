import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import { sameOrigin } from '../../lib/admin-auth';
import { resourceKinds, type ResourceKind } from '../../lib/types';

const proposalTypes = ['correction','new-record','paper-review','software-update','translation','evaluation','reproduction'] as const;

export const POST: APIRoute = async ({ request }) => {
  if (!sameOrigin(request)) return new Response('Forbidden',{status:403});
  const body = await request.formData();
  const lang = body.get('lang')==='en'?'en':'es';
  if (body.get('site')) return Response.redirect(new URL(`/${lang}/contribute?sent=1`,request.url),303);
  const name=String(body.get('name')??'').trim().slice(0,120);
  const source=String(body.get('url')??'').trim().slice(0,500);
  const kind=String(body.get('kind')??'') as ResourceKind;
  const note=String(body.get('note')??'').trim().slice(0,2000);
  const proposalType=String(body.get('proposal_type')??'');
  const locator=String(body.get('source_locator')??'').trim().slice(0,300);
  const interest=String(body.get('interest')??'').trim().slice(0,500);
  const creditChoice=String(body.get('credit_choice')??'');
  const creditName=String(body.get('credit_name')??'').trim().slice(0,120);
  const aiAssisted=body.get('ai_assisted')==='on'?1:0;
  let parsed:URL;
  try { parsed=new URL(source); } catch { return new Response('Invalid source URL',{status:400}); }
  if(name.length<3||!resourceKinds.includes(kind)||parsed.protocol!=='https:'||!proposalTypes.includes(proposalType as typeof proposalTypes[number])||!['anonymous','name','pseudonym'].includes(creditChoice)||((creditChoice==='name'||creditChoice==='pseudonym')&&creditName.length<2))return new Response('Invalid submission',{status:400});
  const date=new Date().toISOString().slice(0,10);
  const ip=request.headers.get('cf-connecting-ip')??'anonymous';
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${date}:submit:${ip}`));
  const bucket='submit:'+date+':'+Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
  const expires=new Date(Date.now()+86400000).toISOString();
  const usage=await env.DB.prepare('INSERT INTO usage_limits(bucket,count,expires_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1 RETURNING count').bind(bucket,expires).first<{count:number}>();
  if((usage?.count??1)>3)return new Response('Submission limit reached',{status:429});
  await env.DB.prepare('INSERT INTO submissions(id,name,url,kind,note,submitted_at,proposal_type,source_locator,interest,credit_choice,credit_name,ai_assisted) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),name,parsed.toString(),kind,note,new Date().toISOString(),proposalType,locator,interest,creditChoice,creditName,aiAssisted).run();
  return Response.redirect(new URL(`/${lang}/contribute?sent=1`,request.url),303);
};
