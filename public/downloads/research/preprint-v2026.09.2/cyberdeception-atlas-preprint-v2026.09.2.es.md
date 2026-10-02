# Cyberdeception Atlas: mapa de evidencia y marco de reporte basados en fuentes

**Federico Pacheco y Diego Staino**
**Estado del manuscrito:** candidato a preprint; no revisado por pares ni enviado  
**Versión del artefacto:** v2026.09.2  
**Fecha de registro de la investigación:** 23 de septiembre de 2026

## Resumen

La investigación y la práctica del engaño cibernético reúnen fuentes heterogéneas: páginas de productos, repositorios de software, metadatos bibliográficos, publicaciones completas, relatos de clientes y experimentos controlados. Tratarlas como equivalentes puede convertir la prueba de existencia de un recurso en una afirmación injustificada sobre su eficacia defensiva. Este artículo presenta Cyberdeception Atlas, un mapa bilingüe de evidencia vinculada a sus fuentes y una arquitectura para informar evaluaciones. La versión correctiva del artefacto contiene 187 registros públicos clasificados por fuente y profundidad de revisión, 50 notas de lectura crítica limitadas a sus fuentes y 20 síntesis de texto completo realizadas por un único revisor. Un análisis de sensibilidad reproducible reduce la vista del corpus de 187 a 88 registros al excluir los basados en metadatos de repositorios. Esto muestra que el volumen del corpus y la profundidad de la evidencia responden preguntas distintas. Una prueba determinista de conformidad en un entorno local registra 160 solicitudes y muestra que el esquema de reporte puede representar condiciones de referencia, denominadores, controles negativos, latencia, medidas ausentes y observaciones de seguridad. No evalúa adversarios ni eficacia en producción. Dos pilotos de extracción con cuatro modelos documentan el flujo de revisión y su carga de adjudicación humana, pero no permiten estimar exactitud ni ahorro de tiempo. La contribución es metodológica y de infraestructura: separar explícitamente afirmaciones, fuentes, profundidad de revisión y evidencia de resultados, junto con una versión correctiva y un protocolo prospectivo para evaluar el esquema de forma independiente. El corpus histórico carece de un registro completo de selección, doble revisión, referencias a páginas para cada extracción y codificación comparable de resultados; debe interpretarse como un mapa curado de evidencia, no como una revisión sistemática exhaustiva.

**Términos clave:** engaño cibernético, honeypots, honeytokens, mapeo de evidencia, medición de seguridad, reproducibilidad, esquema de reporte.

## I. Introducción

El engaño cibernético comprende honeypots, honeytokens, activos señuelo, mecanismos de defensa de objetivo móvil y técnicas de interacción con adversarios. El campo incluye modelos formales, prototipos de laboratorio, software de código abierto, sistemas comerciales y programas operativos. Esta amplitud plantea un problema de medición: un repositorio demuestra que existe software; una página comercial documenta una capacidad declarada; un artículo puede informar un estudio bajo condiciones delimitadas; y una evaluación de campo puede revelar efectos operativos. Ninguna de estas fuentes sustituye a las demás.

Cyberdeception Atlas aborda el problema registrando qué fuente se examinó y qué puede sustentar esa fuente. No clasifica productos a partir de mensajes comerciales ni infiere eficacia de la actividad de un proyecto. En cambio, trata la procedencia, la profundidad de revisión, los datos ausentes y los denominadores como datos de primera clase. El artefacto busca ayudar a investigadores y equipos de seguridad a formular una pregunta más acotada antes de comparar resultados: ¿qué tipo de evidencia respalda cada afirmación?

Este artículo presenta cuatro contribuciones delimitadas:

1. un modelo de datos vinculado a las fuentes que separa tipo de recurso, etiqueta de evidencia, base de revisión y evidencia de resultados;
2. una versión inmutable de un mapa de evidencia con 187 registros y análisis descriptivos y de sensibilidad ejecutables;
3. un esquema mínimo de reporte para evaluaciones de engaño cibernético, incluidos resultados negativos y no medidos; y
4. una prueba de conformidad reproducible y un protocolo prospectivo de evaluación independiente.

