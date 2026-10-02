# Primera implementación de cyberdeception

**Guía · 15 de septiembre de 2026**

## Elegir una pregunta de detección

Comenzá por una acción que no debería ocurrir: un usuario que abre un archivo señuelo, una cuenta que utiliza una credencial ficticia o un proceso que intenta conectarse a un servicio interno simulado. La pregunta debe permitir explicar por qué esa interacción merece investigación.

## Elegir el recurso

Un honeytoken funciona cuando el dato puede colocarse en un sitio creíble y el mecanismo de alerta está verificado. Un honeypot resulta útil cuando se necesita observar interacciones de red o protocolos. [OpenCanary](https://github.com/thinkst/opencanary) documenta un enfoque multiprotocolo para redes internas; [Cowrie](https://github.com/cowrie/cowrie) documenta SSH y Telnet. La elección depende del comportamiento buscado, no del número de funciones de la herramienta.

## Preparar el entorno

Identificá dónde verá el señuelo el adversario, cómo recibirá la alerta el equipo y qué ocurrirá si alguien intenta interactuar más de lo esperado. Separá el señuelo de activos productivos y registrá los cambios de configuración. Si se usa una plataforma de laboratorio como [T-Pot](https://github.com/telekom-security/tpotce), estudiá sus requisitos y límites antes de exponerla a una red pública.

## Definir respuesta y observación

Una alerta necesita responsable, prioridad y pasos de comprobación. Probá con una interacción autorizada, registrando cuánto tarda en llegar la alerta y qué información contiene. Después observá durante un período definido: cantidad de interacciones, utilidad de las señales y trabajo de revisión.

## Decidir si ampliar

Ampliá si el señuelo produce información accionable y se mantiene creíble. Ajustá posición o diseño si solo capta escaneos masivos sin aportar la señal buscada. Documentá también los intentos sin alerta y los falsos positivos: son parte del resultado.

El [NCSC británico](https://www.ncsc.gov.uk/blog-post/cyber-deception-trials-what-weve-learned-so-far) observó que cyberdeception puede funcionar, pero requiere estrategia, contexto y métricas útiles.
