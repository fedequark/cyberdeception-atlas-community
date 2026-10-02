import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';

const version = process.argv[2];
if (!version) throw new Error('Usage: node scripts/build-research-release.mjs <version>');
if (!/^v\d{4}\.\d{2}(?:\.\d+)?$/.test(version)) {
  throw new Error(`Invalid release version: ${version}`);
}

const root = new URL('../', import.meta.url);
const archivePrefix = `cyberdeception-atlas-${version}`;
const corpusManifest = JSON.parse(
  await readFile(new URL(`data/releases/${version}/manifest.json`, root), 'utf8'),
);
const releaseDateEpoch = Math.floor(Date.parse(`${corpusManifest.release_date}T00:00:00Z`) / 1000);
const payloadPaths = [
  'CITATION.cff',
  'CHANGELOG.md',
  'LICENSE',
  'LICENSE-DATA.md',
  '.zenodo.json',
  `data/releases/${version}/README.md`,
  `data/releases/${version}/catalog.json`,
  `data/releases/${version}/relationships.json`,
  `data/releases/${version}/manifest.json`,
  `data/releases/${version}/analysis/summary.json`,
  `data/releases/${version}/analysis/report.md`,
  `data/releases/${version}/analysis/tables/resource-types.csv`,
  `data/releases/${version}/analysis/tables/review-basis.csv`,
  `data/releases/${version}/analysis/tables/techniques.csv`,
  `data/releases/${version}/analysis/tables/environments.csv`,
  `data/releases/${version}/analysis/tables/source-hosts.csv`,
  `data/releases/${version}/analysis/figures/resource-types.svg`,
  `data/releases/${version}/analysis/figures/review-basis.svg`,
  'docs/research/CORPUS-PROTOCOL.md',
  'docs/research/CODEBOOK.md',
  'experiments/http-decoy-pilot-v1/PROTOCOL.md',
  'experiments/http-decoy-pilot-v1/run.mjs',
  'experiments/http-decoy-pilot-v1/results/summary.json',
  'experiments/http-decoy-pilot-v1/results/observations.csv',
  'experiments/http-decoy-pilot-v1/results/events.json',
  'experiments/http-decoy-pilot-v1/results/report.md',
  'experiments/http-decoy-pilot-v1/results/manifest.json',
];

const sha256 = (content) => createHash('sha256').update(content).digest('hex');
const payload = await Promise.all(
  payloadPaths.map(async (path) => ({ path, content: await readFile(new URL(path, root)) })),
);
const citation = payload.find(({ path }) => path === 'CITATION.cff')?.content.toString('utf8') ?? '';
if (!citation.includes(`version: '${version.slice(1)}'`)) {
  throw new Error(`CITATION.cff does not identify ${version}; refusing an inconsistent package`);
}

const releaseManifest = {
  project: 'Cyberdeception Atlas',
  version,
  release_date: corpusManifest.release_date,
  source_commit: corpusManifest.source_commit,
  citation: `Federico Pacheco, Cyberdeception Atlas, ${version}, 2026.`,
  doi: null,
  data_license: 'CC-BY-4.0',
  software_license: 'MIT',
  files: Object.fromEntries(
    payload.map(({ path, content }) => [
      path,
      { bytes: content.byteLength, sha256: sha256(content) },
    ]),
  ),
};
const releaseManifestUrl = new URL(`data/releases/${version}/release-manifest.json`, root);
try {
  await access(releaseManifestUrl);
  throw new Error(`Release package manifest already exists and is immutable: ${version}`);
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}
const releaseManifestContent = Buffer.from(`${JSON.stringify(releaseManifest, null, 2)}\n`);
await writeFile(
  releaseManifestUrl,
  releaseManifestContent,
);
payload.push({
  path: `data/releases/${version}/release-manifest.json`,
  content: releaseManifestContent,
});

function writeText(buffer, offset, length, value) {
  buffer.write(String(value), offset, Math.min(length, Buffer.byteLength(String(value))), 'utf8');
}

function writeOctal(buffer, offset, length, value) {
  writeText(buffer, offset, length, `${value.toString(8).padStart(length - 1, '0')}\0`);
}