El artículo no afirma que el corpus cubra exhaustivamente el campo, que algún producto sea superior ni que reduzca el riesgo.

## II. Antecedentes y trabajos relacionados

Las revisiones previas organizan el engaño cibernético por mecanismo, capa del sistema, estructura de juego o tendencia de investigación. Lu y colaboradores sintetizan enfoques estratégicos y técnicos para redes y sistemas informáticos [1]. Pawlick y colaboradores proponen una taxonomía basada en teoría de juegos que abarca varias clases de engaño [2]. Beltrán López y colaboradores revisan técnicas recientes, marcos, enfoques de inteligencia artificial, madurez tecnológica y desafíos abiertos [3]. Estos trabajos muestran la heterogeneidad del campo, pero no ofrecen un mapa de evidencia de fuentes mixtas, versionado de forma continua, que exponga la profundidad de la fuente en cada registro público.

Las guías operativas introducen otra clase de evidencia. El National Cyber Security Centre del Reino Unido informó aprendizajes de un programa con varias organizaciones, proveedores y pruebas de productos, y destacó la terminología, la medición de resultados, la orientación imparcial y los riesgos de configuración [4]. Los casos publicados por proveedores pueden aportar información sobre el despliegue, pero su procedencia y sus conflictos de interés deben permanecer visibles.

Por ello, la calidad del reporte forma parte del problema de investigación. Los conteos de alertas sin denominadores de escenarios intentados, controles benignos, condiciones de referencia, esfuerzo de analistas o resultados negativos no permiten establecer una mejora. La arquitectura de Atlas preserva estos límites en lugar de sintetizar resultados heterogéneos en una única puntuación de eficacia.

## III. Preguntas de investigación

El artefacto actual aborda las siguientes preguntas en distintos niveles de madurez:

- **RQ1:** ¿Qué tipos de evidencia y qué vacíos de reporte caracterizan al corpus curado de Atlas?
- **RQ2:** ¿Qué variables de resultado informa el subconjunto revisado a texto completo y hasta qué punto son comparables?
- **RQ3:** ¿Cuánto cambian las observaciones del corpus al excluir fuentes según su tipo y profundidad de revisión?
- **RQ4:** ¿Puede el esquema de reporte representar un experimento delimitado y mejorar la integridad de los reportes para revisores independientes?

La versión actual responde RQ1 de manera descriptiva y RQ3 mediante vistas de sensibilidad ejecutables. Solo responde la parte de representación de RQ4. RQ2 y la parte comparativa de RQ4 requieren datos prospectivos y no se presentan como resultados completados.

## IV. Corpus y arquitectura de evidencia

### A. Alcance del corpus

La base se reunió en varias etapas editoriales a partir de fuentes públicas. Como no se conservó un registro retrospectivo completo de candidatos y exclusiones, el artefacto es un mapa curado de evidencia, no una revisión sistemática o de alcance terminada. El protocolo prospectivo registra las consultas exactas de descubrimiento, la recuperación acotada en Crossref y OpenAlex, los criterios controlados de elegibilidad y exclusión, la deduplicación y un procedimiento futuro de segundo revisor.

### B. Representación de la evidencia

Cada registro separa el tipo de recurso de la base de revisión. Los tipos incluyen artículo, software, producto, servicio, estudio de caso, conjunto de datos, marco y recurso comunitario. La base de revisión indica el material efectivamente examinado: página pública de la fuente, metadatos o documentación del repositorio, metadatos editoriales, resumen o texto completo. La profundidad de revisión es descriptiva; no constituye una calificación de calidad ni una medida de eficacia.

Los registros revisados a texto completo contienen además campos de diseño, hallazgo, limitaciones, estado de extracción, estado de adjudicación y referencias a páginas. En las síntesis de septiembre de 2026, un solo revisor realizó el trabajo; no se conservaron referencias a páginas ni adjudicación independiente. La versión correctiva declara estas ausencias en lugar de reconstruirlas retrospectivamente.

