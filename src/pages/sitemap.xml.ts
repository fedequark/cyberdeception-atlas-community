import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { documents } from '../lib/documents';
import { topics } from '../lib/topics';

const escapeXml=(text:string)=>text.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]??char));
export const GET:APIRoute=async()=>{
  const origin='https://cyberdeceptionatlas.org';
  const records=(await env.DB.prepare("SELECT slug, updated_at FROM resources WHERE status='published' ORDER BY slug LIMIT 5000").all<{slug:string;updated_at:string}>()).results;
  const paths=['','topics','library','evidence','solutions','practice','coverage','methodology','editorial-policy','assistant','contribute','downloads',
    ...topics.map(topic=>`topics/${topic.slug}`),
    ...documents.map(doc=>`research/${doc.slug}`)];
  const entries:string[]=[];
  for(const lang of ['es','en']){
    for(const path of paths)entries.push(`<url><loc>${escapeXml(`${origin}/${lang}/${path}`)}</loc></url>`);
    for(const record of records)entries.push(`<url><loc>${escapeXml(`${origin}/${lang}/resource/${record.slug}`)}</loc><lastmod>${escapeXml(record.updated_at.slice(0,10))}</lastmod></url>`);
  }
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=3600'}});
};
