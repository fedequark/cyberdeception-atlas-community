import { env } from 'cloudflare:workers';
import { beforeEach, describe, expect, it } from 'vitest';
import { GET as exportCatalog } from '../src/pages/api/export';
import { callRoute, clearDatabase, insertResource } from './helpers';

beforeEach(clearDatabase);

describe('/api/export privacy boundary', () => {
  it.each(['json', 'csv', 'bibtex'])('does not expose private data in %s', async (format) => {
    const resourceId = await insertResource({
      kind: 'paper',
      name: 'Public paper',
      data: { doi: '10.0000/test' },
    });
    await env.DB.prepare(
      'INSERT INTO submissions(id,name,url,kind,note,submitted_at) VALUES(?,?,?,?,?,?)',
    )
      .bind(
        'private-submission',
        'PRIVATE SUBMISSION',
        'https://private.test',
        'paper',
        'PRIVATE NOTE',
        '2026-09-16',
      )
      .run();
    await env.DB.prepare(
      'INSERT INTO revisions(id,resource_id,actor,created_at,before_data,after_data,action) VALUES(?,?,?,?,?,?,?)',
    )
      .bind(
        'private-revision',
        resourceId,
        'PRIVATE ACTOR',
        '2026-09-16',
        null,
        '{"private":"PRIVATE AUDIT"}',
        'update',
      )
      .run();
    const response = await callRoute(
      exportCatalog,
      new Request(`https://atlas.test/api/export?format=${format}`),
    );
    const output = new TextDecoder().decode(await response.arrayBuffer());
    expect(response.status).toBe(200);
    expect(output).not.toContain('PRIVATE SUBMISSION');
    expect(output).not.toContain('PRIVATE NOTE');
    expect(output).not.toContain('PRIVATE ACTOR');
    expect(output).not.toContain('PRIVATE AUDIT');
    expect(output).not.toMatch(/\bsubmissions\b/i);
    expect(output).not.toMatch(/\brevisions\b/i);
  });

  it.each(['json', 'csv'])('withdraws unsupported coverage fields from %s', async (format) => {
    await insertResource({
      data: { deployment_regions: ['Inferred region'], sectors: ['Inferred sector'] },
    });
    const response = await callRoute(
      exportCatalog,
      new Request(`https://atlas.test/api/export?format=${format}`),
    );
    const output = new TextDecoder().decode(await response.arrayBuffer());
    expect(output).not.toContain('deployment_regions');
    expect(output).not.toContain('sectors');
    expect(output).not.toContain('Inferred region');
    expect(output).not.toContain('Inferred sector');
  });

  it('limits organization country to products and services', async () => {
    await insertResource({ kind: 'paper', data: { organization_country: 'Unsupported country' } });
    const response = await callRoute(
      exportCatalog,
      new Request('https://atlas.test/api/export?format=json'),
    );
    const output = await response.json<{ items: Array<{ organization_country: string | null }> }>();
    expect(output.items[0]?.organization_country).toBeNull();
  });

  it('publishes versioned license metadata in JSON and download headers', async () => {
    await insertResource();
    const jsonResponse = await callRoute(
      exportCatalog,
      new Request('https://atlas.test/api/export?format=json'),
    );
    const json = await jsonResponse.json<{
      version: string;
      license: { id: string; url: string };
    }>();
    expect(json.version).toBe('v2026.09.2');
    expect(json.license.id).toBe('CC-BY-4.0');
    expect(json.license.url).toBe('https://creativecommons.org/licenses/by/4.0/');

    const csvResponse = await callRoute(
      exportCatalog,
      new Request('https://atlas.test/api/export?format=csv'),
    );
    expect(csvResponse.headers.get('X-Data-License')).toBe('CC-BY-4.0');
    expect(csvResponse.headers.get('Link')).toContain('rel="license"');
  });
});