### C. Versiones y correcciones

La versión v2026.09 se conserva como artefacto histórico. La versión correctiva v2026.09.2 concilia los resúmenes y las limitaciones activos de registros que pasaron a síntesis de texto completo, expone las limitaciones de procedencia de la extracción y contiene sumas de verificación regeneradas del piloto tras corregir la terminología. Los comandos de publicación exigen argumentos explícitos de versión y fecha y se detienen si el destino ya existe. El manifiesto registra el commit de origen, la versión del esquema, la versión anterior corregida, los tamaños de archivo y los hashes SHA-256.

## V. Análisis reproducible del corpus

El catálogo canónico contiene 187 registros. La distribución por base de revisión es: 99 registros basados en metadatos de repositorios, 45 en páginas de las fuentes, 22 en metadatos editoriales, 20 síntesis de texto completo y un registro basado en un resumen. Cincuenta registros incluyen una nota de lectura crítica limitada a su fuente.

El resultado principal del análisis de sensibilidad es descriptivo: al excluir los registros basados en metadatos de repositorios, la vista analítica pasa de 187 a 88. Si se restringe el corpus a las síntesis de texto completo, quedan 20 registros. Estos cambios no constituyen una escala de calidad de la evidencia; muestran que el tamaño y la composición aparentes de la colección dependen del material examinado.

Los datos ausentes también importan. La base contiene 43 registros sin año de publicación, 124 sin idioma de la fuente registrado y metadatos bibliográficos y de organizaciones incompletos. Los valores desconocidos permanecen como tales; no se convierten en observaciones negativas. Las etiquetas de técnica y entorno admiten múltiples valores y, por tanto, no suman el total del corpus.

El análisis no estima la prevalencia de técnicas o recursos en el campo mundial. Los límites de descubrimiento, la disponibilidad de fuentes públicas, la selección histórica, las restricciones de idioma y el gran componente de software invalidan esa inferencia.

## VI. Esquema mínimo de evaluación

El esquema de reporte registra objetivo, entorno, técnica, versión del sistema o señuelo, condición de referencia, condición experimental, escenario autorizado, señal esperada, denominador de escenarios intentados, señales omitidas, activaciones no deseadas, tiempo hasta la alerta, criterios de investigabilidad, esfuerzo operativo humano, reconocimiento del señuelo, incidentes de seguridad, resultados negativos, observador y procedencia.

Tres reglas limitan la interpretación. Primero, toda proporción conserva numerador y denominador. Segundo, los valores desconocidos o no medidos permanecen nulos y nunca se transforman en cero. Tercero, una capacidad declarada por un proveedor, una observación de demostración, un resultado de prueba propia y un resultado publicado de forma independiente permanecen diferenciados.

## VII. Prueba de conformidad

El artefacto `http-decoy-pilot-v1` compara una aplicación HTTP local sin instrumentación con la misma aplicación más cuatro rutas exactas instrumentadas. Cuatro rutas benignas o de coincidencia cercana actúan como controles negativos. Cada ruta recibe diez solicitudes por condición, lo que produce 80 observaciones de referencia y 80 de intervención.

La intervención emite 40 de los 40 eventos esperados, completos según el esquema, y ningún evento para 40 controles benignos. La condición de referencia no emite eventos, incluidos los correspondientes a 40 solicitudes dirigidas a nombres usados como rutas señuelo en la intervención. Se conservan todas las observaciones sin procesar, los registros de eventos, los resúmenes generados y las sumas de verificación.

Estos resultados están determinados estructuralmente por la coincidencia exacta de la ruta y por la instrumentación propia de cada condición. Las repeticiones comprueban una ejecución estable, pero no son muestras independientes de ataques. La condición de referencia no puede emitir el evento de intervención por diseño. Por tanto, el resultado solo establece que la implementación serializa los campos definidos en el protocolo y los controles negativos bajo condiciones aisladas de bucle local. No demuestra realismo, utilidad para analistas, latencia en producción, comportamiento de atacantes ni reducción del riesgo.

