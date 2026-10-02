# Protocolo de evaluación comparable

**Plantilla de investigación y adquisición · 15 de septiembre de 2026**

Una comparación solo es válida cuando las opciones afrontan el mismo objetivo, entorno, escenario y período. Este protocolo registra también los casos sin alerta y el trabajo requerido para operar los señuelos. No asigna puntuaciones a datos desconocidos.

## 1. Pregunta, alcance y referencia

Escribí una hipótesis observable: por ejemplo, «una credencial señuelo usada en el entorno de identidad produce una alerta investigable en menos de cinco minutos». Registrá entorno, técnica, ubicación del señuelo, integración de alertas, período y controles ya existentes. La referencia o *baseline* puede ser la misma prueba sin el señuelo, o el control de detección actual. Documentá cualquier cambio simultáneo.

## 2. Fuente de cada afirmación

Separá **capacidad declarada por el proveedor**, **observación en una demostración**, **resultado de una prueba propia** y **resultado publicado por terceros**. Para cada afirmación, guardá URL o DOI, fecha de acceso, versión o modalidad examinada y límite de la fuente. Un abstract o página comercial no sustituye una evaluación independiente.

## 3. Diseño de la prueba

Definí escenarios autorizados antes de ejecutarlos. Indicá cómo se genera cada acción, cuántas repeticiones habrá, cómo se sincronizan relojes y qué señal se espera. Probá también tráfico legítimo o de mantenimiento que pueda activar el señuelo. En OT/ICS, aislá la prueba de procesos productivos y documentá la revisión de seguridad de proceso.

## 4. Medidas con denominador

| Medida | Cálculo o registro | Interpretación |
| --- | --- | --- |
| Cobertura de escenario | Escenarios que produjeron la señal prevista / escenarios ejecutados | Informar también los escenarios sin alerta. |
| Tiempo hasta alerta | Primer evento recibido menos instante de la acción | Mostrar mediana, rango y tamaño de muestra. |
| Alertas investigables | Alertas con contexto suficiente / alertas totales | Definir de antemano quién califica utilidad. |
| Activaciones no deseadas | Activaciones por acciones legítimas / acciones legítimas probadas | Separar pruebas, indexadores y mantenimiento. |
| Carga operativa | Horas de instalación, afinación, mantenimiento e investigación | Reportar por período y por número de señuelos. |
| Realismo del señuelo | Observaciones de detección del señuelo / interacciones evaluadas | Documentar criterio y comportamiento del evaluador. |
| Incidentes de seguridad | Incidentes causados por el señuelo o su configuración | Registrar incluso si el resultado es cero. |

## 5. Análisis y decisión

Publicá el tamaño de muestra, las condiciones de la prueba, casos negativos, datos faltantes y cambios respecto del baseline. No extrapoles una prueba de laboratorio a producción sin explicar la diferencia. Para comparar productos o servicios, registrá modalidad de despliegue, integración, responsabilidad operativa, licencia y costo total **solo si hay respaldo verificable**. Una ausencia de precio público queda como «desconocido».

## 6. Reproducibilidad y revisión

Conservá configuración, versiones, secuencia de acciones, esquema de telemetría, criterios de calificación y una copia anonimizada de los resultados cuando sea posible. La [plantilla CSV](/downloads/evaluation-template.csv) permite registrar escenarios y observaciones. Revisá el protocolo cuando cambien el señuelo o el entorno.

El [NCSC británico](https://www.ncsc.gov.uk/blog-post/cyber-deception-trials-what-weve-learned-so-far) señaló la falta de métricas de resultados comparables en sus ensayos de cyberdeception. [MITRE Engage](https://engage.mitre.org/wp-content/uploads/2022/04/EngageHandbook-v1.0.pdf) ofrece un marco para preparar, operar y entender actividades de engagement; este protocolo concreta cómo registrar una comparación.
