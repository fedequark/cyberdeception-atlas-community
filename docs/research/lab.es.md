# Laboratorio de investigación reproducible

**Guía · 15 de septiembre de 2026**

## Formular la hipótesis

Una hipótesis debe describir qué cambia al introducir deception. Ejemplo: “un honeypot SSH situado en una red de prueba detecta intentos de movimiento lateral antes que la instrumentación de referencia”. Definí qué se observará y qué comparación permitirá refutar la hipótesis.

## Registrar condiciones

Conservá versiones de software, configuración, topología, servicios simulados, duración, horario y carga de tráfico. [Cowrie](https://github.com/cowrie/cowrie) permite estudiar SSH/Telnet; [T-Pot](https://github.com/telekom-security/tpotce) reúne sensores y análisis. Elegí una sola variable principal para cada experimento. Señalá qué partes se probaron en un entorno aislado y cuáles representan operación real.

## Definir adversario y referencia

Usá pruebas autorizadas que describan acciones observables: reconocimiento, intento de acceso o uso de un dato señuelo. Medí una configuración de referencia sin deception. Si cambia simultáneamente la red, las reglas de detección y el señuelo, no se puede atribuir el resultado a una causa única.

## Guardar evidencia

Publicá scripts y configuración cuando sea posible, con datos sintéticos o desidentificados. Definí campos de eventos, criterios de exclusión, relojes y errores de captura. Un [trabajo sobre simulación de ataques de red](https://arxiv.org/abs/2301.10629) ilustra un enfoque para comparar honeypots y moving target defense.

## Analizar resultados y límites

Informá resultados positivos y negativos, variación entre ejecuciones y situaciones fuera del alcance. Separá interacciones automatizadas de comportamientos más complejos cuando la evidencia lo permita. Un resultado de laboratorio no predice por sí mismo los resultados de cualquier empresa.
