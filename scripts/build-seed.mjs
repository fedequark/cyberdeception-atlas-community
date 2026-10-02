import { writeFile } from 'node:fs/promises';
import { catalog, relationships } from '../data/catalog.mjs';
import { ownerSecondarySources } from '../data/owner-catalog.mjs';
const sqlString = value => `'${String(value ?? '').replaceAll("'", "''")}'`;
const statements = [];
for (const resource of catalog) {
  const json = JSON.stringify(resource.data);
  const tags = [...resource.data.tags,...resource.data.techniques,...resource.data.environments].join(' ');
  statements.push(`INSERT OR IGNORE INTO resources(id,slug,kind,name,summary_es,summary_en,organization,year,source_url,evidence,status,reviewed_at,updated_at,data,tags_text) VALUES(${[resource.id,resource.slug,resource.kind,resource.name,resource.summary_es,resource.summary_en,resource.organization,resource.year,resource.source_url,resource.evidence,resource.status,resource.reviewed_at,resource.updated_at,json,tags].map((x,i)=>i===7 ? x===null?'NULL':String(x) : sqlString(x)).join(',')});`);
  statements.push(`INSERT OR IGNORE INTO sources(id,resource_id,url,title,accessed_at,review_basis,note) VALUES(${[`${resource.id}:primary`,resource.id,resource.source_url,resource.data.source_title,resource.data.access_date,resource.data.review_basis,''].map(sqlString).join(',')});`);
  for (const source of ownerSecondarySources[resource.id] ?? []) {
    statements.push(`INSERT OR IGNORE INTO sources(id,resource_id,url,title,accessed_at,review_basis,note) VALUES(${[`${resource.id}:${source.key}`,resource.id,source.url,source.title,resource.data.access_date,source.basis,'Related original source'].map(sqlString).join(',')});`);
  }
  if (resource.data.disclosure_es) {
    statements.push(`UPDATE resources SET data=json_set(data,'$.disclosure_es',${sqlString(resource.data.disclosure_es)},'$.disclosure_en',${sqlString(resource.data.disclosure_en)}) WHERE id=${sqlString(resource.id)} AND json_extract(data,'$.disclosure_es') IS NULL;`);
  }
  for (const field of ['organization_country','source_language','deployment_regions']) {
    const value=resource.data[field];
    if (value == null) continue;
    const encoded=Array.isArray(value) ? `json(${sqlString(JSON.stringify(value))})` : sqlString(value);
    statements.push(`UPDATE resources SET data=json_set(data,'$.${field}',${encoded}) WHERE id=${sqlString(resource.id)} AND json_extract(data,'$.${field}') IS NULL;`);
  }
  if (resource.data.review_basis === 'full-text' && resource.data.full_text_reviewed_at) {
    if (resource.data.full_text_reviewed_at === '2026-10-02' && resource.data.prior_summary_es) {
      // Upgrade a pre-existing metadata record only when its prior editorial summary still matches.
      statements.push(`UPDATE resources SET summary_es=${sqlString(resource.summary_es)},summary_en=${sqlString(resource.summary_en)},data=json_set(data,'$.review_basis','full-text','$.limitations_es',${sqlString(resource.data.limits_es)},'$.limitations_en',${sqlString(resource.data.limits_en)},'$.full_text_source_url',${sqlString(resource.data.full_text_source_url)},'$.page_anchors',json(${sqlString(JSON.stringify(resource.data.page_anchors))}),'$.provenance_note_es',${sqlString(resource.data.provenance_note_es)},'$.provenance_note_en',${sqlString(resource.data.provenance_note_en)},'$.extraction_status',${sqlString(resource.data.extraction_status)},'$.adjudication_status',${sqlString(resource.data.adjudication_status)}) WHERE id=${sqlString(resource.id)} AND summary_es=${sqlString(resource.data.prior_summary_es)} AND json_extract(data,'$.review_basis')!='full-text';`);
    }
    const currentReviewGuard = resource.data.full_text_reviewed_at === '2026-10-02' ? " AND json_extract(data,'$.review_basis')='full-text'" : '';
    statements.push(`UPDATE resources SET evidence='full-text-review',reviewed_at=${sqlString(resource.reviewed_at)},updated_at=${sqlString(resource.updated_at)},data=json_set(data,'$.review_basis','full-text','$.design_es',${sqlString(resource.data.design_es)},'$.design_en',${sqlString(resource.data.design_en)},'$.finding_es',${sqlString(resource.data.finding_es)},'$.finding_en',${sqlString(resource.data.finding_en)},'$.limits_es',${sqlString(resource.data.limits_es)},'$.limits_en',${sqlString(resource.data.limits_en)},'$.full_text_reviewed_at',${sqlString(resource.data.full_text_reviewed_at)}) WHERE id=${sqlString(resource.id)}${currentReviewGuard};`);
    statements.push(`UPDATE sources SET review_basis='full-text',accessed_at=${sqlString(resource.data.full_text_reviewed_at)} WHERE id=${sqlString(`${resource.id}:primary`)}${resource.data.full_text_reviewed_at === '2026-10-02' ? ` AND EXISTS(SELECT 1 FROM resources WHERE id=${sqlString(resource.id)} AND json_extract(data,'$.review_basis')='full-text')` : ''};`);
    if (resource.data.full_text_source_url) statements.push(`INSERT OR IGNORE INTO sources(id,resource_id,url,title,accessed_at,review_basis,note) SELECT ${[`${resource.id}:reviewed-full-text`,resource.id,resource.data.full_text_source_url,'Full text examined for Atlas review',resource.data.full_text_reviewed_at,'full-text','Single-reviewer source-bounded reading; see record locators'].map(sqlString).join(',')} WHERE EXISTS(SELECT 1 FROM resources WHERE id=${sqlString(resource.id)} AND json_extract(data,'$.review_basis')='full-text');`);
  }
}
for (const [from,to,relation] of relationships) statements.push(`INSERT OR IGNORE INTO relationships(from_id,to_id,relation) VALUES(${[from,to,relation].map(sqlString).join(',')});`);
await writeFile('data/seed.sql', statements.join('\n')+'\n');
console.log(JSON.stringify({ statements: statements.length, resources: catalog.length }));
