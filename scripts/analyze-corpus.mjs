import { access, mkdir, readFile, writeFile } from 'node:fs/promises';

const version = process.argv[2];
if (!version) throw new Error('Usage: node scripts/analyze-corpus.mjs <version>');
if (!/^v\d{4}\.\d{2}(?:\.\d+)?$/.test(version)) {
  throw new Error(`Invalid release version: ${version}`);
}

const releaseDir = new URL(`../data/releases/${version}/`, import.meta.url);
const outputDir = new URL('analysis/', releaseDir);
const tableDir = new URL('tables/', outputDir);
const figureDir = new URL('figures/', outputDir);
const manifest = JSON.parse(await readFile(new URL('manifest.json', releaseDir), 'utf8'));
const catalog = JSON.parse(await readFile(new URL('catalog.json', releaseDir), 'utf8'));
try {
  await access(new URL('summary.json', outputDir));
  throw new Error(`Analysis already exists and is immutable: data/releases/${version}/analysis`);
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

const countBy = (values) =>
  Object.fromEntries(
    [...new Set(values)]
      .sort((left, right) => String(left).localeCompare(String(right)))
      .map((value) => [value, values.filter((candidate) => candidate === value).length]),
  );

const flatten = (field) => catalog.flatMap((record) => record.data?.[field] ?? []);
const hostname = (url) => new URL(url).hostname.toLowerCase().replace(/^www\./, '');
const scalar = (record, field) => record[field] ?? record.data?.[field] ?? null;
const missing = (field, records = catalog) =>
  records.filter((record) => {
    const value = scalar(record, field);
    return value == null || value === '' || (Array.isArray(value) && value.length === 0);
  }).length;

const byKind = countBy(catalog.map((record) => record.kind));
const byReviewBasis = countBy(catalog.map((record) => record.data?.review_basis ?? 'unknown'));
const byEvidence = countBy(catalog.map((record) => record.evidence ?? 'unknown'));
const byTechnique = countBy(flatten('techniques'));
const byEnvironment = countBy(flatten('environments'));
const byHost = countBy(catalog.map((record) => hostname(record.source_url)));
const byYear = countBy(catalog.map((record) => record.year ?? 'unknown'));
const productsAndServices = catalog.filter((record) =>
  ['product', 'service'].includes(record.kind),
);
const papers = catalog.filter((record) => record.kind === 'paper');

const missingness = {
  year: { missing: missing('year'), applicable: catalog.length },
  doi_papers: { missing: missing('doi', papers), applicable: papers.length },
  source_language: { missing: missing('source_language'), applicable: catalog.length },
  organization_country_products_services: {
    missing: missing('organization_country', productsAndServices),
    applicable: productsAndServices.length,
  },
};

const sensitivity = {
  all_published: catalog.length,
  with_critical_reading: catalog.filter((record) => record.critical_reading).length,
  full_text_only: catalog.filter((record) => record.data?.review_basis === 'full-text').length,
  source_or_full_text: catalog.filter((record) =>
    ['source-page', 'full-text'].includes(record.data?.review_basis),
  ).length,
  excluding_publisher_metadata: catalog.filter(
    (record) => record.data?.review_basis !== 'publisher-metadata',
  ).length,
  excluding_repository_and_publisher_metadata: catalog.filter(
    (record) => !['repository-metadata', 'publisher-metadata'].includes(record.data?.review_basis),
  ).length,
  excluding_repository_metadata: catalog.filter(
    (record) => record.data?.review_basis !== 'repository-metadata',
  ).length,
  papers_with_full_text: papers.filter((record) => record.data?.review_basis === 'full-text')
    .length,
  non_github_sources: catalog.filter((record) => hostname(record.source_url) !== 'github.com')
    .length,
};

const summary = {
  version,
  release_date: manifest.release_date,
  records: catalog.length,
  by_kind: byKind,
  by_review_basis: byReviewBasis,
  by_evidence: byEvidence,
  by_technique: byTechnique,
  by_environment: byEnvironment,
  by_source_host: byHost,
  by_year: byYear,
  missingness,
  sensitivity,
  cautions: [
    'Counts describe this curated corpus, not the worldwide cyber-deception field.',
    'Tags are multi-valued, so technique and environment counts do not sum to the corpus total.',
    'Review basis records what was read; it is not a study-quality score.',
    'The historical candidate and exclusion ledger is incomplete for the baseline corpus.',
    'Full-text syntheses in this release were completed by one reviewer; page anchors and adjudication were not retained.',
  ],
};

function csv(rows) {
  const escape = (value) => {
    const text = String(value ?? '');
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  return `${rows.map((row) => row.map(escape).join(',')).join('\n')}\n`;
}

function countTable(values) {
  return csv([
    ['value', 'count', 'share_of_records'],
    ...Object.entries(values)
      .sort(([, left], [, right]) => right - left)
      .map(([value, count]) => [value, count, (count / catalog.length).toFixed(4)]),
  ]);
}

function barChart(title, values, note) {
  const entries = Object.entries(values).sort(([, left], [, right]) => right - left);
  const width = 960;
  const rowHeight = 42;
  const height = 100 + entries.length * rowHeight + 45;
  const labelWidth = 250;
  const chartWidth = 620;
  const maximum = Math.max(...entries.map(([, count]) => count), 1);
  const rows = entries
    .map(([label, count], index) => {
      const y = 76 + index * rowHeight;
      const barWidth = Math.round((count / maximum) * chartWidth);
      return `<text x="20" y="${y + 18}" class="label">${xml(label)}</text><rect x="${labelWidth}" y="${y}" width="${barWidth}" height="24" rx="2"/><text x="${labelWidth + barWidth + 10}" y="${y + 18}" class="count">${count}</text>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc"><title id="title">${xml(title)}</title><desc id="desc">${xml(note)}</desc><style>text{font-family:Arial,sans-serif;fill:#122}.title{font-size:24px;font-weight:700}.label,.count{font-size:15px}rect{fill:#117f78}.note{font-size:13px;fill:#465}</style><rect width="100%" height="100%" fill="#fff"/><text x="20" y="36" class="title">${xml(title)}</text>${rows}<text x="20" y="${height - 18}" class="note">${xml(note)}</text></svg>\n`;
}

function xml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function markdownTable(values) {
  return [
    '| Category | Count | Share of corpus |',
    '| --- | ---: | ---: |',
    ...Object.entries(values)
      .sort(([, left], [, right]) => right - left)
      .map(
        ([label, count]) =>
          `| ${label} | ${count} | ${((100 * count) / catalog.length).toFixed(1)}% |`,
      ),
  ].join('\n');
}

const report = `# Reproducible corpus analysis: ${version}

**Release date:** ${manifest.release_date}  
**Records:** ${catalog.length}

This report is generated by \`scripts/analyze-corpus.mjs\` from the frozen public snapshot. It describes the Atlas corpus and must not be interpreted as prevalence in the global cyber-deception field.

## Resource types

${markdownTable(byKind)}

## Review basis

${markdownTable(byReviewBasis)}

Review basis identifies the material examined by the editor. It is not a quality or effectiveness score.

## Sensitivity views

| View | Records |
| --- | ---: |
${Object.entries(sensitivity)
  .map(([label, count]) => `| ${label.replaceAll('_', ' ')} | ${count} |`)
  .join('\n')}

Removing repository-metadata records reduces the visible corpus from ${catalog.length} to ${sensitivity.excluding_repository_metadata}. Restricting it to full-text reviews reduces it to ${sensitivity.full_text_only}. This demonstrates that corpus volume and evidentiary depth answer different questions.

## Missingness

| Field | Missing | Applicable | Missing share |
| --- | ---: | ---: | ---: |
${Object.entries(missingness)
  .map(
    ([field, value]) =>
      `| ${field.replaceAll('_', ' ')} | ${value.missing} | ${value.applicable} | ${((100 * value.missing) / value.applicable).toFixed(1)}% |`,
  )
  .join('\n')}

## Source concentration

The snapshot contains ${byHost['github.com'] ?? 0} GitHub source URLs and ${sensitivity.non_github_sources} sources hosted elsewhere. Host concentration is a property of the curation process and source availability, not evidence that software dominates real-world use.

## Interpretation boundary

- Technique and environment tags are multi-valued.
- The baseline corpus lacks a complete historical candidate/exclusion ledger.
- Public sources systematically omit procurement-confidential and negative operational evidence.
- Vendor-authored sources remain attributed and are not treated as independent evaluations.
- Sensitivity subsets are transparency views, not formal evidence-quality grades.
`;

await Promise.all([mkdir(tableDir, { recursive: true }), mkdir(figureDir, { recursive: true })]);

await Promise.all([
  writeFile(new URL('summary.json', outputDir), `${JSON.stringify(summary, null, 2)}\n`),
  writeFile(new URL('report.md', outputDir), report),
  writeFile(new URL('tables/resource-types.csv', outputDir), countTable(byKind)),
  writeFile(new URL('tables/review-basis.csv', outputDir), countTable(byReviewBasis)),
  writeFile(new URL('tables/techniques.csv', outputDir), countTable(byTechnique)),
  writeFile(new URL('tables/environments.csv', outputDir), countTable(byEnvironment)),
  writeFile(new URL('tables/source-hosts.csv', outputDir), countTable(byHost)),
  writeFile(
    new URL('figures/resource-types.svg', outputDir),
    barChart(
      'Cyberdeception Atlas resource types',
      byKind,
      `${version}; n=${catalog.length}; curated corpus, not field prevalence`,
    ),
  ),
  writeFile(
    new URL('figures/review-basis.svg', outputDir),
    barChart('Review basis', byReviewBasis, 'What the editor reviewed; not an effectiveness score'),
  ),
]);

console.log(
  JSON.stringify({
    output: `data/releases/${version}/analysis`,
    records: catalog.length,
    tables: 5,
    figures: 2,
  }),
);