## VIII. Evaluación independiente prospectiva

El estudio planificado `reporting-schema-study-v1` utiliza un diseño cruzado, aleatorizado y contrabalanceado. Entre seis y doce profesionales o investigadores reportarán escenarios sintéticos emparejados usando tanto formatos libres como plantillas de Atlas. Evaluadores que desconocerán la condición puntuarán la recuperación de 12 elementos de evidencia requeridos, las inferencias sin sustento, las contradicciones, el tiempo de finalización, la confianza y la usabilidad. La unidad experimental es cada participante, no cada campo de la rúbrica. Un segundo evaluador puntuará de forma independiente al menos el 20 % de los reportes.

No se han incorporado participantes y no se afirman resultados comparativos. Antes del reclutamiento deben resolverse los requisitos éticos o de revisión institucional. El protocolo prospectivo, la rúbrica, la plantilla de datos vacía y el script de análisis están preparados en el espacio de trabajo del proyecto; no forman parte del archivo público v2026.09.2.

## IX. Pilotos de viabilidad de extracción con cuatro modelos

Un flujo auxiliar que comienza por la fuente utilizó OpenAI, Claude, Gemini y DeepSeek para extraer 18 campos tipados y 13 narrativos de cada uno de dos artículos seleccionados. Las instrucciones y reglas de comparación se congelaron antes de las llamadas. En el primer artículo, los cuatro modelos produjeron salidas estructuralmente válidas en el primer intento y se generó una cola de revisión humana de 16 de los 18 campos tipados. En el segundo se conservó un primer intento de DeepSeek con JSON inválido, se realizó un reintento y quedaron 10 de los 18 campos tipados para revisión humana. Las colas incluyeron desacuerdos entre modelos, problemas de evidencia y controles muestreados de campos en los que los modelos coincidían. Todos los elementos en cola recibieron una decisión humana, pero la mayoría de las decisiones se tomó con guía del asistente después de las comprobaciones muestreadas que partieron de la fuente. Los 13 campos narrativos de cada artículo recibieron una revisión separada de sus fuentes por parte del asistente. El revisor declaró cinco minutos de actividad para cada revisión inicial, sin contar esperas ni trabajo posterior. No existe un comparador de codificación manual, una muestra representativa de artículos, un patrón de referencia independiente ni una estimación de concordancia entre dos revisores humanos. Estos pilotos documentan el comportamiento y las fallas del flujo, pero no permiten estimar exactitud de extracción, reducción del tiempo de revisión ni validación del corpus histórico de 187 registros. Sus adjudicaciones canónicas y las salidas de los proveedores permanecen privadas y no forman parte de la versión correctiva pública.

## X. Amenazas a la validez

**Validez de constructo:** La base de revisión mide el material examinado, no la calidad del estudio. «Investigable» es el nombre heredado de un campo del piloto referido a la integridad del esquema y no representa el juicio de un analista.

**Validez interna:** El corpus inicial se curó antes de establecer el protocolo prospectivo. Las síntesis de texto completo carecen de referencias a páginas conservadas y adjudicación independiente. La prueba de conformidad se construyó para sus propias rutas exactas y puede superarse sin demostrar beneficio de seguridad.

**Validez externa:** Las fuentes públicas omiten datos confidenciales de adquisición, resultados operativos negativos y telemetría interna. La concentración de repositorios de software refleja la curaduría y la disponibilidad de fuentes. Los resultados no pueden generalizarse al mercado mundial ni a entornos de producción.

**Validez de la conclusión estadística:** Los conteos del corpus son descriptivos. Las repeticiones del piloto no son unidades independientes y no corresponde una prueba de significación. El estudio humano planificado es pequeño y necesitará resultados emparejados por participante con incertidumbre explícita.

**Validez de la extracción con IA:** Los dos artículos seleccionados, la adjudicación guiada por el asistente, las comprobaciones muestreadas que partieron de la fuente y los tiempos activos autodeclarados no sustentan clasificaciones de modelos, tasas de error de extracción ni afirmaciones de ahorro de tiempo. Los registros privados no deben confundirse con un corpus público validado independientemente.

