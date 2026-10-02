interface Env { DB:D1Database }
type Feed={id:string;name:string;url:string};

// Four repository checks and four link checks per day keep the monitoring
// workload bounded on Cloudflare Free. No discovered change is published.
const repositories:Feed[]=[
  {id:'cowrie',name:'Cowrie upstream',url:'https://api.github.com/repos/cowrie/cowrie/commits?per_page=1'},
  {id:'opencanary',name:'OpenCanary upstream',url:'https://api.github.com/repos/thinkst/opencanary/commits?per_page=1'},
  {id:'tpot',name:'T-Pot upstream',url:'https://api.github.com/repos/telekom-security/tpotce/commits?per_page=1'},
  {id:'mitre-engage',name:'MITRE Engage upstream',url:'https://api.github.com/repos/mitre/engage/commits?per_page=1'},
  {id:'dionaea',name:'Dionaea upstream',url:'https://api.github.com/repos/DinoTools/dionaea/commits?per_page=1'},
  {id:'conpot',name:'Conpot upstream',url:'https://api.github.com/repos/mushorg/conpot/commits?per_page=1'},
  {id:'canarytokens',name:'Canarytokens upstream',url:'https://api.github.com/repos/thinkst/canarytokens/commits?per_page=1'},
  {id:'galah',name:'Galah upstream',url:'https://api.github.com/repos/0x4D31/galah/commits?per_page=1'},
  {id:'honeytrap',name:'Honeytrap upstream',url:'https://api.github.com/repos/honeytrap/honeytrap/commits?per_page=1'},
  {id:'tanner',name:'Tanner upstream',url:'https://api.github.com/repos/mushorg/tanner/commits?per_page=1'},
  {id:'glastopf',name:'Glastopf upstream',url:'https://api.github.com/repos/mushorg/glastopf/commits?per_page=1'},
  {id:'snare',name:'SNARE upstream',url:'https://api.github.com/repos/mushorg/snare/commits?per_page=1'},
  {id:'base4-buda',name:'BUDA upstream',url:'https://api.github.com/repos/Base4Security/BUDA/commits?per_page=1'},
  {id:'base4-dolos-t',name:'DOLOS-T upstream',url:'https://api.github.com/repos/Base4Security/DOLOS-T/commits?per_page=1'},
  {id:'base4-cyberdeception-playground',name:'Cyber Deception Playground upstream',url:'https://api.github.com/repos/Base4Security/cyberdeception-playground/commits?per_page=1'}
];
const queries=['cyber deception','honeypot cybersecurity','honeytoken security','moving target defense cybersecurity','engaño cibernético señuelos','decepção cibernética honeypot'];

