# Estado de cyberdeception

**Mapa de evidencia versionado · versión correctiva 2026.09.2**

El [preprint bilingüe del proyecto](/es/downloads/#preprint) describe esta versión y sus límites metodológicos. Es un manuscrito candidato, aún no enviado ni revisado por pares, y no tiene DOI.

Este informe conecta investigación académica, herramientas abiertas, productos y experiencia operativa. Su alcance es la información pública verificada en el catálogo. Las conclusiones distinguen lo que sostienen los autores, lo que declaran los proveedores y lo que observaron terceros. Las fichas basadas solo en metadatos no se usan para inferir resultados científicos.

## Definición y límites del campo

Cyberdeception introduce señales o recursos diseñados deliberadamente para que un adversario los vea, los use o tome decisiones a partir de ellos. Un honeypot simula un sistema o servicio; un honeytoken es un dato señuelo cuya utilización produce una señal; otros activos pueden representar credenciales, archivos, aplicaciones o rutas de movimiento. El objetivo puede ser detectar, observar, desviar o imponer un costo a la actividad adversaria. [MITRE Engage](https://github.com/mitre/engage) ofrece un marco para planificar deception, denial y adversary engagement.

La terminología cambia según la disciplina. Una [revisión de cyberdeception de 2024](https://arxiv.org/abs/2409.07194) propone una taxonomía transversal y analiza líneas con y sin IA. Una [revisión basada en teoría de juegos](https://arxiv.org/abs/1712.05441) distingue perturbación, moving target defense, obfuscation, mixing, honey-x y attacker engagement. Por eso este Atlas registra técnica, entorno y objetivo como dimensiones separadas. Moving target defense puede formar parte de una estrategia de engaño, pero no toda implementación debe aparecer automáticamente como cyberdeception.

## Qué existe hoy

El software abierto cubre varios niveles de interacción. [OpenCanary](https://github.com/thinkst/opencanary) implementa un honeypot de red multiprotocolo orientado a detectar actividad en redes internas. [Cowrie](https://github.com/cowrie/cowrie) se centra en SSH y Telnet. [T-Pot](https://github.com/telekom-security/tpotce) reúne varios honeypots y herramientas de análisis. Proyectos como [Galah](https://github.com/0x4D31/galah) exploran interacciones web basadas en modelos de lenguaje. Sus fichas registran documentación y mantenimiento; figurar aquí no implica una evaluación comparativa de rendimiento.

El mercado comercial combina señuelos, datos trampa e integración con operaciones de seguridad. Ejemplos documentados son [Thinkst Canary](https://canary.tools/), [FortiDeceptor](https://www.fortinet.com/products/fortideceptor), [Acalvio ShadowPlex](https://www.acalvio.com/products/), [CounterCraft The Platform](https://www.countercraftsec.com/products/), [Zscaler Deception](https://www.zscaler.com/products-and-solutions/deception-technology) y [Tracebit](https://tracebit.com/). Las capacidades de esas fichas proceden, por ahora, de los proveedores. Precio, facilidad de despliegue y resultados necesitan documentación pública o pruebas independientes para poder compararse.

Los servicios incluyen diseño de estrategia, instalación, operación gestionada, pruebas y capacitación. Su clasificación merece cuidado: un fabricante que ofrece soporte no equivale necesariamente a un proveedor de operación gestionada. El catálogo registra cada servicio solo cuando encuentra una oferta verificable.

## Evidencia de uso y resultados

El [NCSC británico informó en diciembre de 2025](https://www.ncsc.gov.uk/blog-post/cyber-deception-trials-what-weve-learned-so-far) que su programa incluyó 121 organizaciones, 14 proveedores comerciales y 10 pruebas de productos en entornos diversos. Sus hallazgos señalan potencial para detección e inteligencia, pero también dificultades de terminología, falta de métricas basadas en resultados, necesidad de orientación imparcial y riesgos de configuración. El NCSC subraya que los señuelos requieren estrategia y contexto operativo.

Los relatos de clientes ayudan a identificar problemas de adopción, aunque su procedencia cambia el peso de la evidencia. La [experiencia de Riot Games publicada por Tracebit](https://tracebit.com/customer/riot-games) describe el interés en trasladar enfoques de deception a cloud; el Atlas la muestra como caso publicado por el proveedor. Una evaluación independiente, si existe, deberá aparecer como fuente adicional.

## Investigación y tendencias

La literatura explora mecanismos de red y host, modelos de decisión, selección de señuelos y medición. La [revisión de Lu y colaboradores](https://arxiv.org/abs/2007.14497) organiza esquemas estratégicos, de red, de host y criptográficos. Un [trabajo sobre simulación de ataques](https://arxiv.org/abs/2301.10629) propone evaluar honeypots y moving target defense con un modelo de red. Otro [survey](https://arxiv.org/abs/2309.00184) estudia requisitos de red para implementar cyberdeception eficaz.

Los honeypots basados en modelos de lenguaje son una línea visible, aún heterogénea. [LLM Honeypot](https://arxiv.org/abs/2409.08234) describe ajuste de un modelo con comandos de atacantes y una evaluación de respuestas. [HoneyGPT](https://arxiv.org/abs/2406.01882) presenta un honeypot de terminal y una evaluación en campo. Estos resultados pertenecen a los trabajos citados; no prueban que todos los modelos de lenguaje sean seguros, económicos o más eficaces que señuelos tradicionales.

## Qué falta medir

Una evaluación útil debe describir ubicación de señuelos, tráfico legítimo, ataques observables, calidad de las alertas, trabajo de mantenimiento y consecuencias de una interacción. Las métricas pueden incluir tiempo hasta detección, eventos útiles por señuelo, tasa de alertas que requieren investigación, profundidad de interacción y costo operativo. El [NCSC](https://www.ncsc.gov.uk/blog-post/cyber-deception-trials-what-weve-learned-so-far) identificó la ausencia de métricas de resultado como una brecha. Contar alertas sin contexto no permite concluir que una implementación haya reducido riesgo.

El catálogo también debe registrar resultados negativos, ataques que identifican señuelos, proyectos discontinuados, cambios de nombre y datos no publicados. Esa información es necesaria para investigadores que buscan reproducibilidad y para equipos que comparan inversiones.

## Cobertura actual y límite de la evidencia

La versión correctiva contiene 187 registros públicos vinculados a sus fuentes. Veinte registros contienen una síntesis del texto completo y 50 una nota de lectura crítica limitada por su fuente. Estas etiquetas describen trabajo editorial; no representan calidad del estudio ni efectividad defensiva. Las síntesis de texto completo fueron realizadas por un solo revisor y esta versión no conserva anclajes de página ni adjudicación independiente. El corpus sigue siendo un mapa de evidencia curado, no una revisión sistemática o de alcance completa.

El análisis de sensibilidad reproducible muestra la dependencia respecto de fuentes superficiales: al excluir registros basados en metadatos de repositorios, la vista analítica pasa de 187 a 88. Esto describe la curación y disponibilidad de fuentes públicas, no adopción ni prevalencia del campo.

El piloto de loopback registra 80 solicitudes de baseline y 80 de intervención. Las rutas instrumentadas exactas produjeron los 40 eventos esperados y 40 controles benignos o casi coincidentes no produjeron eventos. Como la lógica es determinista y el baseline carece de instrumentación de eventos, se trata de una prueba de conformidad del pipeline de reporte, no de evidencia sobre atacantes, detección en producción, utilidad para analistas o reducción de riesgo.

Dos pilotos auxiliares de extracción usaron OpenAI, Claude, Gemini y DeepSeek en dos artículos seleccionados. Documentan desacuerdos entre modelos y un flujo de adjudicación humana, pero no establecen exactitud de extracción, ahorro de tiempo ni validación independiente del catálogo. Las salidas de los proveedores y las adjudicaciones canónicas permanecen privadas y no forman parte de la versión correctiva pública.

Las actualizaciones prospectivas conservarán el historial completo de búsqueda y selección, anclajes de extracción, decisiones de un segundo revisor y variables de resultado. Hasta contar con esos datos, el Atlas no afirma cobertura exhaustiva ni efectividad comparable entre productos o estudios.
