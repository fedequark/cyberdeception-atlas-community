import { readFileSync } from 'node:fs';
import { coverageCatalog } from './coverage-catalog.mjs';
import { expansionCatalog } from './expansion-catalog.mjs';
import { ownerCatalog, ownerRelationships } from './owner-catalog.mjs';
import { communitySoftware } from './community-software.mjs';
import { researchPapers } from './research-papers.mjs';
import { fullTextReviews } from './fulltext-reviews.mjs';
// Curated records. Each entry is reviewed against the linked source at the
// stated depth. Publisher metadata is never presented as a reading of a paper.
const reviewedAt = '2026-09-15';
const make = (kind, slug, name, organization, source_url, summary_es, summary_en, details = {}) => ({
  id: slug, slug, kind, name, organization, source_url, summary_es, summary_en,
  year: details.year ?? null, evidence: details.evidence ?? (kind === 'software' ? 'repository-documentation' : kind === 'paper' ? 'paper-abstract' : kind === 'case-study' ? 'published-case' : 'vendor-claim'),
  status: 'published', reviewed_at: reviewedAt, updated_at: reviewedAt,
  data: {
    techniques: details.techniques ?? [], environments: details.environments ?? [],
    tags: details.tags ?? [], review_basis: details.review_basis ?? (kind === 'software' ? 'repository-metadata' : kind === 'paper' ? 'abstract' : 'source-page'),
    access_date: reviewedAt, source_title: details.source_title ?? name,
    ...(details.license ? { license: details.license } : {}),
    ...(details.doi ? { doi: details.doi } : {}),
    ...(details.journal ? { journal: details.journal } : {}),
    ...(details.authors ? { authors: details.authors } : {}),
    ...(details.limitations_es ? { limitations_es: details.limitations_es } : {}),
    ...(details.limitations_en ? { limitations_en: details.limitations_en } : {}),
  }
});
const S = (slug,name,org,url,es,en,techniques,environments,extras={}) => make('software',slug,name,org,url,es,en,{techniques,environments,...extras});
const P = (slug,name,org,url,es,en,techniques,environments,extras={}) => make('product',slug,name,org,url,es,en,{techniques,environments,...extras});
const A = (slug,name,org,url,es,en,year,techniques,environments,extras={}) => make('paper',slug,name,org,url,es,en,{year,techniques,environments,...extras});

