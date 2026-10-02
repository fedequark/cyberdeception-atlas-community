const moduleMap = import.meta.glob('../../docs/research/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string,string>;
export function getDocument(slug:string,lang:'es'|'en'):string|null {
  return moduleMap[`../../docs/research/${slug}.${lang}.md`] ?? null;
}