function tarHeader(path, size) {
  const header = Buffer.alloc(512);
  const encoded = `${archivePrefix}/${path}`.replaceAll('\\', '/');
  let name = encoded;
  let prefix = '';
  if (Buffer.byteLength(encoded) > 100) {
    const split = encoded.lastIndexOf('/');
    prefix = encoded.slice(0, split);
    name = encoded.slice(split + 1);
  }
  if (Buffer.byteLength(name) > 100 || Buffer.byteLength(prefix) > 155) {
    throw new Error(`Archive path exceeds USTAR limits: ${encoded}`);
  }
  writeText(header, 0, 100, name);
  writeOctal(header, 100, 8, 0o644);
  writeOctal(header, 108, 8, 0);
  writeOctal(header, 116, 8, 0);
  writeOctal(header, 124, 12, size);
  writeOctal(header, 136, 12, releaseDateEpoch);
  header.fill(0x20, 148, 156);
  header.write('0', 156, 1, 'ascii');
  header.write('ustar\0', 257, 6, 'ascii');
  header.write('00', 263, 2, 'ascii');
  writeText(header, 265, 32, 'cyberdeception-atlas');
  writeText(header, 297, 32, 'cyberdeception-atlas');
  writeText(header, 345, 155, prefix);
  const checksum = header.reduce((sum, byte) => sum + byte, 0);
  writeText(header, 148, 8, `${checksum.toString(8).padStart(6, '0')}\0 `);
  return header;
}

const tarParts = [];
for (const { path, content } of payload.sort((left, right) =>
  left.path.localeCompare(right.path),
)) {
  tarParts.push(tarHeader(path, content.byteLength), content);
  const padding = (512 - (content.byteLength % 512)) % 512;
  if (padding) tarParts.push(Buffer.alloc(padding));
}
tarParts.push(Buffer.alloc(1024));
const archive = gzipSync(Buffer.concat(tarParts), { level: 9, mtime: 0 });
const outputDir = new URL('artifacts/releases/', root);
const archiveName = `cyberdeception-atlas-${version}.tar.gz`;
await mkdir(outputDir, { recursive: true });
try {
  await access(new URL(archiveName, outputDir));
  throw new Error(`Release archive already exists and is immutable: ${archiveName}`);
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}
await writeFile(new URL(archiveName, outputDir), archive);
await writeFile(
  new URL(`${archiveName}.sha256`, outputDir),
  `${sha256(archive)}  ${archiveName}\n`,
);

const publicDir = new URL(`public/downloads/research/${version}/`, root);
await mkdir(publicDir, { recursive: true });
await Promise.all([
  copyFile(new URL(archiveName, outputDir), new URL(archiveName, publicDir)),
  copyFile(new URL(`${archiveName}.sha256`, outputDir), new URL(`${archiveName}.sha256`, publicDir)),
  copyFile(new URL(`data/releases/${version}/catalog.json`, root), new URL('catalog.json', publicDir)),
  copyFile(new URL(`data/releases/${version}/manifest.json`, root), new URL('manifest.json', publicDir)),
  copyFile(new URL(`data/releases/${version}/release-manifest.json`, root), new URL('release-manifest.json', publicDir)),
  copyFile(new URL(`data/releases/${version}/analysis/summary.json`, root), new URL('analysis-summary.json', publicDir)),
  copyFile(new URL(`data/releases/${version}/analysis/report.md`, root), new URL('analysis-report.md', publicDir)),
  copyFile(new URL('docs/research/CODEBOOK.md', root), new URL('codebook.md', publicDir)),
  copyFile(new URL('docs/research/CORPUS-PROTOCOL.md', root), new URL('corpus-protocol.md', publicDir)),
  copyFile(new URL('experiments/http-decoy-pilot-v1/results/observations.csv', root), new URL('pilot-observations.csv', publicDir)),
  copyFile(new URL('experiments/http-decoy-pilot-v1/results/report.md', root), new URL('pilot-report.md', publicDir)),
]);

console.log(
  JSON.stringify({
    output: `artifacts/releases/${archiveName}`,
    files: payload.length,
    bytes: archive.byteLength,
    sha256: sha256(archive),
  }),
);
