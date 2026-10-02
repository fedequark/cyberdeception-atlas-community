import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import { browseResources } from '../lib/catalog';
const esc=(value:string)=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export const GET:APIRoute=async()=>{
  const {items}=await browseResources(env.DB,{limit:30});
  const base='https://cyberdeceptionatlas.org';
  const xml=`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Cyberdeception Atlas</title><link>${base}/es/</link><description>Recursos revisados sobre cyberdeception</description>${items.map(r=>`<item><title>${esc(r.name)}</title><link>${base}/es/resource/${r.slug}</link><guid>${base}/es/resource/${r.slug}</guid><pubDate>${new Date(r.reviewed_at).toUTCString()}</pubDate><description>${esc(r.summary_es)}</description></item>`).join('')}</channel></rss>`;
  return new Response(xml,{headers:{'Content-Type':'application/rss+xml; charset=utf-8'}});
};
