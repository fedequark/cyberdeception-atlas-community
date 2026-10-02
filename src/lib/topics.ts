export type TopicGroup = 'technique' | 'environment';
export interface Topic {
  slug: string;
  group: TopicGroup;
  label: string;
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  question_es: string;
  question_en: string;
  libraryFilter: string;
  sourceLabel: string;
  sourceUrl: string;
  guide: 'start' | 'evaluate' | 'lab' | 'measure';
}

// Editorial entry points. These are navigational labels, not claims that the
// catalog covers every technique, sector or geography.
export const topics: Topic[] = [
  {
    slug:'honeypots',group:'technique',label:'Honeypot',title_es:'Honeypots y honeynets',title_en:'Honeypots and honeynets',
    description_es:'Sistemas y servicios preparados para observar interacciones que una operación legítima no debería producir.',
    description_en:'Systems and services prepared to observe interactions that ordinary operations should not produce.',
    question_es:'¿Qué interacción simula el señuelo y qué datos recoge?',question_en:'What interaction does the lure simulate and what data does it collect?',
    libraryFilter:'technique=Honeypot',sourceLabel:'MITRE D3FEND — Decoy Environment',sourceUrl:'https://d3fend.mitre.org/technique/d3f:DecoyEnvironment/',guide:'lab'
  },
  {
    slug:'honeytokens',group:'technique',label:'Honeytoken',title_es:'Honeytokens y credenciales señuelo',title_en:'Honeytokens and decoy credentials',
    description_es:'Datos, credenciales o identificadores creados para generar una señal cuando alguien los consulta o utiliza.',
    description_en:'Data, credentials or identifiers created to generate a signal when someone accesses or uses them.',
    question_es:'¿Qué uso debe activar una alerta y cómo se evita que el token sea legítimo?',question_en:'What use should trigger an alert and how is legitimate use ruled out?',
    libraryFilter:'technique=Honeytoken',sourceLabel:'MITRE D3FEND — Decoy User Credential',sourceUrl:'https://d3fend.mitre.org/technique/d3f:DecoyUserCredential/',guide:'start'
  },
  {
    slug:'decoys',group:'technique',label:'Decoy',title_es:'Activos y objetos señuelo',title_en:'Decoy assets and objects',
    description_es:'Activos simulados que pueden orientar el reconocimiento o hacer visible una interacción sospechosa.',
    description_en:'Simulated assets that can steer reconnaissance or make a suspicious interaction visible.',
    question_es:'¿Qué activo real imita el señuelo y qué riesgo introduce?',question_en:'What real asset does the decoy resemble and what risk does it introduce?',
    libraryFilter:'technique=Decoy',sourceLabel:'MITRE D3FEND — Deceive',sourceUrl:'https://d3fend.mitre.org/',guide:'start'
  },
  {
    slug:'adversary-engagement',group:'technique',label:'Adversary engagement',title_es:'Interacción con adversarios',title_en:'Adversary engagement',
    description_es:'Operaciones planificadas para observar decisiones adversarias y aprender de ellas manteniendo control defensivo.',
    description_en:'Planned operations to observe adversary decisions and learn from them while maintaining defensive control.',
    question_es:'¿Cuál es la hipótesis, quién controla la operación y cómo se interpretan los resultados?',question_en:'What is the hypothesis, who controls the operation and how are results interpreted?',
    libraryFilter:'technique=Adversary+engagement',sourceLabel:'MITRE Engage — Practical Guide',sourceUrl:'https://engage.mitre.org/wp-content/uploads/2022/04/EngageHandbook-v1.0.pdf',guide:'measure'
  },
  {
    slug:'moving-target-defense',group:'technique',label:'Moving target defense',title_es:'Defensa de objetivo móvil',title_en:'Moving target defense',
    description_es:'Cambios deliberados del entorno que pueden dificultar el reconocimiento. Se trata como área relacionada cuando no hay engaño explícito.',
    description_en:'Deliberate environment changes that can hinder reconnaissance. Treated as a related area when no explicit deception is involved.',
    question_es:'¿El cambio induce una percepción falsa o simplemente altera la superficie de ataque?',question_en:'Does the change create a false perception or merely alter the attack surface?',
    libraryFilter:'technique=Moving+target+defense',sourceLabel:'Cyber Deception — State of the Art',sourceUrl:'https://arxiv.org/abs/2409.07194',guide:'evaluate'
  },
  {
    slug:'network',group:'environment',label:'Network',title_es:'Redes y servicios',title_en:'Networks and services',
    description_es:'Señuelos para servicios, protocolos y activos de red, internos o expuestos.',
    description_en:'Lures for network services, protocols and assets, internal or exposed.',
    question_es:'¿Qué tráfico se considera inesperado y dónde se ubica el sensor?',question_en:'What traffic is unexpected and where is the sensor placed?',
    libraryFilter:'environment=Network',sourceLabel:'MITRE D3FEND — Decoy Network Resource',sourceUrl:'https://d3fend.mitre.org/technique/d3f:DecoyNetworkResource/',guide:'start'
  },
  {
    slug:'identity',group:'environment',label:'Identity',title_es:'Identidad y credenciales',title_en:'Identity and credentials',
    description_es:'Cuentas, credenciales y tokens señuelo ligados a acceso y movimiento lateral.',
    description_en:'Decoy accounts, credentials and tokens linked to access and lateral movement.',
    question_es:'¿Quién puede encontrar el señuelo y qué evento confirma su uso?',question_en:'Who can encounter the lure and what event confirms its use?',
    libraryFilter:'environment=Identity',sourceLabel:'Microsoft Defender for Identity — Entity Tags',sourceUrl:'https://learn.microsoft.com/en-us/defender-for-identity/entity-tags',guide:'start'
  },
  {
    slug:'cloud',group:'environment',label:'Cloud',title_es:'Cloud y entornos híbridos',title_en:'Cloud and hybrid environments',
    description_es:'Objetos, permisos y cargas señuelo distribuidos en servicios cloud e integraciones híbridas.',
    description_en:'Decoy objects, permissions and workloads distributed across cloud services and hybrid integrations.',
    question_es:'¿Cómo se limita el acceso del señuelo y cómo se trazan los eventos?',question_en:'How is lure access constrained and how are events traced?',
    libraryFilter:'environment=Cloud',sourceLabel:'MITRE Engage — Practical Guide',sourceUrl:'https://engage.mitre.org/wp-content/uploads/2022/04/EngageHandbook-v1.0.pdf',guide:'evaluate'
  },
  {
    slug:'application',group:'environment',label:'Application',title_es:'Aplicaciones y APIs',title_en:'Applications and APIs',
    description_es:'Servicios web, rutas y datos señuelo asociados a aplicaciones y APIs.',
    description_en:'Decoy web services, routes and data associated with applications and APIs.',
    question_es:'¿Qué interacción puede atribuirse al señuelo y cómo se protege la aplicación real?',question_en:'What interaction is attributable to the lure and how is the real application protected?',
    libraryFilter:'environment=Application',sourceLabel:'OWASP Web Security Testing Guide',sourceUrl:'https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/README',guide:'lab'
  },
  {
    slug:'ot-ics',group:'environment',label:'OT/ICS',title_es:'OT, ICS e infraestructura crítica',title_en:'OT, ICS and critical infrastructure',
    description_es:'Señuelos para redes industriales donde seguridad de proceso y aislamiento del laboratorio son condiciones centrales.',
    description_en:'Lures for industrial networks where process safety and lab isolation are central conditions.',
    question_es:'¿Cómo se prueba sin afectar el proceso industrial ni atribuir eficacia que no se midió?',question_en:'How is it tested without affecting the industrial process or claiming unmeasured effectiveness?',
    libraryFilter:'environment=OT%2FICS',sourceLabel:'MITRE D3FEND — Decoy Environment',sourceUrl:'https://d3fend.mitre.org/technique/d3f:DecoyEnvironment/',guide:'lab'
  },
  {
    slug:'endpoint',group:'environment',label:'Endpoint',title_es:'Endpoints y puestos de trabajo',title_en:'Endpoints and workstations',
    description_es:'Señuelos y artefactos defensivos ubicados en endpoints para hacer visible la exploración o el uso indebido.',
    description_en:'Defensive lures and artifacts placed on endpoints to expose reconnaissance or misuse.',
    question_es:'¿Qué interacción con el endpoint activa la señal y cómo se distingue de la actividad legítima?',question_en:'What endpoint interaction triggers the signal and how is it distinguished from legitimate activity?',
    libraryFilter:'environment=Endpoint',sourceLabel:'MITRE D3FEND — Decoy File',sourceUrl:'https://d3fend.mitre.org/technique/d3f:DecoyFile/',guide:'start'
  },
  {
    slug:'iot',group:'environment',label:'IoT',title_es:'IoT y dispositivos conectados',title_en:'IoT and connected devices',
    description_es:'Señuelos que representan dispositivos y protocolos conectados, con atención a su aislamiento y telemetría.',
    description_en:'Lures representing connected devices and protocols, with attention to isolation and telemetry.',
    question_es:'¿Qué comportamiento del dispositivo se simula y cómo se aísla el señuelo del entorno real?',question_en:'What device behavior is simulated and how is the lure isolated from the real environment?',
    libraryFilter:'environment=IoT',sourceLabel:'NISTIR 8259 — IoT Device Cybersecurity Capability Core Baseline',sourceUrl:'https://csrc.nist.gov/pubs/ir/8259/a/final',guide:'lab'
  }
];
export const topicBySlug = Object.fromEntries(topics.map(topic=>[topic.slug,topic])) as Record<string,Topic>;
