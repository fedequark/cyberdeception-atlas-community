// Local typed contract and round-trip for retained pilot observations.
// Does not mutate the pilot, release, or estimate reporting effectiveness.
import Ajv from 'ajv';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const out = new URL('docs/paper/multi-ai-review-2026-09-26/derived/', root);
const input = new URL('experiments/http-decoy-pilot-v1/results/observations.csv', root);
const raw = await readFile(input, 'utf8');
function parseCsv(text) {
  const rows=[]; let row=[], cell='', quoted=false;
  for (let i=0;i<text.length;i++) {
    const c=text[i];
    if (c==='"') { if (quoted && text[i+1]==='"') { cell+='"'; i++; } else quoted=!quoted; }
    else if (!quoted && (c===',' || c==='\n')) { row.push(cell); cell=''; if(c==='\n'){ rows.push(row);row=[]; } }
    else if (!(c==='\r' && !quoted)) cell+=c;
  }
  assert(!quoted,'Unclosed CSV quote');
  if(cell || row.length){row.push(cell);rows.push(row);}
  return rows;
}
const table=parseCsv(raw), fields=table[0];
const bools=['alert_received','alert_investigable','legitimate_action','decoy_detected','safety_incident'];
const nums=['latency_ms','installation_hours','maintenance_hours','investigation_hours'];
const nullable=new Set(['alert_time_utc','decoy_detected',...nums,'source_url','notes']);
const properties=Object.fromEntries(fields.map(f=>[f,{type: nullable.has(f) ? [bools.includes(f)?'boolean':nums.includes(f)?'number':'string','null'] : bools.includes(f)?'boolean':f==='http_status'?'integer':'string'}]));
properties.condition.enum=['baseline','intervention']; properties.scenario_class.enum=['decoy','benign'];
properties.http_status.minimum=100; properties.http_status.maximum=599;
for(const f of nums) properties[f].minimum=0;
const schema={$schema:'http://json-schema.org/draft-07/schema#',title:'Atlas local observation contract v1, 2026-09-26',description:'New local contract for decoded observations, outside frozen v2026.09.2. CSV blank denotes null, booleans use true/false. No semantic or cross-tool validation implied.',type:'object',additionalProperties:false,required:fields,properties};
const validate=new Ajv({allErrors:true}).compile(schema);
function decode(row){
  assert.equal(row.length,fields.length,'Column count');
  return Object.fromEntries(fields.map((f,i)=>{
    const v=row[i];
    if(v==='') return [f,null];
    if(bools.includes(f)){assert(['true','false'].includes(v),'Boolean spelling');return [f,v==='true'];}
    if(nums.includes(f)||f==='http_status'){assert(Number.isFinite(Number(v)),'Finite number');return [f,Number(v)];}
    return [f,v];
  }));
}
const observations=table.slice(1).map(decode);
for(const row of observations){assert(validate(row),JSON.stringify(validate.errors));assert.equal(row.alert_received,row.alert_time_utc!==null);assert.equal(row.alert_received,row.latency_ms!==null);}
const escape=v=>{const s=v==null?'':String(v);return /[",\n]/.test(s)?`"${s.replaceAll('"','""')}"`:s;};
const serialized=[fields,...observations.map(r=>fields.map(f=>r[f]))].map(r=>r.map(escape).join(',')).join('\n')+'\n';
assert.deepEqual(parseCsv(serialized).slice(1).map(decode),observations,'Round-trip changes values');
assert.equal(serialized.replaceAll('\r\n','\n'),raw.replaceAll('\r\n','\n'),'Canonical CSV differs');
const negatives=[];
for(const [name,mutate] of [['missing-condition',r=>delete r.condition],['string-boolean',r=>r.alert_received='false'],['negative-latency',r=>r.latency_ms=-1],['unknown-column',r=>r.accidental=0]]){
  const row=structuredClone(observations[0]);mutate(row);assert(!validate(row),`Missed planted error: ${name}`);negatives.push(name);
}
await mkdir(out,{recursive:true});
await writeFile(new URL('observation-contract.schema.json',out),JSON.stringify(schema,null,2)+'\n');
const result={source_sha256:createHash('sha256').update(raw).digest('hex'),rows:observations.length,fields:fields.length,typed_validation_passed:observations.length,round_trip:'All decoded values and canonical CSV preserved; zero, false and null remain distinct.',negative_cases_rejected:negatives,limits:['New local format contract, not part of historical archive.','Validation does not establish source entailment, interoperability, schema usefulness or operational efficacy.']};
await writeFile(new URL('contract-verification.json',out),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
