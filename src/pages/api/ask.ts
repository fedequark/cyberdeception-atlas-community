import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import { browseResources } from '../../lib/catalog';
import { sameOrigin } from '../../lib/admin-auth';

export const POST: APIRoute = async ({request}) => {
  if (!sameOrigin(request)) return new Response('Forbidden',{status:403});
  let body:unknown;
  try { body=await request.json(); } catch { return new Response('Invalid JSON',{status:400}); }
  const input=body as {question?:unknown;lang?:unknown};
  const question=typeof input.question==='string'?input.question.trim().slice(0,300):'';
  const lang=input.lang==='en'?'en':'es';
  if(question.length<8)return new Response('Question too short',{status:400});
  let {items}=await browseResources(env.DB,{q:question,limit:5});
  if(!items.length){
    const terms=(question.normalize('NFKC').match(/[\p{L}\p{N}]{3,}/gu)??[]).filter(term=>!['what','which','there','about','para','que','hay','sobre','los','las','cómo','como','herramientas','tools'].includes(term.toLowerCase())).slice(-5);
    const seen=new Set<string>();
    for(const term of terms){
      const found=(await browseResources(env.DB,{q:term,limit:5})).items;
      for(const resource of found){if(!seen.has(resource.id)){items.push(resource);seen.add(resource.id);}}
      if(items.length>=5)break;
    }
    items=items.slice(0,5);
  }
  const sources=items.map(r=>({name:r.name,url:r.source_url,summary:lang==='es'?r.summary_es:r.summary_en,evidence:r.evidence,reviewed_at:r.reviewed_at}));
  if(!items.length)return Response.json({answer:lang==='es'?'No encontré fichas que respondan directamente. Probá con otra técnica o revisá el catálogo.':'No directly relevant records found. Try another technique or browse the catalog.',sources,mode:'search'});
  const fallback=lang==='es'?'Estas son las fuentes encontradas. Revisá cada ficha y su nivel de evidencia antes de sacar conclusiones.':'These are the retrieved sources. Review each record and its evidence level before drawing conclusions.';
  if(String(env.AI_ENABLED)!=='true')return Response.json({answer:fallback,sources,mode:'search'});
  const date=new Date().toISOString().slice(0,10);
  const ip=request.headers.get('cf-connecting-ip')??'local';
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${date}:ask:${ip}`));
  const client='ask:'+date+':'+Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  const expiry=new Date(Date.now()+86400000).toISOString();
  const limits=await env.DB.batch([
    env.DB.prepare('INSERT INTO usage_limits(bucket,count,expires_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1 RETURNING count').bind('ask:global:'+date,expiry),
    env.DB.prepare('INSERT INTO usage_limits(bucket,count,expires_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1 RETURNING count').bind(client,expiry)
  ]);
  const globalCount=(limits[0].results[0] as {count:number}|undefined)?.count??1;
  const clientCount=(limits[1].results[0] as {count:number}|undefined)?.count??1;
  if(globalCount>Math.min(Number(env.AI_DAILY_LIMIT)||20,40)||clientCount>3)return Response.json({answer:fallback,sources,mode:'quota'});
  const context=sources.map((s,i)=>`[${i+1}] ${s.name}\nURL: ${s.url}\nRecord: ${s.summary}\nReview: ${s.evidence}`).join('\n\n').slice(0,4500);
  try {
    const result=await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8',{
      messages:[{role:'system',content:`Answer in ${lang==='es'?'Spanish':'English'} using only the supplied catalog records. Cite sources by [number]. If the records do not support a claim, say so. Distinguish vendor claims from independently reviewed findings. Keep it under 180 words.`},{role:'user',content:`Question: ${question}\n\nCatalog records:\n${context}`}],max_tokens:280
    });
    const answer=typeof result==='object'&&result!==null&&'response' in result?String(result.response):fallback;
    return Response.json({answer,sources,mode:'ai'});
  } catch {
    return Response.json({answer:fallback,sources,mode:'quota'});
  }
};
