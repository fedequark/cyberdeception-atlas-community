import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { catalog, relationships } from '../data/catalog.mjs';
import { dossiers } from '../data/dossiers.mjs';

const [version, releaseDate] = process.argv.slice(2);
if (!version || !releaseDate) {
  throw new Error('Usage: node scripts/freeze-corpus.mjs <version> <YYYY-MM-DD>');
}
if (!/^v\d{4}\.\d{2}(?:\.\d+)?$/.test(version)) {
  throw new Error(`Invalid release version: ${version}`);
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(releaseDate) || Number.isNaN(Date.parse(`${releaseDate}T00:00:00Z`))) {
  throw new Error(`Invalid release date: ${releaseDate}`);
}
const outputDir = new URL(`../data/releases/${version}/`, import.meta.url);
try {
  await access(outputDir);
  throw new Error(`Release already exists and is immutable: data/releases/${version}`);
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}
const gitCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const sourceWorktreeDirty = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim().length > 0;

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, canonical(child)]),
    );
  }
  return value;
}

function json(value) {
  return `${JSON.stringify(canonical(value), null, 2)}\n`;
}

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

const publicRecords = catalog
  .filter((resource) => resource.status === 'published')
  .sort((left, right) => left.slug.localeCompare(right.slug))
  .map((resource) => ({
    ...resource,
    critical_reading: dossiers[resource.slug] ?? null,
  }));

const publicSlugs = new Set(publicRecords.map((resource) => resource.slug));
const publicRelationships = relationships
  .filter(([from, to]) => publicSlugs.has(from) && publicSlugs.has(to))
  .map(([from, to, relation]) => ({ from, to, relation }))
  .sort((left, right) =>
    `${left.from}\u0000${left.to}\u0000${left.relation}`.localeCompare(
      `${right.from}\u0000${right.to}\u0000${right.relation}`,
    ),
  );

const files = {
  'catalog.json': json(publicRecords),
  'relationships.json': json(publicRelationships),
};

const manifest = {
  project: 'Cyberdeception Atlas',
  version,
  release_date: releaseDate,
  source_commit: gitCommit,
  source_worktree_dirty: sourceWorktreeDirty,
  schema_version: '1.1',
  correction_of: /^v2026\.09\.\d+$/.test(version) ? 'v2026.09' : null,
  scope: 'Published, public source-linked records only',
  record_count: publicRecords.length,
  relationship_count: publicRelationships.length,
  critical_reading_count: publicRecords.filter((record) => record.critical_reading).length,
  full_text_count: publicRecords.filter((record) => record.data?.review_basis === 'full-text')
    .length,
  ordering: 'Records sorted by slug; object keys canonicalized recursively',
  exclusions: [
    'Private submissions',
    'Editorial revisions and authentication data',
    'Monitoring events',
    'Unpublished discovery candidates',
  ],
  files: Object.fromEntries(
    Object.entries(files).map(([name, content]) => [
      name,
      { sha256: sha256(content), bytes: Buffer.byteLength(content) },
    ]),
  ),
};

files['manifest.json'] = json(manifest);
files['README.md'] = `# Cyberdeception Atlas ${version}\n\n` +
  `Frozen on ${releaseDate} from base commit \`${gitCommit}\` (worktree dirty: ${sourceWorktreeDirty}). This directory is immutable.\n\n` +
  (manifest.correction_of
    ? `This is a corrective release of \`${manifest.correction_of}\`. It reconciles active full-text summaries and limitations, records extraction-provenance gaps, and does not alter the historical release.\n\n`
    : '') +
  `Review depth describes material examined; it is not a quality or effectiveness score. The corpus is curated and is not a census or completed systematic review.\n`;

await mkdir(outputDir, { recursive: true });
await Promise.all(
  Object.entries(files).map(([name, content]) => writeFile(new URL(name, outputDir), content)),
);

// Read the files back so a successful command proves the recorded hashes match disk.
for (const [name, metadata] of Object.entries(manifest.files)) {
  const written = await readFile(new URL(name, outputDir));
  if (sha256(written) !== metadata.sha256) throw new Error(`Checksum mismatch: ${name}`);
}

console.log(
  JSON.stringify({
    output: `data/releases/${version}`,
    records: manifest.record_count,
    relationships: manifest.relationship_count,
    full_text: manifest.full_text_count,
    critical_readings: manifest.critical_reading_count,
  }),
);