**Posición de los investigadores:** Ambos autores son coautores de BUDA, DOLOS-T y Cyber Deception Playground. Estas relaciones se declaran; esos proyectos y el propio piloto de Atlas no se tratan como evidencia independiente de eficacia defensiva.

## XI. Discusión

El artefacto muestra una diferencia práctica entre volumen de evidencia y profundidad probatoria. Su contribución actual más sólida no es una nueva estimación de eficacia, sino un límite inspeccionable sobre lo que puede sustentar una colección heterogénea de fuentes. El proceso de corrección ilustra por qué ese límite debe aplicarse técnicamente: cambiar una etiqueta de revisión sin reemplazar el texto heredado de un resumen produjo información pública contradictoria sobre la procedencia. Las versiones inmutables, la precedencia de los resúmenes activos y el estado explícito de extracción reducen ese riesgo.

Para los profesionales, el esquema ofrece una lista de comprobación para diseñar y reportar un piloto antes de convertir conteos de alertas en conclusiones. Para los investigadores, el corpus brinda un punto de partida versionado y un registro de los datos ausentes. Su utilidad futura depende de la selección prospectiva, la extracción estructurada de resultados, la revisión independiente y evaluaciones que incluyan fallas y casos negativos.

## XII. Conclusión

Cyberdeception Atlas proporciona una arquitectura de evidencia vinculada a las fuentes, un corpus correctivo versionado, un esquema de reporte y un artefacto de conformidad reproducible. La evidencia actual respalda afirmaciones descriptivas sobre el corpus y sobre el funcionamiento del reporte a nivel de implementación. No respalda afirmaciones de cobertura exhaustiva del campo, eficacia comparativa ni reducción del riesgo. El siguiente hito científico es evaluar de forma independiente la integridad de los reportes y extraer, al nivel de cada afirmación, resultados comparables.

## Disponibilidad de datos y artefactos

La versión v2026.09.2 incluye el catálogo, las relaciones, el protocolo, el codebook, las tablas y figuras de análisis, las observaciones de la prueba de conformidad, los manifiestos, las licencias y las sumas de verificación en https://cyberdeceptionatlas.org/es/downloads/. El 23 de septiembre de 2026 se compararon los hashes SHA-256 del manifiesto, el codebook, el informe de análisis, las observaciones del piloto y el archivo público con los archivos locales. Los registros de extracción con cuatro modelos son artefactos piloto privados, separados de esa versión pública. Aún no se ha asignado un DOI.

## Conflictos de interés

Federico Pacheco es Cybersecurity Services Director en BASE4 Security. Tanto Federico Pacheco como Diego Staino son coautores de BUDA, DOLOS-T y Cyber Deception Playground. Estas relaciones se declaran y los proyectos no se tratan como evidencia independiente de eficacia defensiva.

## Referencias

[1] Z. Lu, C. Wang y S. Zhao, «Cyber Deception for Computer and Network Security: Survey and Challenges», 2020. [En línea]. Disponible en: https://arxiv.org/abs/2007.14497

[2] J. Pawlick, E. Colbert y Q. Zhu, «A Game-Theoretic Taxonomy and Survey of Defensive Deception for Cybersecurity and Privacy», 2017. [En línea]. Disponible en: https://arxiv.org/abs/1712.05441

[3] P. Beltrán López, M. Gil Pérez y P. Nespoli, «Cyber Deception: State of the Art, Trends and Open Challenges», 2024. [En línea]. Disponible en: https://arxiv.org/abs/2409.07194

[4] UK National Cyber Security Centre, «Cyber deception trials: what we’ve learned so far», 2025. [En línea]. Disponible en: https://www.ncsc.gov.uk/blog-post/cyber-deception-trials-what-weve-learned-so-far

[5] MITRE, «MITRE Engage». [En línea]. Disponible en: https://github.com/mitre/engage

[6] Cyberdeception Atlas, «Corpus protocol, codebook, and corrective release v2026.09.2», 2026.
