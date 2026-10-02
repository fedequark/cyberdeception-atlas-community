export const documents = [
  {slug:'state',es:'Estado de cyberdeception',en:'State of cyber deception',category:'research',esDescription:'Técnicas, oferta, evidencia y tendencias.',enDescription:'Techniques, offerings, evidence and trends.'},
  {slug:'executive',es:'De la pregunta a la prueba',en:'From question to test',category:'research',esDescription:'Un recorrido para definir, respaldar y medir una prueba de cyberdeception.',enDescription:'A route to define, support and measure a cyber deception test.'},
  {slug:'ecosystem',es:'Mapa del ecosistema',en:'Ecosystem map',category:'research',esDescription:'Instituciones, software, proveedores e investigación.',enDescription:'Institutions, software, providers and research.'},
  {slug:'gaps',es:'Preguntas abiertas',en:'Open questions',category:'research',esDescription:'Resultados comparables y evidencia todavía ausente.',enDescription:'Comparable outcomes and missing evidence.'},
  {slug:'protocol',es:'Protocolo de evaluación comparable',en:'Comparable evaluation protocol',category:'guide',esDescription:'Escenarios, baseline, métricas y resultados negativos.',enDescription:'Scenarios, baseline, metrics and negative outcomes.'},
  {slug:'start',es:'Primera implementación',en:'First deployment',category:'guide',esDescription:'Definir una hipótesis y desplegar un señuelo.',enDescription:'Define a hypothesis and deploy a decoy.'},
  {slug:'evaluate',es:'Evaluar soluciones y servicios',en:'Evaluate products and services',category:'guide',esDescription:'Comparar ofertas con una prueba documentada.',enDescription:'Compare offerings with a documented test.'},
  {slug:'lab',es:'Laboratorio reproducible',en:'Reproducible lab',category:'guide',esDescription:'Diseñar y registrar experimentos.',enDescription:'Design and record experiments.'},
  {slug:'measure',es:'Medición de resultados',en:'Measuring outcomes',category:'guide',esDescription:'Separar señales útiles, cobertura y costo operativo.',enDescription:'Separate useful signals, coverage and operating cost.'},
] as const;
export type DocumentSlug = typeof documents[number]['slug'];
