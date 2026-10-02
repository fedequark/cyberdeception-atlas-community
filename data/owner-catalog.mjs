// Original BASE4 Security contributions by Federico Pacheco and collaborators.
// Sources were checked on 2026-09-15. Descriptions follow the linked repository
// and publication; they do not imply independent effectiveness testing.
const date = '2026-09-15';
const authors = ['Federico Pacheco', 'Diego Staino'];
const make = (kind, slug, name, sourceUrl, es, en, year, techniques, environments, extras = {}) => ({
  id: slug,
  slug,
  kind,
  name,
  organization: kind === 'software' ? 'BASE4 Security' : 'Federico Pacheco y Diego Staino',
  source_url: sourceUrl,
  summary_es: es,
  summary_en: en,
  year,
  evidence: kind === 'software' ? 'repository-documentation' : 'paper-abstract',
  status: 'published',
  reviewed_at: date,
  updated_at: date,
  data: {
    techniques,
    environments,
    tags: ['BASE4 Security', ...authors],
    review_basis: kind === 'software' ? 'repository-metadata' : 'abstract',
    access_date: date,
    source_title: extras.sourceTitle ?? name,
    ...(kind === 'software' ? { license: extras.license } : { authors }),
    ...(extras.doi ? { doi: extras.doi } : {}),
    ...(extras.journal ? { journal: extras.journal } : {}),
    ...(extras.sourceLanguage ? { source_language: extras.sourceLanguage } : {}),
    limitations_es: extras.limitationsEs,
    limitations_en: extras.limitationsEn,
    disclosure_es: 'Federico Pacheco, responsable de este Atlas, participa en este proyecto o su publicación asociada. La ficha aplica los mismos criterios de fuentes y límites que el resto del catálogo; no constituye una evaluación independiente.',
    disclosure_en: 'Federico Pacheco, the Atlas owner, contributed to this project or its associated publication. This record follows the same source and limitation criteria as the rest of the catalog; it is not an independent evaluation.',
  },
});

