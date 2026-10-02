import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const asOf = '2026-10-02';
const outputDir = new URL(`../reviews/evidence-sprint/${asOf}/`, import.meta.url);
const candidatePath = new URL('../artifacts/private/research-candidates.json', import.meta.url);
const frozenCatalogPath = new URL('../data/releases/v2026.09.2/catalog.json', import.meta.url);
const expectedCandidateHash = 'e120dd0f3cdddd1fba4398d7887d1dc88ba75585fe8edbdf302356139a7ea7db';
const highPriority = new Set([
  '10.1007/978-3-031-22295-5_6', // honeytoken fingerprinting
  '10.1007/s10207-017-0361-5', // credential honeytoken placement
  '10.1109/icsft66733.2026.11507955', // enterprise file honeytokens
  '10.1109/snpd-winter57765.2023.10346207', // honeytoken detection
  '10.24251/hicss.2019.874', // controlled human-subjects design
  '10.1109/tnsm.2022.3179965', // allocation under uncertainty
  '10.1145/3485832.3485918', // deception orchestration
  '10.1016/j.cose.2023.103685', // IoT deception and MTD
  '10.2197/ipsjjip.24.522', // IoT honeypot
  '10.1109/eurospw61312.2024.00054', // generative honeypots
  '10.1109/icot68409.2025.11425235', // operational deployment claim
  '10.1109/iceeot.2016.7754797', // honeytoken evidence synthesis
  '10.1016/j.cose.2024.103792', // survey of honeypot performance
  '10.1109/access.2021.3069105', // lateral movement and deception
]);
const scopeCheck = new Set([
  '10.1093/oso/9780197754443.003.0007', // cyber/nuclear deterrence comparison
  '10.1215/9781478007241', // generic Honeypot title
  '10.1093/ae/tmw002', // generic Honeypot-luck title
  '10.1515/9780691236636-063', // honeypot ants
  '10.1109/tdsc.2025.3560246', // adversarial ML defense may be unrelated
  '10.1109/access.2018.2835527', // detection of offensive deception
  '10.12700/aph.18.3.2021.3.2', // hybrid warfare may be outside cyber defense
]);
const reviewedCandidates = new Map([
  ['10.2197/ipsjjip.24.522', 'iotpot-2016'],
  ['10.1109/eurospw61312.2024.00054', 'shellm-generative-honeypots-2024'],
  ['10.1007/978-3-031-22295-5_6', 'honeysweeper-2022'],
]);
const primaryPageScreened = new Map([
  ['10.1007/s10207-017-0361-5', 'https://link.springer.com/article/10.1007/s10207-017-0361-5'],
  ['10.1016/j.cose.2024.103792', 'https://www.sciencedirect.com/science/article/pii/S0167404824000932'],
  ['10.24251/hicss.2019.874', 'https://aisel.aisnet.org/hicss-52/st/cybersecurity_and_sw_assurance/2/'],
  ['10.1016/j.cose.2023.103685', 'https://www.sciencedirect.com/science/article/pii/S0167404823005953'],
  ['10.1109/access.2021.3069105', 'https://digitalcommons.odu.edu/msve_fac_pubs/65/'],
]);
const primaryPageAccessLimited = new Map([
  ['10.1109/icot68409.2025.11425235', 'https://ieeexplore.ieee.org/document/11425235/'],
  ['10.1109/icsft66733.2026.11507955', 'https://ieeexplore.ieee.org/document/11507955/'],
  ['10.1109/snpd-winter57765.2023.10346207', 'https://ieeexplore.ieee.org/document/10346207/'],
  ['10.1109/iceeot.2016.7754797', 'https://ieeexplore.ieee.org/document/7754797/'],
  ['10.1109/tnsm.2022.3179965', 'https://ieeexplore.ieee.org/document/9786813/'],
  ['10.1145/3485832.3485918', 'https://dl.acm.org/doi/10.1145/3485832.3485918'],
]);
const publicationForm = /^(?:10\.1007\/978-|10\.1201\/978|10\.4324\/978)/i;
const normalizeDoi = (value) => String(value ?? '').trim().toLowerCase().replace(/^https?:\/\/(?:dx\.)?doi\.org\//, '');
const normalizeTitle = (value) => String(value ?? '').toLowerCase().replace(/&amp;/g, '&').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const csv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const countBy = (items, key) => Object.fromEntries([...new Set(items.map(key))].sort().map(value => [value, items.filter(item => key(item) === value).length]));

const candidateBytes = await readFile(candidatePath);
const candidateHash = createHash('sha256').update(candidateBytes).digest('hex');
if (candidateHash !== expectedCandidateHash) throw Error(`Candidate snapshot changed: ${candidateHash}`);
const discovered = JSON.parse(candidateBytes.toString('utf8'));
if (discovered.candidates.length !== 102) throw Error('Expected the documented 102-candidate batch');

const catalog = JSON.parse(await readFile(frozenCatalogPath, 'utf8'));
const published = catalog.filter(item => item.status === 'published');
const knownDois = new Map(published.map(item => [normalizeDoi(item.data?.doi), item.id]).filter(([doi]) => doi));
const doiCounts = countBy(discovered.candidates, item => normalizeDoi(item.doi));
const titleCounts = countBy(discovered.candidates, item => normalizeTitle(item.title));
const records = discovered.candidates.map((item) => {
  const doi = normalizeDoi(item.doi);
  const duplicateRecord = knownDois.get(doi);
  const reviewedRecord = reviewedCandidates.get(doi);
  const screenedPage = primaryPageScreened.get(doi);
  const accessLimitedPage = primaryPageAccessLimited.get(doi);
  const duplicateBatch = doiCounts[doi] > 1;
  const sameTitle = titleCounts[normalizeTitle(item.title)] > 1;
  const priority = duplicateRecord ? 'none' : highPriority.has(doi) ? 'high' : scopeCheck.has(doi) || publicationForm.test(doi) ? 'low' : 'normal';
  const reviewStatus = duplicateRecord ? 'duplicate-existing-doi' : reviewedRecord ? 'full-text-proposed-inclusion' : screenedPage ? 'primary-page-in-scope-awaiting-full-text' : accessLimitedPage ? 'primary-page-access-limited' : 'awaiting-primary-source-review';
  const flags = [
    ...(duplicateBatch ? ['repeated-doi-in-batch'] : []),
    ...(sameTitle ? ['same-title-check-distinct-work'] : []),
    ...(scopeCheck.has(doi) ? ['scope-check'] : []),
    ...(publicationForm.test(doi) ? ['publication-form-check'] : []),
  ];
  return {
    discovered_at: discovered.generated_at,
    discovery_source: item.discovered_via,
    query: item.query,
    title: item.title,
    doi,
    source_url: item.url,
    screened_source_url: screenedPage ?? accessLimitedPage ?? '',
    priority,
    screening_status: reviewStatus,
    catalog_match: duplicateRecord ?? reviewedRecord ?? '',
    flags: flags.join(';'),
    reviewer: 'Atlas editorial triage',
    decision_date: asOf,
    notes: duplicateRecord ? 'Exact DOI match in published catalog; no new record proposed.' : reviewedRecord ? 'Primary full text examined on 2026-10-02; proposed inclusion documented in SOURCE-READINGS.md.' : screenedPage ? 'Publisher or author-hosted primary page confirms identity and topical scope; full-text reading and inclusion decision remain pending.' : accessLimitedPage ? 'Primary publisher page attempted; bot gate, HTTP error or inaccessible content prevented an evidence-bounded scope decision. No inclusion or exclusion decision.' : 'Title and metadata triage only. Inclusion, exclusion and review depth require primary-source examination.',
  };
});

const techniqueLabels = ['Adversary engagement', 'Decoy', 'Honeypot', 'Honeytoken', 'Moving target defense'];
const environmentLabels = ['Application', 'Cloud', 'Endpoint', 'Identity', 'IoT', 'Network', 'OT/ICS'];
const matrix = Object.fromEntries(techniqueLabels.map(technique => {
  const environments = Object.fromEntries(environmentLabels.map(environment => {
    const cell = published.filter(item => item.data?.techniques?.includes(technique) && item.data?.environments?.includes(environment));
    return [environment, {
      records: cell.length,
      papers: cell.filter(item => item.kind === 'paper').length,
      full_text_papers: cell.filter(item => item.kind === 'paper' && item.data.review_basis === 'full-text').length,
      metadata_only_records: cell.filter(item => ['repository-metadata', 'publisher-metadata', 'abstract'].includes(item.data.review_basis)).length,
    }];
  }));
  return [technique, environments];
}));
const sourceHosts = countBy(published, item => new URL(item.source_url).hostname.toLowerCase());
const baseline = {
  as_of: asOf,
  corpus_status: 'immutable v2026.09.2 baseline; proposed source additions are not a new release',
  records: published.length,
  resource_kinds: countBy(published, item => item.kind),
  review_basis: countBy(published, item => item.data.review_basis),
  papers: {
    total: published.filter(item => item.kind === 'paper').length,
    by_review_basis: countBy(published.filter(item => item.kind === 'paper'), item => item.data.review_basis),
  },
  source_hosts: sourceHosts,
  technique_environment_matrix: matrix,
  candidate_batch: {
    snapshot_date: discovered.generated_at,
    source_sha256: candidateHash,
    records: records.length,
    by_screening_status: countBy(records, item => item.screening_status),
    by_priority: countBy(records, item => item.priority),
    same_title_flags: records.filter(item => item.flags.includes('same-title')).length,
    scope_check_flags: records.filter(item => item.flags.includes('scope-check')).length,
    methodology: 'Priority and flags begin with metadata/title triage. Per-row status records later primary-page checks or full-text readings; flags are not exclusion decisions.',
  },
};

await mkdir(outputDir, { recursive: true });
await writeFile(new URL('baseline.json', outputDir), JSON.stringify(baseline, null, 2) + '\n');
const fields = ['discovered_at', 'discovery_source', 'query', 'title', 'doi', 'source_url', 'screened_source_url', 'priority', 'screening_status', 'catalog_match', 'flags', 'reviewer', 'decision_date', 'notes'];
await writeFile(new URL('candidate-triage.csv', outputDir), [fields.join(','), ...records.map(item => fields.map(field => csv(item[field])).join(','))].join('\n') + '\n');
const ledgerFields = ['candidate_id', 'discovered_at', 'discovery_source', 'query', 'title', 'doi', 'source_url', 'language', 'deduplication_status', 'screening_status', 'exclusion_reason', 'reviewer', 'decision_date', 'notes'];
const ledger = records.map(item => ({
  candidate_id: `doi:${item.doi}`,
  discovered_at: item.discovered_at,
  discovery_source: item.discovery_source,
  query: item.query,
  title: item.title,
  doi: item.doi,
  source_url: item.screened_source_url || item.source_url,
  language: '',
  deduplication_status: item.screening_status === 'duplicate-existing-doi' ? 'duplicate-existing-doi' : 'distinct-doi-work-check-pending',
  screening_status: item.screening_status,
  exclusion_reason: item.screening_status === 'duplicate-existing-doi' ? 'duplicate' : '',
  reviewer: item.reviewer,
  decision_date: item.decision_date,
  notes: item.notes,
}));
await writeFile(new URL('screening-ledger.csv', outputDir), [ledgerFields.join(','), ...ledger.map(item => ledgerFields.map(field => csv(item[field])).join(','))].join('\n') + '\n');
console.log(JSON.stringify({ baseline: `${published.length} records; ${baseline.papers.total} papers`, candidate_batch: baseline.candidate_batch }, null, 2));
