import { catalog, relationships } from '../data/catalog.mjs';
import { dossiers } from '../data/dossiers.mjs';
const kinds = new Set(['product','service','paper','software','case-study','dataset','framework','community']);
const slugs = new Set();
const urls = new Set();
const errors = [];
for (const resource of catalog) {
  if (slugs.has(resource.slug)) errors.push(`Duplicate slug: ${resource.slug}`);
  slugs.add(resource.slug);
  const urlKey=resource.source_url.toLowerCase();
  if(urls.has(urlKey))errors.push(`Duplicate source URL: ${resource.slug}`);
  urls.add(urlKey);
  if (!kinds.has(resource.kind)) errors.push(`Unknown kind: ${resource.slug}`);
  if (!/^https:\/\//.test(resource.source_url)) errors.push(`Invalid source: ${resource.slug}`);
  if (!resource.summary_es || !resource.summary_en || !resource.reviewed_at) errors.push(`Incomplete: ${resource.slug}`);
  if (!resource.data?.review_basis || !resource.data?.access_date) errors.push(`Missing provenance: ${resource.slug}`);
  if (resource.data?.review_basis === 'full-text') {
    for (const field of ['design_es','design_en','finding_es','finding_en','limits_es','limits_en','full_text_reviewed_at','extraction_status','adjudication_status','page_anchors']) {
      if (resource.data[field] == null) errors.push(`Incomplete full-text provenance (${field}): ${resource.slug}`);
    }
    const activeText = [resource.summary_es, resource.summary_en, resource.data.limitations_es, resource.data.limitations_en].filter(Boolean).join(' ');
    if (/full[- ]text (?:was )?not (?:analy[sz]ed|reviewed)|texto completo.*no (?:se )?(?:analiz|revis)|findings still require review|resultados aún requieren lectura/i.test(activeText)) {
      errors.push(`Contradictory active full-text text: ${resource.slug}`);
    }
  }
}
for (const [from,to] of relationships) if (!slugs.has(from) || !slugs.has(to)) errors.push(`Broken relationship: ${from} -> ${to}`);
for (const [slug,note] of Object.entries(dossiers)) {
  if (!slugs.has(slug)) errors.push(`Unknown dossier resource: ${slug}`);
  if (!note.observation_es || !note.observation_en || !note.limitations_es || !note.limitations_en || !note.question_es || !note.question_en || !note.reviewed_at) errors.push(`Incomplete dossier: ${slug}`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(JSON.stringify({ validated: catalog.length, kinds: Object.fromEntries([...kinds].map(kind=>[kind,catalog.filter(r=>r.kind===kind).length])) }));