export const ownerCatalog = [
  make('software', 'base4-buda', 'BUDA', 'https://github.com/Base4Security/BUDA',
    'Framework experimental que genera perfiles ficticios y actividad de usuarios para dar contexto a entornos señuelo; el repositorio documenta narrativas, perfiles e integración con modelos de lenguaje.',
    'Experimental framework generating fictitious user profiles and activity for decoy environments; the repository documents narratives, profiles and language-model integration.',
    2025, ['Decoy', 'Adversary engagement'], ['Endpoint', 'Network'], {
      license: 'GPL-3.0', sourceTitle: 'BUDA — código y documentación', sourceLanguage: 'en',
      limitationsEs: 'El repositorio y el paper describen el diseño y las funciones previstas. Esta ficha no verificó la calidad de las huellas generadas ni una mejora de detección en producción.',
      limitationsEn: 'The repository and paper describe the design and intended features. This record did not verify generated-trace quality or improved detection in production.',
    }),
  make('paper', 'buda-user-behavior-2026', 'Refuerzo de estrategias de ciber engaño mediante comportamiento simulado de usuarios', 'https://revistas.unlp.edu.ar/ejs/article/view/20422',
    'Pacheco y Staino presentan BUDA como propuesta para simular actividad de usuarios ficticios y reforzar la credibilidad de señuelos, alineada con MITRE Engage.',
    'Pacheco and Staino present BUDA as an approach to simulating fictitious-user activity and strengthening decoy credibility, aligned with MITRE Engage.',
    2026, ['Decoy', 'Adversary engagement'], ['Endpoint', 'Network'], {
      doi: '10.24215/15146774e095', journal: 'SADIO Electronic Journal of Informatics and Operations Research 25(1), e095',
      sourceTitle: 'SADIO EJS — artículo y resumen', sourceLanguage: 'es',
      limitationsEs: 'La ficha se basa en el resumen editorial; no se analizaron resultados del texto completo ni se verificó experimentalmente la eficacia de BUDA.',
      limitationsEn: 'This record is based on the publisher abstract; full-text results were not analyzed and BUDA effectiveness was not independently tested.',
    }),
  make('software', 'base4-dolos-t', 'DOLOS-T', 'https://github.com/Base4Security/DOLOS-T',
    'Framework abierto para planificar operaciones de deception y desplegar señuelos y servicios mediante Python y Docker, según el repositorio y su documentación.',
    'Open framework for planning deception operations and deploying decoys and services with Python and Docker, according to its repository and documentation.',
    2024, ['Decoy', 'Honeypot', 'Adversary engagement'], ['Network', 'Application'], {
      license: 'GPL-3.0', sourceTitle: 'DOLOS-T — código y documentación', sourceLanguage: 'en',
      limitationsEs: 'No se probó en esta revisión el aislamiento, la fidelidad de los señuelos ni su rendimiento operativo. El artículo relacionado propone una metodología, no una comparación de resultados.',
      limitationsEn: 'This review did not test isolation, decoy fidelity or operational performance. The related paper proposes a methodology, not a comparative outcome study.',
    }),
  make('paper', 'dolos-t-minimal-deception-2024', 'Propuesta para implementación de estrategias minimalistas de ciber engaño', 'https://www.researchgate.net/publication/379404267_Proposal_for_the_implementation_of_minimalistic_cyber_deception_strategies',
    'Preprint de Pacheco y Staino que propone un proceso cíclico y minimalista de deception y presenta DOLOS-T como herramienta abierta para experimentarlo.',
    'Pacheco and Staino preprint proposing a cyclical, minimal deception process and presenting DOLOS-T as an open tool for exploring it.',
    2024, ['Decoy', 'Adversary engagement'], ['Network', 'Application'], {
      doi: '10.13140/RG.2.2.34289.29289', sourceTitle: 'Preprint de los autores — ResearchGate', sourceLanguage: 'es',
      limitationsEs: 'Se trata de un preprint de propuesta y arquitectura. Las expectativas de eficacia y bajo impacto operativo no equivalen a una evaluación independiente.',
      limitationsEn: 'This is a proposal and architecture preprint. Expected effectiveness and low operational impact are not independent evaluations.',
    }),
  make('software', 'base4-cyberdeception-playground', 'Cyber Deception Playground', 'https://github.com/Base4Security/cyberdeception-playground',
    'Laboratorio abierto con Docker Compose, servicios vulnerables, niveles configurables de engaño, monitoreo y un entorno atacante para formación e investigación controlada.',
    'Open Docker Compose lab with vulnerable services, configurable deception levels, monitoring and an attacker environment for controlled training and research.',
    2026, ['Honeypot', 'Decoy', 'Honeytoken'], ['Network', 'Application'], {
      license: 'MIT', sourceTitle: 'Cyber Deception Playground — código y documentación', sourceLanguage: 'en',
      limitationsEs: 'El laboratorio contiene vulnerabilidades deliberadas y debe ejecutarse aislado. La ficha no demuestra mejoras de aprendizaje ni eficacia defensiva frente a otras prácticas.',
      limitationsEn: 'The lab contains intentional vulnerabilities and should run in isolation. This record does not establish learning gains or defensive effectiveness versus other approaches.',
    }),
  make('paper', 'playground-experiential-learning-2026', 'Aprendizaje experimental de ciberengaño mediante un entorno educativo reproducible', 'https://55jaiio.sadio.org.ar/wp-content/uploads/2026/07/21.pdf',
    'Artículo de Pacheco y Staino publicado en las memorias SACS 2026 que describe el diseño educativo reproducible de Cyber Deception Playground.',
    'Pacheco and Staino paper in the SACS 2026 proceedings describing the reproducible educational design of Cyber Deception Playground.',
    2026, ['Honeypot', 'Decoy', 'Honeytoken'], ['Network', 'Application'], {
      sourceTitle: '55JAIIO / SACS 2026 — artículo completo', sourceLanguage: 'es, en',
      limitationsEs: 'El artículo presenta una contribución de diseño. Sus autores indican que no ofrece evaluación empírica de aprendizaje ni una comparación de eficacia.',
      limitationsEn: 'The paper is a design contribution. Its authors state that it provides neither empirical learning evaluation nor comparative effectiveness results.',
    }),
];

export const ownerRelationships = [
  ['base4-buda', 'buda-user-behavior-2026', 'documented by'],
  ['buda-user-behavior-2026', 'base4-buda', 'describes'],
  ['base4-dolos-t', 'dolos-t-minimal-deception-2024', 'documented by'],
  ['dolos-t-minimal-deception-2024', 'base4-dolos-t', 'describes'],
  ['base4-cyberdeception-playground', 'playground-experiential-learning-2026', 'documented by'],
  ['playground-experiential-learning-2026', 'base4-cyberdeception-playground', 'describes'],
];

export const ownerSecondarySources = {
  'base4-buda': [{ key: 'paper', title: 'SADIO EJS — paper sobre BUDA', url: 'https://revistas.unlp.edu.ar/ejs/article/view/20422', basis: 'publisher-metadata' }],
  'buda-user-behavior-2026': [{ key: 'repository', title: 'BUDA — repositorio', url: 'https://github.com/Base4Security/BUDA', basis: 'repository-metadata' }],
  'base4-dolos-t': [{ key: 'paper', title: 'DOLOS-T — preprint asociado', url: 'https://www.researchgate.net/publication/379404267_Proposal_for_the_implementation_of_minimalistic_cyber_deception_strategies', basis: 'abstract' }],
  'dolos-t-minimal-deception-2024': [{ key: 'repository', title: 'DOLOS-T — repositorio', url: 'https://github.com/Base4Security/DOLOS-T', basis: 'repository-metadata' }],
  'base4-cyberdeception-playground': [{ key: 'paper', title: 'SACS 2026 — paper del Playground', url: 'https://55jaiio.sadio.org.ar/wp-content/uploads/2026/07/21.pdf', basis: 'abstract' }],
  'playground-experiential-learning-2026': [{ key: 'repository', title: 'Cyber Deception Playground — repositorio', url: 'https://github.com/Base4Security/cyberdeception-playground', basis: 'repository-metadata' }],
};