async function register(db:D1Database,feed:Feed){
  await db.prepare('INSERT OR IGNORE INTO monitored_sources(id,name,url) VALUES(?,?,?)').bind(feed.id,feed.name,feed.url).run();
  return db.prepare('SELECT fingerprint,etag,last_status FROM monitored_sources WHERE id=?').bind(feed.id).first<{fingerprint:string|null;etag:string|null;last_status:number|null}>();
}
async function event(db:D1Database,sourceId:string,kind:string,detail:string){
  await db.prepare('INSERT INTO monitoring_events(id,source_id,detected_at,kind,detail) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),sourceId,new Date().toISOString(),kind,detail.slice(0,400)).run();
}

async function checkRepository(db:D1Database,feed:Feed):Promise<void>{
  const previous=await register(db,feed);
  let status=0;
  try{
    const headers:Record<string,string>={'Accept':'application/vnd.github+json','User-Agent':'Cyberdeception-Atlas/1.0'};
    if(previous?.etag)headers['If-None-Match']=previous.etag;
    const response=await fetch(feed.url,{headers,signal:AbortSignal.timeout(12000)});
    status=response.status;
    const now=new Date().toISOString();
    if(status===304){await db.prepare('UPDATE monitored_sources SET checked_at=?,last_status=? WHERE id=?').bind(now,status,feed.id).run();return;}
    if(!response.ok)throw Error(`HTTP ${status}`);
    const data=await response.json() as Array<{sha?:string;commit?:{message?:string}}>;
    const latest=data[0];
    if(!latest?.sha)throw Error('Missing commit fingerprint');
    const fingerprint=latest.sha;
    const detail=`Latest upstream commit ${fingerprint.slice(0,12)}: ${(latest.commit?.message??'').split('\n')[0].slice(0,180)}. Review ${feed.url}`;
    const statements=[db.prepare('UPDATE monitored_sources SET checked_at=?,etag=?,fingerprint=?,last_status=? WHERE id=?').bind(now,response.headers.get('etag'),fingerprint,status,feed.id)];
    if(previous?.fingerprint&&previous.fingerprint!==fingerprint)statements.push(db.prepare('INSERT INTO monitoring_events(id,source_id,detected_at,kind,detail) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),feed.id,now,'upstream-change',detail));
    await db.batch(statements);
  }catch(error){
    await db.prepare('UPDATE monitored_sources SET checked_at=?,last_status=? WHERE id=?').bind(new Date().toISOString(),status,feed.id).run();
    if(previous?.last_status!==status)await event(db,feed.id,'check-error',`Repository check failed: ${error instanceof Error?error.message:'unknown error'}. Review ${feed.url}`);
  }
}

async function checkLink(db:D1Database,resource:{id:string;name:string;source_url:string}):Promise<void>{
  const feed={id:`link:${resource.id}`,name:`Primary source: ${resource.name}`,url:resource.source_url};
  const previous=await register(db,feed);
  // Editor may change the source URL. Its next check uses the current URL.
  await db.prepare('UPDATE monitored_sources SET name=?,url=? WHERE id=?').bind(feed.name,feed.url,feed.id).run();
  let status=0;
  try{
    let response=await fetch(feed.url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(10000)});
    if([403,405,501].includes(response.status))response=await fetch(feed.url,{method:'GET',redirect:'follow',signal:AbortSignal.timeout(10000)});
    status=response.status;
    const now=new Date().toISOString();
    await db.prepare('UPDATE monitored_sources SET checked_at=?,last_status=? WHERE id=?').bind(now,status,feed.id).run();
    if([404,410].includes(status)&&previous?.last_status!==status)await event(db,feed.id,'broken-link',`Primary source returned HTTP ${status}: ${feed.url}`);
    if(response.ok&&[404,410].includes(previous?.last_status??0))await event(db,feed.id,'link-restored',`Primary source is reachable again: ${feed.url}`);
  }catch{
    await db.prepare('UPDATE monitored_sources SET checked_at=?,last_status=? WHERE id=?').bind(new Date().toISOString(),status,feed.id).run();
    // Timeouts and anti-bot responses are not evidence that a link is broken.
  }
}

async function discoverPapers(db:D1Database,week:number):Promise<void>{
  const query=queries[week%queries.length];
  const id=`crossref:${week%queries.length}`;
  const url=new URL('https://api.crossref.org/works');
  url.searchParams.set('query.title',query);
  url.searchParams.set('rows','15');
  url.searchParams.set('select','DOI,title,published');
  const feed={id,name:`Crossref: ${query}`,url:url.toString()};
  const previous=await register(db,feed);
  let status=0;
  try{
    const response=await fetch(feed.url,{headers:{'User-Agent':'Cyberdeception-Atlas/1.0 (metadata monitoring)'},signal:AbortSignal.timeout(12000)});
    status=response.status;
    if(!response.ok)throw Error(`HTTP ${status}`);
    const body=await response.json() as {message?:{items?:Array<{DOI?:string;title?:string[]}>}};
    if(!body.message?.items)throw Error('Missing Crossref items');
    const relevant=/honeypot|honey\s?token|cyber.?deception|defensive deception|moving target defen[sc]e|ciber.?engaño|engaño cibernético|decepção cibernética|deception cibernética/i;
    const items=(body.message?.items??[]).filter(item=>item.DOI&&relevant.test(item.title?.[0]??''));
    const dois=[...new Set(items.map(item=>item.DOI!.toLowerCase()))].sort();
    const old=new Set((previous?.fingerprint??'').split('|').filter(Boolean));
    const knownRows=(await db.prepare("SELECT lower(json_extract(data,'$.doi')) AS doi FROM resources WHERE status='published' AND kind='paper' AND json_extract(data,'$.doi') IS NOT NULL").all<{doi:string}>()).results;
    const known=new Set(knownRows.map(row=>row.doi));
    const newCandidates=items.filter(item=>!old.has(item.DOI!.toLowerCase())&&!known.has(item.DOI!.toLowerCase()));
    const now=new Date().toISOString();
    await db.prepare('UPDATE monitored_sources SET checked_at=?,fingerprint=?,last_status=? WHERE id=?').bind(now,dois.join('|'),status,id).run();
    if(previous?.last_status===200&&newCandidates.length)await event(db,id,'literature-candidate',`${newCandidates.length} metadata candidate(s) for ${query}: ${newCandidates.slice(0,3).map(item=>`${item.DOI} ${item.title?.[0]??''}`).join(' | ')}. Verify abstracts or full text before publication.`);
  }catch(error){
    await db.prepare('UPDATE monitored_sources SET checked_at=?,last_status=? WHERE id=?').bind(new Date().toISOString(),status,id).run();
    if(previous?.last_status!==status)await event(db,id,'check-error',`Crossref check failed: ${error instanceof Error?error.message:'unknown error'}`);
  }
}

export default {
  async scheduled(_event:ScheduledEvent,env:Env,context:ExecutionContext){
    context.waitUntil((async()=>{
      await env.DB.prepare('DELETE FROM usage_limits WHERE expires_at < ?').bind(new Date().toISOString()).run();
      const day=Math.floor(Date.now()/86400000);
      const repositoryStart=(day%Math.ceil(repositories.length/4))*4;
      for(const feed of repositories.slice(repositoryStart,repositoryStart+4))await checkRepository(env.DB,feed);
      const count=await env.DB.prepare("SELECT count(*) AS n FROM resources WHERE status='published'").first<{n:number}>();
      const total=count?.n??0;
      if(total){
        const offset=(day%Math.ceil(total/4))*4;
        const links=(await env.DB.prepare("SELECT id,name,source_url FROM resources WHERE status='published' ORDER BY id LIMIT 4 OFFSET ?").bind(offset).all<{id:string;name:string;source_url:string}>()).results;
        for(const resource of links)await checkLink(env.DB,resource);
      }
      if(day%7===0)await discoverPapers(env.DB,Math.floor(day/7));
    })());
  }
};
