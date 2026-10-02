import { env } from 'cloudflare:workers';

export type EditorRole = 'owner' | 'reviewer' | 'publisher';
export type EditorIdentity = { id: string; role: EditorRole };

const cookieName = 'cdh_editor';
const encoder = new TextEncoder();
const secret = (env as typeof env & { ADMIN_SECRET?: string }).ADMIN_SECRET ?? '';

async function digest(value: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function mac(value: string, signingSecret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(signingSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function equal(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  return !!origin && new URL(origin).origin === new URL(request.url).origin;
}

export function validEditorSecret(value: string, signingSecret = secret): boolean {
  return signingSecret.length >= 32 && equal(value, signingSecret);
}

export async function authenticateEditor(value: string, signingSecret = secret): Promise<EditorIdentity | null> {
  if (validEditorSecret(value, signingSecret)) return { id: 'owner', role: 'owner' };
  if (!/^[a-f0-9]{64}$/.test(value)) return null;
  const account = await env.DB.prepare('SELECT id,role FROM editor_accounts WHERE token_hash=? AND enabled=1').bind(await digest(value)).first<{id:string;role:'reviewer'|'publisher'}>();
  return account ? { id: account.id, role: account.role } : null;
}

export async function editorIdentity(request: Request, signingSecret = secret): Promise<EditorIdentity | null> {
  if (signingSecret.length < 32) return null;
  const cookie = request.headers.get('cookie')?.split(';').map(part => part.trim()).find(part => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  if (!cookie) return null;
  const [id, expiry, signature, extra] = cookie.split('.');
  if (extra || !id || !/^[a-z0-9_-]{3,64}$/.test(id) || !expiry || !/^\d+$/.test(expiry) || Number(expiry) < Date.now() || !signature) return null;
  if (!equal(signature, await mac(`${id}.${expiry}`, signingSecret))) return null;
  if (id === 'owner') return { id, role: 'owner' };
  const account = await env.DB.prepare('SELECT id,role FROM editor_accounts WHERE id=? AND enabled=1').bind(id).first<{id:string;role:'reviewer'|'publisher'}>();
  return account ? { id: account.id, role: account.role } : null;
}

export async function validEditor(request: Request, signingSecret = secret): Promise<boolean> {
  return (await editorIdentity(request, signingSecret)) !== null;
}

export function canReview(identity: EditorIdentity | null): identity is EditorIdentity {
  return identity?.role === 'owner' || identity?.role === 'reviewer';
}

export function canPublish(identity: EditorIdentity | null): identity is EditorIdentity {
  return identity?.role === 'owner' || identity?.role === 'publisher';
}

export async function editorCookie(request: Request, signingSecret = secret, id = 'owner'): Promise<string> {
  if (!/^[a-z0-9_-]{3,64}$/.test(id)) throw new Error('Invalid editor ID');
  const expiry = String(Date.now() + 8 * 60 * 60 * 1000);
  const signature = await mac(`${id}.${expiry}`, signingSecret);
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${cookieName}=${id}.${expiry}.${signature}; HttpOnly${secure}; SameSite=Strict; Path=/; Max-Age=28800`;
}

export function clearEditorCookie(): string {
  return `${cookieName}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}
