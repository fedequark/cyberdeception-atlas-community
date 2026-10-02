# Medición de resultados

**Guía · 15 de septiembre de 2026**

## Definir qué sería éxito

Antes del despliegue, elegí un objetivo observable. “Detectar uso indebido de credenciales señuelo” es más medible que “mejorar seguridad”. Acordá quién calificará una alerta como útil y qué datos necesita para hacerlo.

## Métricas de detección

- **Tiempo hasta alerta:** diferencia entre la acción de prueba y el primer evento recibido por el equipo.
- **Interacciones útiles:** eventos que permiten abrir una investigación concreta, separados de escaneos masivos.
- **Cobertura:** proporción de escenarios autorizados que generaron la señal prevista.
- **Calidad de alerta:** campos disponibles, atribución, contexto y pasos de respuesta.

## Métricas de operación

- Tiempo de instalación, afinación y mantenimiento.
- Incidentes causados por configuración o interacción no prevista.
- Señuelos que dejaron de ser creíbles tras cambios de infraestructura.
- Costo total de operación, incluida investigación de eventos.

## Comparación

Registrá un período o entorno de referencia. Documentá cambios simultáneos en usuarios, activos, controles y adversarios simulados. Informá número de observaciones y casos sin alerta. Para estudios académicos, conservá parámetros y datos que permitan repetir la medición.

## Interpretación

Una tasa alta de interacción puede significar buen posicionamiento, exposición a escáneres o demasiado ruido. Una tasa baja puede significar falta de atacantes observables o señuelos mal ubicados. La conclusión debe relacionar resultado, amenaza y contexto; contar alertas por sí solo no demuestra reducción de riesgo. El [NCSC británico](https://www.ncsc.gov.uk/blog-post/cyber-deception-trials-what-weve-learned-so-far) identificó las métricas de resultado como una brecha del campo.
