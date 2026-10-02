import { mkdir, writeFile } from 'node:fs/promises';
import { catalog } from '../data/catalog.mjs';

const concurrency = 6;
const output = 'artifacts/private/catalog-audit.json';
const results = new Array(catalog.length);
let next = 0;

async function check(resource, index) {
  const started = Date.now();
  let response;
  let error = null;
  try {
    response = await fetch(resource.source_url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'CyberdeceptionAtlasResearch/1.0' },
      redirect: 'follow',
      signal: AbortSignal.timeout(12000),
    });
    if ([403, 405, 501].includes(response.status)) {
      response = await fetch(resource.source_url, {
        method: 'GET',
        headers: { 'User-Agent': 'CyberdeceptionAtlasResearch/1.0' },
        redirect: 'follow',
        signal: AbortSignal.timeout(12000),
      });
      await response.body?.cancel();
    }
  } catch (caught) {
    error = caught instanceof Error ? caught.message : String(caught);
  }
  results[index] = {
    slug: resource.slug,
    kind: resource.kind,
    url: resource.source_url,
    status: response?.status ?? null,
    final_url: response?.url ?? null,
    issue: [404, 410].includes(response?.status) ? 'broken' : response && !response.ok ? 'manual-review' : error ? 'manual-review' : null,
    error,
    elapsed_ms: Date.now() - started,
    review_basis: resource.data.review_basis,
    missing: ['year', 'doi', 'source_language', 'organization_country', 'deployment_regions']
      .filter(field => resource[field] == null && resource.data[field] == null),
  };
}

async function worker() {
  while (next < catalog.length) {
    const index = next++;
    await check(catalog[index], index);
  }
}

await Promise.all(Array.from({ length: concurrency }, worker));
const summary = {
  total: results.length,
  reachable: results.filter(row => row.status >= 200 && row.status < 400).length,
  broken: results.filter(row => row.issue === 'broken').length,
  manual_review: results.filter(row => row.issue === 'manual-review').length,
  by_kind: Object.fromEntries([...new Set(catalog.map(row => row.kind))].map(kind => [kind, catalog.filter(row => row.kind === kind).length])),
};
await mkdir('artifacts/private', { recursive: true });
await writeFile(output, JSON.stringify({ generated_at: new Date().toISOString(), summary, results }, null, 2));
console.log(JSON.stringify({ output, ...summary }));