const baseCatalog = [
  S('opencanary','OpenCanary','Thinkst','https://github.com/thinkst/opencanary','Honeypot de red multiprotocolo para detectar interacciones sospechosas en redes internas.','Multi-protocol network honeypot for detecting suspicious interactions inside networks.',['Honeypot'],['Network']),
  S('cowrie','Cowrie','Cowrie contributors','https://github.com/cowrie/cowrie','Honeypot SSH y Telnet que registra intentos de acceso y sesiones del atacante.','SSH and Telnet honeypot that records login attempts and attacker sessions.',['Honeypot'],['Network']),
  S('t-pot','T-Pot','Telekom Security','https://github.com/telekom-security/tpotce','Plataforma que reúne varios honeypots y herramientas de análisis en una instalación.','Platform combining multiple honeypots and analysis tools in one deployment.',['Honeypot'],['Network','IoT']),
  S('dionaea','Dionaea','DinoTools','https://github.com/DinoTools/dionaea','Proyecto de honeypot para observar intentos de explotación de servicios de red.','Honeypot project for observing attacks against network services.',['Honeypot'],['Network']),
  S('glastopf','Glastopf','mushorg','https://github.com/mushorg/glastopf','Honeypot para aplicaciones web que registra interacciones con superficies simuladas.','Web application honeypot recording interactions with simulated attack surfaces.',['Honeypot'],['Application']),
  S('snare','SNARE','mushorg','https://github.com/mushorg/snare','Componente de honeypot web reactivo desarrollado por el equipo de mushorg.','Reactive web honeypot component developed by the mushorg team.',['Honeypot'],['Application']),
  S('galah','Galah','0x4D31','https://github.com/0x4D31/galah','Honeypot web que utiliza un modelo de lenguaje para generar interacciones.','Web honeypot using a language model to generate interactions.',['Honeypot'],['Application']),
  S('adbhoney','ADBHoney','huuck','https://github.com/huuck/ADBHoney','Honeypot de baja interacción que simula el servicio Android Debug Bridge.','Low-interaction honeypot simulating the Android Debug Bridge service.',['Honeypot'],['IoT']),
  S('canarytokens-open','Canarytokens','Thinkst','https://github.com/thinkst/canarytokens','Proyecto abierto para generar tokens señuelo que alertan cuando alguien los utiliza.','Open project for creating decoy tokens that alert when someone uses them.',['Honeytoken'],['Identity','Cloud']),
  S('honeytrap','Honeytrap','Honeytrap contributors','https://github.com/honeytrap/honeytrap','Framework abierto para crear y operar sensores honeypot.','Open framework for building and operating honeypot sensors.',['Honeypot'],['Network']),

  A('cydec-state-2024','Cyber Deception: State of the Art, Trends and Open Challenges','Beltrán López et al.','https://arxiv.org/abs/2409.07194','Revisión que propone una taxonomía y compara líneas de investigación en cyberdeception, incluidas las que usan IA.','Survey proposing a taxonomy and comparing cyber deception research lines, including AI-based work.',2024,['Adversary engagement'],['Network','Cloud'],{authors:['Pedro Beltrán López','Manuel Gil Pérez','Pantaleone Nespoli']}),
  A('cydec-survey-2020','Cyber Deception for Computer and Network Security: Survey and Challenges','Lu et al.','https://arxiv.org/abs/2007.14497','Revisión de modelos y técnicas de engaño defensivo en redes, sistemas y mecanismos criptográficos.','Survey of defensive deception models and techniques in networks, hosts and cryptographic mechanisms.',2020,['Decoy'],['Network','Endpoint'],{authors:['Zhuo Lu','Cliff Wang','Shangqing Zhao']}),
  A('game-taxonomy-2017','A Game-Theoretic Taxonomy and Survey of Defensive Deception for Cybersecurity and Privacy','Pawlick et al.','https://arxiv.org/abs/1712.05441','Taxonomía basada en teoría de juegos que distingue varios tipos de engaño defensivo.','Game-theoretic taxonomy distinguishing several forms of defensive deception.',2017,['Moving target defense','Honeytoken'],['Network'],{authors:['Jeffrey Pawlick','Edward Colbert','Quanyan Zhu']}),
  A('llm-honeypot-2024','LLM Honeypot: Leveraging Large Language Models as Advanced Interactive Honeypot Systems','Otal & Canbaz','https://arxiv.org/abs/2409.08234','Presenta un honeypot interactivo basado en un modelo de lenguaje ajustado con datos de comandos de atacantes.','Presents an interactive honeypot using a language model fine-tuned with attacker command data.',2024,['Honeypot'],['Network'],{authors:['Hakan T. Otal','M. Abdullah Canbaz']}),
  A('honeygpt-2024','HoneyGPT: Breaking the Trilemma in Terminal Honeypots with Large Language Model','Wang et al.','https://arxiv.org/abs/2406.01882','Presenta una arquitectura de honeypot de terminal con modelo de lenguaje y describe su evaluación en campo.','Presents a language-model terminal honeypot architecture and describes a field evaluation.',2024,['Honeypot'],['Network']),
  A('network-requirements-2023','A Survey of Network Requirements for Enabling Effective Cyber Deception','Sayed et al.','https://arxiv.org/abs/2309.00184','Revisión de requisitos de red necesarios para implementar técnicas de cyberdeception.','Survey of network requirements for implementing cyber deception techniques.',2023,['Decoy'],['Network']),
  A('deception-mtd-simulation-2023','Evaluating Deception and Moving Target Defense with Network Attack Simulation','Research authors','https://arxiv.org/abs/2301.10629','Propone un método de simulación para evaluar honeypots y moving target defense en redes.','Proposes a simulation method for evaluating honeypots and moving target defense in networks.',2023,['Honeypot','Moving target defense'],['Network']),
  A('honeytoken-generator-2024','Act as a Honeytoken Generator! An Investigation into Honeytoken Generation with Large Language Models','Publication authors','https://doi.org/10.1145/3689935.3690394','Publicación identificada por DOI sobre generación de honeytokens mediante modelos de lenguaje; análisis pendiente del texto.','DOI-identified publication on language-model honeytoken generation; text analysis is pending.',2024,['Honeytoken'],['Identity'],{doi:'10.1145/3689935.3690394',review_basis:'publisher-metadata',evidence:'publisher-metadata'}),
  A('honeytoken-fingerprinting-2020','Towards Systematic Honeytoken Fingerprinting','Publication authors','https://doi.org/10.1145/3433174.3433599','Publicación identificada por DOI sobre métodos de identificación de honeytokens; análisis pendiente del texto.','DOI-identified publication on honeytoken fingerprinting methods; text analysis is pending.',2020,['Honeytoken'],['Identity'],{doi:'10.1145/3433174.3433599',review_basis:'publisher-metadata',evidence:'publisher-metadata'}),
  A('honey-infiltrator-2023','Honey Infiltrator: Injecting Honeytoken Using Netfilter','Publication authors','https://doi.org/10.1109/eurospw59978.2023.00057','Publicación identificada por DOI sobre inserción de honeytokens con Netfilter; análisis pendiente del texto.','DOI-identified publication on injecting honeytokens using Netfilter; text analysis is pending.',2023,['Honeytoken'],['Network'],{doi:'10.1109/eurospw59978.2023.00057',review_basis:'publisher-metadata',evidence:'publisher-metadata'}),

  P('thinkst-canary','Thinkst Canary','Thinkst','https://canary.tools/','Producto comercial de señuelos para detectar interacciones con sistemas que aparentan ser legítimos.','Commercial decoy product for detecting interactions with systems that appear legitimate.',['Honeypot','Honeytoken'],['Network','Identity']),
  P('fortideceptor','FortiDeceptor','Fortinet','https://www.fortinet.com/products/fortideceptor','Plataforma de Fortinet para desplegar activos señuelo y alertar sobre su uso.','Fortinet platform for deploying decoy assets and alerting on their use.',['Decoy','Honeypot'],['Network','OT/ICS']),
  P('shadowplex','ShadowPlex','Acalvio','https://www.acalvio.com/products/','Familia comercial de deception para identidad, cloud y redes, según la documentación de Acalvio.','Commercial deception portfolio for identity, cloud and networks, according to Acalvio documentation.',['Decoy','Honeytoken'],['Identity','Cloud','Network']),
  P('countercraft-platform','The Platform','CounterCraft','https://www.countercraftsec.com/products/','Plataforma comercial que utiliza señuelos para detección e inteligencia de amenazas, según CounterCraft.','Commercial platform using decoys for detection and threat intelligence, according to CounterCraft.',['Decoy','Adversary engagement'],['Network','Cloud']),
  P('zscaler-deception','Zscaler Deception','Zscaler','https://www.zscaler.com/products-and-solutions/deception-technology','Producto de Zscaler que distribuye señuelos y alertas por interacción, según su página comercial.','Zscaler product distributing decoys and interaction alerts, according to its product page.',['Decoy','Honeytoken'],['Network','Identity']),
  P('tracebit-platform','Tracebit','Tracebit','https://tracebit.com/','Plataforma comercial de deception con casos publicados para entornos cloud.','Commercial deception platform with published cloud case studies.',['Honeytoken','Decoy'],['Cloud']),

  make('framework','mitre-engage','MITRE Engage','MITRE','https://github.com/mitre/engage','Framework para planificar y comunicar actividades de denial, deception y adversary engagement.','Framework for planning and communicating denial, deception and adversary engagement.',{techniques:['Adversary engagement'],environments:['Network','Cloud'],evidence:'framework-documentation'}),
  make('framework','mitre-d3fend','MITRE D3FEND','MITRE','https://d3fend.mitre.org/','Base de conocimiento de técnicas defensivas que ofrece vocabulario relacionado con señuelos.','Knowledge base of defensive techniques with terminology related to decoys.',{techniques:['Decoy'],environments:['Network'],evidence:'framework-documentation'}),
  make('case-study','riot-games-tracebit','Riot Games / Tracebit','Tracebit','https://tracebit.com/customer/riot-games','Experiencia de adopción de deception en cloud publicada por el proveedor Tracebit.','Cloud deception adoption story published by the vendor Tracebit.',{techniques:['Honeytoken'],environments:['Cloud'],source_title:'Riot Games | Tracebit Customer Stories',limitations_es:'El relato está publicado por el proveedor. Sus afirmaciones deben leerse en ese contexto.',limitations_en:'The story is published by the vendor. Its claims should be read in that context.'}),
  make('community','awesome-honeypots','Awesome Honeypots','Community contributors','https://github.com/paralax/awesome-honeypots','Lista comunitaria de proyectos y materiales sobre honeypots; cada enlace requiere verificación propia.','Community list of honeypot projects and materials; each link requires separate verification.',{techniques:['Honeypot'],environments:['Network','Application'],evidence:'community-directory'}),
  ...JSON.parse(readFileSync(new URL('./papers-reviewed.json',import.meta.url),'utf8')),
  ...JSON.parse(readFileSync(new URL('./software-reviewed.json',import.meta.url),'utf8')),
  ...coverageCatalog,
  ...expansionCatalog,
  ...ownerCatalog,
  ...communitySoftware,
  ...researchPapers,
];

