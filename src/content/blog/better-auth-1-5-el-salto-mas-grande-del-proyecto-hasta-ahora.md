---
title: 'Better Auth 1.5: el salto más grande del proyecto hasta ahora'
description: 'Better Auth 1.5 es la actualización más ambiciosa del proyecto: nuevas plataformas, CLI renovada, OAuth 2.1, SSO listo para producción y mucho más.'
date: 2026-03-03
image: /uploads/better-auth-1.5-corex4dev.png
published: true
featured: false
youtubeId: ''
reading_time: 8
categories:
  - Autenticación
  - General
keywords:
  - Better Auth 1.5
  - autenticación
  - SSO
  - OAuth 2.1
  - CLI
  - infraestructura auth
  - auth moderna
  - JavaScript auth
---

Better Auth se está haciendo un nombre entre las librerías de autenticación porque apuesta por simplicidad y flexibilidad: no te impone una UI, te deja escoger estrategias (JWT, sesiones, OAuth) y se integra bien con el stack moderno. Si alguna vez te frustró el exceso de “magia” o el vendor-lock de otras soluciones, Better Auth ofrece una experiencia más limpia y predecible.

Desde sus primeras versiones, su propuesta ha sido clara: _auth flexible, extensible y predecible_, con una DX cuidada.

La versión **1.5** marca un antes y un después en el proyecto. No es solo una mejora incremental: es, literalmente, **el mayor release hasta la fecha**.

Para ponerlo en perspectiva, Better Auth 1.5 llega con:

- Más de **600 commits**
- **70 nuevas features**
- Más de **200 bug fixes**
- **7 paquetes completamente nuevos**

Pero lo más interesante no son los números, sino el enfoque. Esta versión amplía el alcance de Better Auth a **nuevas plataformas, nuevos casos de uso y escenarios empresariales reales**, sin perder su esencia técnica.

### ¿Qué se siente diferente con la 1.5?

Antes, Better Auth era una opción atractiva para desarrolladores: ligera, flexible y “no intrusiva” (no te obliga a una interfaz prefabricada). Con la 1.5 la sensación sigue siendo la misma, pero más segura y con más opciones: menos cosas que te rompen en producción, herramientas que ayudan al equipo y la capacidad de usar la misma plataforma para casos más grandes (SSO para clientes empresariales, por ejemplo). Es como recibir una actualización de una app que ya te funciona: no te cambia la manera de usarla, pero te evita dolores de cabeza futuros.

### Lo que trae y por qué te puede interesar

En lugar de soltar un listado técnico, piensa en ejemplos concretos:

- Si trabajas en una **startup** y necesitas que varios productos o clientes se autentiquen con tu plataforma (APIs, agentes o apps de terceros), ahora Better Auth puede actuar como servidor de autorización completo (OAuth 2.1 / OIDC). Eso te permite otorgar tokens y controlar accesos con estándares modernos, sin montar todo desde cero.
- Si tu app tiene una **versión de escritorio** (Electron), ahora hay soporte oficial para manejar el ciclo de inicio de sesión de forma limpia: abrir el navegador del sistema, recibir el callback y guardar la sesión de manera segura. Nada de trucos caseros.
- Si tu producto vende a **empresas**, la novedad más práctica es la capa llamada **Infrastructure**: un dashboard y herramientas para que tus clientes empresariales configuren SSO, vean logs y gestionen entrada/salidas sin que tú tengas que intervenir en cada caso. En resumen: menos tickets de soporte y onboarding más rápido.
- Para el día a día del desarrollador, la experiencia también mejora: **un nuevo CLI** (`npx auth`) que permite iniciar proyectos, generar esquemas y ejecutar migraciones con comandos simples —ideal para estandarizar cómo se arranca un proyecto en tu equipo.

### Seguridad, estabilidad y operaciones (lo que no llama la atención, pero importa)

Una parte importante del release son muchas correcciones y mejoras “por debajo del capó”: rotación de claves sin cerrar sesiones, límites de peticiones más seguros, prevención de enumeración de usuarios, mejor manejo de errores y tolerancia al reloj (clock skew) para SAML/OIDC. Si nunca has sufrido problemas por esas cosas es porque tu stack no creció lo suficiente todavía —con 1.5 reduces la probabilidad de encontrarlas cuando escales.

También separaron y limpiaron piezas para que el proyecto sea más mantenible: adaptadores de bases de datos ahora son paquetes independientes (esto ayuda a reducir el tamaño del bundle y a actualizar adaptadores sin tocar el core).

### Un par de mejoras que resultan prácticas enseguida

- CLI rápido para empezar: `npx auth init` te deja un proyecto scaffold con configuración y adaptador listo.
- Integración nativa con más bases (por ejemplo, Cloudflare D1) y almacenamiento secundario (Redis) para casos en que necesitas velocidad o replicación.
- Un pequeño pero útil endpoint para actualizar campos de sesión desde el cliente sin tener que volver a autenticar al usuario.

### ¿Qué significa esto para equipos pequeños y para empresas?

- **Equipos pequeños / startups:** mejor DX al inicio, menos tiempo perdiendo en bugs de auth y más posibilidades (si algún día necesitas OAuth o desktop, ya tienes soporte).
- **Empresas / SaaS:** la Infrastructure y el SSO self-service son lo que cambia el juego: facilita que tus clientes empresariales se conecten por SAML sin crear tickets y te da herramientas de auditoría/gestión.

### Riesgos o cosas a tener en cuenta antes de actualizar

No es una actualización menor en todos los casos: hay cambios que rompen APIs antiguas y reorganizaciones (por ejemplo, plugins movidos a paquetes separados). Antes de actualizar:

1. Revisa el changelog y los breaking changes de tu stack específico.
2. Prueba la actualización en un entorno de staging real (logins, SSO, refresh tokens, integraciones de terceros).
3. Si usas plugins sensibles (api-keys, adaptadores o hooks personalizados), revisa cómo han cambiado los nombres y tipos.

### Pequeño ejemplo práctico (solo para que veas la idea)

Si quieres iniciar un proyecto nuevo con Better Auth ahora, con el CLI sería tan sencillo como:

```batch
# inicializa un proyecto Better Auth interactivo
npx auth init
```

Eso te guiará y dejará la configuración base para seguir.

### ¿En qué casos NO es necesariamente la solución perfecta?

Si buscas una solución que te brinde además un panel de usuarios listo para mercado y soporte gestionado sin tocar nada, Better Auth 1.5 da pasos hacia eso con Infrastructure, pero aún puede necesitar trabajo de integración según tu producto. Si prefieres una solución completamente SaaS que lo haga todo por ti sin instalar nada, valora si quieres ese control extra o no.

## Conclusión breve

Better Auth 1.5 es una versión que madura el proyecto: no solo corrige y pule, sino que amplía los escenarios donde puedes usarlo (desktop, OAuth server, SSO gestionado). Para desarrolladores significa menos fricción; para empresas, opciones reales de onboarding y gestión. Si tu producto empieza a crecer y estás pensando en autenticación que escale con tu negocio, vale la pena probar esta versión en staging y planear la migración con calma.
