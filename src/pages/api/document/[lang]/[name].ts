import type { APIRoute } from 'astro';
import { documents } from '../../../../lib/documents';
import { getDocument } from '../../../../lib/document-source';
export const GET:APIRoute=async({params})=>{
  const lang=params.lang==='en'?'en':'es';
  const slug=(params.name??'').replace(/\.md$/,'');
  if(!documents.some(item=>item.slug===slug))return new Response('Not found',{status:404});
  const content=getDocument(slug,lang);
  if(!content)return new Response('Not found',{status:404});
  return new Response(content,{headers:{'Content-Type':'text/markdown; charset=utf-8','Content-Disposition':`attachment; filename="cyberdeception-${slug}-${lang}.md"`}});
};
