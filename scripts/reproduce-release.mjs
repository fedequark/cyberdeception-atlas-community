import { spawnSync } from 'node:child_process';

const [version, releaseDate] = process.argv.slice(2);
if (!version || !releaseDate) {
  throw new Error('Usage: npm run research:reproduce -- <version> <YYYY-MM-DD>');
}

for (const [script, args] of [
  ['scripts/freeze-corpus.mjs', [version, releaseDate]],
  ['scripts/analyze-corpus.mjs', [version]],
  ['scripts/build-research-release.mjs', [version]],
]) {
  const result = spawnSync(process.execPath, [script, ...args], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
