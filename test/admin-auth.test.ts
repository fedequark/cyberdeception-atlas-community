import { env } from 'cloudflare:workers';
import { beforeEach, describe, expect, it } from 'vitest';
import { authenticateEditor, editorCookie, editorIdentity, sameOrigin, validEditor } from '../src/lib/admin-auth';
import { clearDatabase } from './helpers';

const secret = 'a-secure-editor-secret-with-more-than-32-characters';
const url = 'https://atlas.test/es/editor';
beforeEach(clearDatabase);

describe('admin authentication', () => {
  it('rejects an expired cookie', async () => {
    const cookie = await editorCookie(new Request(url), secret);
    const signature = cookie.split('=')[1].split(';')[0].split('.')[2];
    const request = new Request(url, { headers: { cookie: `cdh_editor=owner.1.${signature}` } });
    await expect(validEditor(request, secret)).resolves.toBe(false);
  });

  it('rejects a tampered signature', async () => {
    const cookie = await editorCookie(new Request(url), secret);
    const value = cookie.split('=')[1].split(';')[0];
    const replacement = value.endsWith('0') ? '1' : '0';
    const request = new Request(url, { headers: { cookie: `cdh_editor=${value.slice(0, -1)}${replacement}` } });
    await expect(validEditor(request, secret)).resolves.toBe(false);
  });

  it('rejects every cookie when the secret is shorter than 32 characters', async () => {
    const cookie = await editorCookie(new Request(url), secret);
    const request = new Request(url, { headers: { cookie } });
    await expect(validEditor(request, 'too-short')).resolves.toBe(false);
  });

  it('requires an exact same-origin header', () => {
    expect(sameOrigin(new Request(url))).toBe(false);
    expect(sameOrigin(new Request(url, { headers: { origin: 'https://evil.test' } }))).toBe(false);
    expect(sameOrigin(new Request(url, { headers: { origin: 'https://atlas.test' } }))).toBe(true);
  });

  it('authenticates and revokes an individual account', async () => {
    const token = 'a'.repeat(64);
    const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token)));
    const hash = Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
    await env.DB.prepare('INSERT INTO editor_accounts(id,token_hash,role,created_at) VALUES(?,?,?,?)').bind('reviewer-a',hash,'reviewer','2026-10-02').run();
    await expect(authenticateEditor(token, secret)).resolves.toEqual({ id: 'reviewer-a', role: 'reviewer' });
    const cookie = await editorCookie(new Request(url), secret, 'reviewer-a');
    const request = new Request(url, { headers: { cookie } });
    await expect(editorIdentity(request, secret)).resolves.toEqual({ id: 'reviewer-a', role: 'reviewer' });
    await env.DB.prepare('UPDATE editor_accounts SET enabled=0,revoked_at=? WHERE id=?').bind('2026-10-02','reviewer-a').run();
    await expect(editorIdentity(request, secret)).resolves.toBeNull();
  });
});
