import { env } from 'cloudflare:workers';
import { beforeEach, describe, expect, it } from 'vitest';
import { POST as submit } from '../src/pages/api/submit';
import { callRoute, clearDatabase } from './helpers';

beforeEach(clearDatabase);

describe('contribution intake', () => {
  it('stores proposal type, source locator, interests and private credit choice', async () => {
    const form = new FormData();
    form.set('name', 'Example paper');
    form.set('url', 'https://example.com/paper');
    form.set('kind', 'paper');
    form.set('proposal_type', 'paper-review');
    form.set('source_locator', 'Section 3');
    form.set('note', 'The result needs a narrower description.');
    form.set('interest', 'Coauthor');
    form.set('credit_choice', 'pseudonym');
    form.set('credit_name', 'Reader A');
    form.set('ai_assisted', 'on');
    const response = await callRoute(submit, new Request('https://atlas.test/api/submit', { method: 'POST', headers: { origin: 'https://atlas.test', 'cf-connecting-ip': '203.0.113.10' }, body: form }));
    expect(response.status).toBe(303);
    const item = await env.DB.prepare('SELECT proposal_type,source_locator,interest,credit_choice,credit_name,ai_assisted,status FROM submissions').first<Record<string, unknown>>();
    expect(item).toMatchObject({ proposal_type: 'paper-review', source_locator: 'Section 3', interest: 'Coauthor', credit_choice: 'pseudonym', credit_name: 'Reader A', ai_assisted: 1, status: 'pending' });
  });

  it('rejects unsupported proposal types before writing', async () => {
    const form = new FormData();
    form.set('name', 'Example paper');
    form.set('url', 'https://example.com/paper');
    form.set('kind', 'paper');
    form.set('proposal_type', 'security-report');
    form.set('credit_choice', 'anonymous');
    const response = await callRoute(submit, new Request('https://atlas.test/api/submit', { method: 'POST', headers: { origin: 'https://atlas.test' }, body: form }));
    expect(response.status).toBe(400);
    expect((await env.DB.prepare('SELECT count(*) AS n FROM submissions').first<{n:number}>())?.n).toBe(0);
  });
});
