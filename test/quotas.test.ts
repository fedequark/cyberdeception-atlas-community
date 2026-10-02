import { env } from 'cloudflare:workers';
import { beforeEach, describe, expect, it } from 'vitest';
import { POST as ask } from '../src/pages/api/ask';
import { POST as login } from '../src/pages/api/admin/login';
import { POST as submit } from '../src/pages/api/submit';
import { callRoute, clearDatabase, insertResource, quotaBucket } from './helpers';

beforeEach(clearDatabase);

async function setUsage(bucket: string, count: number): Promise<void> {
  await env.DB.prepare('INSERT INTO usage_limits(bucket,count,expires_at) VALUES(?,?,?)').bind(bucket, count, '2099-01-01T00:00:00.000Z').run();
}

describe('quota enforcement', () => {
  it('returns quota after 40 global ask requests', async () => {
    await insertResource({ name: 'Honeypot source' });
    const date = new Date().toISOString().slice(0, 10);
    await setUsage(`ask:global:${date}`, 40);
    const request = new Request('https://atlas.test/api/ask', {
      method: 'POST',
      headers: { origin: 'https://atlas.test', 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.1' },
      body: JSON.stringify({ question: 'Which honeypot source is available?', lang: 'en' }),
    });
    const response = await callRoute(ask, request);
    expect(await response.json()).toMatchObject({ mode: 'quota' });
  });

  it('enforces the three-per-client ask cap', async () => {
    await insertResource({ name: 'Honeypot source' });
    const ip = '203.0.113.2';
    await setUsage(await quotaBucket('ask', ip), 3);
    const request = new Request('https://atlas.test/api/ask', {
      method: 'POST',
      headers: { origin: 'https://atlas.test', 'content-type': 'application/json', 'cf-connecting-ip': ip },
      body: JSON.stringify({ question: 'Which honeypot source is available?', lang: 'en' }),
    });
    const response = await callRoute(ask, request);
    expect(await response.json()).toMatchObject({ mode: 'quota' });
  });

  it('returns 429 after three submissions per client', async () => {
    const ip = '203.0.113.3';
    await setUsage(await quotaBucket('submit', ip), 3);
    const form = new FormData();
    form.set('name', 'Test resource');
    form.set('url', 'https://example.com/resource');
    form.set('kind', 'software');
    form.set('proposal_type', 'new-record');
    form.set('credit_choice', 'anonymous');
    const response = await callRoute(submit, new Request('https://atlas.test/api/submit', { method: 'POST', headers: { origin: 'https://atlas.test', 'cf-connecting-ip': ip }, body: form }));
    expect(response.status).toBe(429);
  });

  it('returns 429 after ten login attempts per client', async () => {
    const ip = '203.0.113.4';
    await setUsage(await quotaBucket('login', ip), 10);
    const form = new FormData();
    form.set('secret', 'wrong');
    const response = await callRoute(login, new Request('https://atlas.test/api/admin/login', { method: 'POST', headers: { origin: 'https://atlas.test', 'cf-connecting-ip': ip }, body: form }));
    expect(response.status).toBe(429);
  });
});