export const catalog = baseCatalog.map(resource => {
  const review = fullTextReviews[resource.slug];
  return review ? {
    ...resource,
    summary_es: review.finding_es,
    summary_en: review.finding_en,
    evidence:'full-text-review',
    reviewed_at:review.full_text_reviewed_at,
    updated_at:review.full_text_reviewed_at === '2026-09-16' ? '2026-09-18' : review.full_text_reviewed_at,
    data:{
      ...resource.data,
      ...(review.full_text_reviewed_at === '2026-09-16' ? {} : { access_date:review.full_text_reviewed_at }),
      prior_summary_es: resource.summary_es,
      prior_summary_en: resource.summary_en,
      review_basis:'full-text',
      limitations_es:review.limits_es,
      limitations_en:review.limits_en,
      ...review
    }
  } : resource;
});

export const relationships = [
  ...ownerRelationships,
  ['honeywords-2013','canarytokens-open','foundational honeytoken concept'],
  ['canarytokens-open','honeywords-2013','related research'],
  ['honeytoken-auth-2021','honeywords-2013','extends honeyword approach'],
  ['agents-shared-memory-2026','canarytokens-open','shared honeytoken area'],
  ['deception-challenges-2021','buda-user-behavior-2026','realistic artifact generation'],
  ['buda-user-behavior-2026','base4-buda','implemented by'],
  ['three-decades-2021','t-pot','surveys honeypot family'],
  ['doi-10-11591-ijece-v15i1-pp1089-1098','fortideceptor','shared OT/ICS area'],
  ['doi-10-1109-eurospw61312-2024-00053','countercraft-platform','application deception area'],
  ['playground-experiential-learning-2026','base4-cyberdeception-playground','implemented by'],
  ['opencanary','thinkst-canary','open-source counterpart'],
  ['thinkst-canary','opencanary','open-source counterpart'],
  ['t-pot','cowrie','includes or integrates'],
  ['t-pot','dionaea','includes or integrates'],
  ['t-pot','galah','includes or integrates'],
  ['riot-games-tracebit','tracebit-platform','describes'],
  ['tracebit-platform','riot-games-tracebit','has case study'],
  ['cydec-state-2024','mitre-engage','related taxonomy'],
  ['proofpoint-energy-shadow','proofpoint-shadow','describes'],
  ['proofpoint-shadow','proofpoint-energy-shadow','has case study'],
  ['fidelis-childrens-hospital','fidelis-deception','describes'],
  ['fidelis-deception','fidelis-childrens-hospital','has case study'],
  ['countercraft-global-bank-api','countercraft-platform','describes'],
  ['countercraft-platform','countercraft-global-bank-api','has case study'],
  ['proofpoint-cargo-decoy-2026','deception-pro-platform','uses'],
  ['ibm-itg27-deception-2026','deception-pro-platform','uses'],
  ['acalvio-managed-targeted-intel','acalvio-targeted-threat-intel','supports'],
  ['cowrie','llm-honeypot-2024','shared SSH honeypot research area'],
  ['llm-honeypot-2024','cowrie','shared SSH honeypot research area'],
  ['cowrie','honeygpt-2024','shared terminal honeypot research area'],
  ['honeygpt-2024','cowrie','shared terminal honeypot research area'],
  ['galah','llm-honeypot-2024','shared LLM honeypot research area'],
  ['llm-honeypot-2024','galah','shared LLM honeypot research area'],
  ['galah','honeygpt-2024','shared LLM honeypot research area'],
  ['honeygpt-2024','galah','shared LLM honeypot research area'],
  ['canarytokens-open','honeytoken-generator-2024','shared honeytoken research area'],
  ['honeytoken-generator-2024','canarytokens-open','shared honeytoken research area'],
  ['canarytokens-open','honeytoken-fingerprinting-2020','shared honeytoken research area'],
  ['honeytoken-fingerprinting-2020','canarytokens-open','shared honeytoken research area'],
  ['glastopf','snare','shared web honeypot ecosystem'],
  ['snare','glastopf','shared web honeypot ecosystem'],
  ['glastopf','gh-mushorg-tanner','shared web honeypot ecosystem'],
  ['gh-mushorg-tanner','glastopf','shared web honeypot ecosystem'],
  ['fortideceptor','gh-mushorg-conpot','shared OT/ICS deception area'],
  ['gh-mushorg-conpot','fortideceptor','shared OT/ICS deception area'],
  ['fortideceptor','acalvio-industrial-reference','shared OT/ICS deception area'],
  ['acalvio-industrial-reference','fortideceptor','shared OT/ICS deception area'],
  ['tracebit-platform','zenodo-cloud-honeynet','shared cloud deception area'],
  ['zenodo-cloud-honeynet','tracebit-platform','shared cloud deception area'],
  ['mitre-d3fend','mitre-engage','complementary defensive framework'],
  ['mitre-engage','mitre-d3fend','complementary defensive framework'],
  ['cydec-state-2024','cydec-survey-2020','related field survey'],
  ['cydec-survey-2020','cydec-state-2024','related field survey'],
  ['game-taxonomy-2017','cydec-survey-2020','related taxonomy'],
  ['cydec-survey-2020','game-taxonomy-2017','related taxonomy'],
  ['deception-mtd-simulation-2023','game-taxonomy-2017','shared MTD research area'],
  ['game-taxonomy-2017','deception-mtd-simulation-2023','shared MTD research area'],
  ['zenodo-cyberlab-honeynet','cowrie','shared honeynet research area'],
  ['cowrie','zenodo-cyberlab-honeynet','shared honeynet research area'],
  ['ncsc-deception-trials','mitre-engage','shared practice and evaluation area'],
  ['mitre-engage','ncsc-deception-trials','shared practice and evaluation area'],
  ['microsoft-defender-identity-honeytoken','canarytokens-open','shared identity lure area'],
  ['canarytokens-open','microsoft-defender-identity-honeytoken','shared identity lure area'],
];
