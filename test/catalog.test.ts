import { env } from 'cloudflare:workers';
import { beforeEach, describe, expect, it } from 'vitest';
import { browseResources, catalogCounts, coverageSnapshot, ftsQuery } from '../src/lib/catalog';
import { clearDatabase, insertResource } from './helpers';

beforeEach(clearDatabase);

describe('ftsQuery', () => {
  it('returns null for empty input', () => expect(ftsQuery(' ! ')).toBeNull());

  it('preserves accented tokens', () => {
    expect(ftsQuery('señuelo crítico')).toBe('"señuelo"* AND "crítico"*');
  });

  it('neutralizes FTS operators and punctuation', () => {
    expect(ftsQuery('cowrie OR status:*')).toBe('"cowrie"* AND "OR"* AND "status"*');
  });
});

describe('browseResources', () => {
  it('combines filters', async () => {
    await insertResource({
      name: 'Matching',
      kind: 'software',
      environments: ['Cloud'],
      techniques: ['Honeytoken'],
    });
    await insertResource({
      name: 'Wrong kind',
      kind: 'paper',
      environments: ['Cloud'],
      techniques: ['Honeytoken'],
    });
    await insertResource({
      name: 'Wrong environment',
      kind: 'software',
      environments: ['Network'],
      techniques: ['Honeytoken'],
    });
    const result = await browseResources(env.DB, {
      kind: 'software',
      environment: 'Cloud',
      technique: 'Honeytoken',
    });
    expect(result.items.map((item) => item.name)).toEqual(['Matching']);
  });

  it('paginates deterministically', async () => {
    await insertResource({ name: 'Alpha', year: 2026 });
    await insertResource({ name: 'Beta', year: 2025 });
    await insertResource({ name: 'Gamma', year: 2024 });
    const page = await browseResources(env.DB, { page: 2, limit: 1 });
    expect(page.total).toBe(3);
    expect(page.items.map((item) => item.name)).toEqual(['Beta']);
  });

  it('never returns non-published rows', async () => {
    await insertResource({ name: 'Published', status: 'published' });
    await insertResource({ name: 'Draft', status: 'draft' });
    await insertResource({ name: 'Review', status: 'review' });
    const result = await browseResources(env.DB);
    expect(result.items.map((item) => item.name)).toEqual(['Published']);
    expect(result.total).toBe(1);
  });
});

describe('coverage reporting', () => {
  it('scopes organization country gaps to products and services', async () => {
    await insertResource({ kind: 'product', data: { organization_country: 'Chile' } });
    await insertResource({ kind: 'service' });
    await insertResource({ kind: 'paper' });
    const snapshot = await coverageSnapshot(env.DB);
    expect(snapshot.unknown.organizationCountry).toBe(1);
  });

  it('counts full-text papers separately from repository metadata', async () => {
    await insertResource({ kind: 'paper', data: { review_basis: 'full-text' } });
    await insertResource({ kind: 'software', data: { review_basis: 'full-text' } });
    await insertResource({ kind: 'software', data: { review_basis: 'repository-metadata' } });
    const counts = await catalogCounts(env.DB);
    expect(counts.fullText).toBe(1);
    expect(counts.repositoryMetadata).toBe(1);
    expect(counts.total).toBe(3);
  });
});
