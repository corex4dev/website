---
title: 'Sveltia CMS y Astro: cómo crear un blog moderno sin backend'
description: Aprende a crear un blog moderno usando Astro y Sveltia CMS. Un CMS git-based ligero, ideal para proyectos rápidos y sitios estáticos.
date: 2026-03-18
image: /uploads/sveltia-cms-astro-blog-tutorial.png
published: true
featured: false
youtubeId: ''
reading_time: 12
categories:
  - CMS
  - Frontend
keywords:
  - Sveltia CMS
  - Astro CMS
  - git based CMS
  - CMS for Astro
  - static site CMS
  - Astro content collections
  - Sveltia CMS tutorial
  - Sveltia CMS config
related:
  - estructura-proyecto-frontend-grande
  - arquitectura-moderna-de-contenido-cms-frontend-desacoplado
  - por-que-abandone-wordpress
---

Durante mucho tiempo, crear un sitio con gestión de contenido significaba montar un CMS completo con base de datos, backend y múltiples capas de infraestructura.

Hoy el panorama es bastante diferente.

Cada vez más proyectos utilizan arquitecturas **git-based**, donde el contenido vive directamente en el repositorio y el sitio se genera de forma estática durante el proceso de build.

En este contexto aparece **Sveltia CMS**, un CMS moderno extremadamente ligero que funciona directamente sobre repositorios Git. Cuando lo combinamos con **Astro**, obtenemos una arquitectura muy interesante para blogs, documentación y sitios de contenido.

En este tutorial vamos a construir un blog funcional utilizando **Astro + Sveltia CMS**, configurando el CMS completo y entendiendo cómo funciona su flujo de trabajo.

Si prefieres ver esta configuración en acción, también tienes el **video completo del tutorial en mi canal de YouTube**, donde muestro todo el proceso paso a paso dentro de un proyecto real.

📺 Ver el video aquí

[incluir iframe aqui]
https://youtube.com/tu-video

En el artículo profundizaremos en los detalles técnicos para que puedas replicar esta arquitectura en tus propios proyectos.

## Qué es Sveltia CMS

Sveltia CMS es un CMS moderno que se integra directamente con repositorios Git. Esto significa que el contenido del sitio vive dentro del propio proyecto, normalmente en archivos Markdown o JSON.

El panel de administración permite editar ese contenido desde una interfaz visual, pero internamente todo se guarda como archivos en el repositorio.

Este enfoque tiene varias ventajas importantes.

Primero, elimina la necesidad de una base de datos. Todo el contenido está versionado dentro de Git, lo que facilita el control de cambios y el despliegue.

Segundo, funciona muy bien con generadores de sitios estáticos como Astro, ya que estos sistemas suelen leer contenido directamente desde archivos.

Finalmente, mantiene la arquitectura del proyecto extremadamente simple.

## Entendiendo la arquitectura

Antes de empezar con la configuración es importante entender cómo encajan las piezas.

En esta arquitectura intervienen tres elementos principales.

Por un lado tenemos **Astro**, que será el generador del sitio. Astro leerá el contenido desde archivos Markdown y generará las páginas estáticas.

Por otro lado tenemos **Sveltia CMS**, que proporciona una interfaz visual para editar ese contenido.

Y finalmente tenemos **Git**, que actúa como almacenamiento del contenido.

El flujo completo suele verse así:

**Editor → Sveltia CMS → Git Repository → Astro → Static Site**

El CMS modifica los archivos dentro del repositorio y Astro se encarga de generar el sitio final durante el proceso de build.

![Imagen explicativa del flujo](/uploads/sveltia-cms-flow.png)

Este modelo es ideal para blogs, documentación, sitios de marketing o cualquier proyecto donde el contenido sea el elemento principal.

## Crear un proyecto Astro

El primer paso es crear un nuevo proyecto con Astro.

```bash
pnpm create astro@latest
```

Durante la instalación puedes elegir la configuración básica del proyecto.

Una vez creado, ejecuta el servidor de desarrollo:

```batch
pnpm run dev
```

Si todo está funcionando correctamente, ya tendrás un proyecto Astro corriendo localmente.

## Preparar el contenido del blog

Astro tiene un sistema muy potente para gestionar contenido utilizando colecciones.

Dentro del proyecto podemos crear una carpeta para nuestros artículos: `src/content/blog`

Cada artículo se escribirá como un archivo Markdown.

Un ejemplo sencillo podría verse así:

```markdown
---
title: Mi primer artículo
description: Probando Sveltia CMS con Astro
pubDate: "2026-03-20"
---

Este es el contenido del artículo.
```

Astro se encargará de convertir estos archivos en páginas del sitio para lo cual debemos configurar cómo los interpretará en el archivo `content.config.ts`.

```typescript
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  blog,
};
```

Esto permite que Astro valide el contenido y lo exponga a la aplicación.

## Integrar Sveltia CMS

Ahora viene la parte interesante.

Sveltia CMS se puede integrar añadiendo una pequeña aplicación dentro del proyecto. Normalmente se coloca dentro de una carpeta `public/admin`. Dentro de esta carpeta se define la configuración del CMS y las colecciones de contenido que el editor podrá modificar.

Un ejemplo básico de la configuración de Sveltia CMS sería algo así:

```json
{
  "backend": {
    "name": "github",
    "repo": "tu-usuario/tu-repo"
  },

  "media_folder": "public/uploads",
  "public_folder": "/uploads",

  "collections": [
    {
      "name": "blog",
      "label": "Blog",
      "folder": "src/content/blog",
      "create": true,
      "slug": "{{slug}}",
      "format": "frontmatter",
      "extension": "md",
      "fields": [
        {
          "label": "Title",
          "name": "title",
          "widget": "string"
        },
        {
          "label": "Description",
          "name": "description",
          "widget": "string"
        },
        {
          "label": "Publish Date",
          "name": "pubDate",
          "widget": "datetime"
        },
        {
          "label": "Hero image",
          "name": "heroImage",
          "widget": "image"
        },
        {
          "label": "Body",
          "name": "body",
          "widget": "markdown"
        }
      ]
    }
  ]
}
```

Esto permite que el panel de administración muestre un editor visual para los artículos del blog.

Luego, para mostrar el panel de administración existen dos formas principales, incorporando un archivo `index.html` ya sea en la propia carpeta `public/admin/` o en `src/pages/admin/`. La segunda opción suele ser más cómoda porque permite acceder directamente desde `/admin`.

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex" />
    <title>CoreX4Dev - Sveltia CMS</title>

    <link
      href="/admin/config.json"
      type="application/json"
      rel="cms-config-url"
    />
  </head>
  <body>
    <script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
  </body>
</html>
```

Este archivo simplemente carga la aplicación de Sveltia CMS y apunta al archivo de configuración.

## Autenticación del CMS

Una parte importante de cualquier CMS es el sistema de autenticación.

Sveltia CMS soporta diferentes estrategias, pero dos de las más comunes son:

### PKCE con GitHub

Este método utiliza OAuth con PKCE para permitir que el usuario se autentique directamente con GitHub.

El CMS obtiene permisos para hacer commits en el repositorio y guardar el contenido.

Este método es ideal cuando el proyecto ya vive en GitHub y el equipo de editores tiene acceso al repositorio.

### Sveltia CMS Authenticator

Otra alternativa interesante es usar [**Sveltia CMS Authenticator**](https://github.com/sveltia/sveltia-cms-auth), un pequeño servicio que puede desplegarse fácilmente en **Cloudflare Workers**.

El proyecto incluso ofrece una opción de **deploy en un clic**, lo que permite tener un endpoint de autenticación sin tener que construir tu propio backend.

Este enfoque es útil cuando necesitas controlar mejor el acceso o cuando los editores no deberían interactuar directamente con GitHub.

## Publicar nuevos artículos

Una vez configurado el CMS, el flujo de trabajo es muy simple.

Un editor abre el panel de administración, crea o modifica contenido y el CMS guarda esos cambios directamente en el repositorio. Cabe destacar que para ser editor y acceder al panel se debe contar con una clave de acceso al repositorio o ser contribuidor o dueño del mismo en caso de usar el autenticador de Sveltia. Con esto se garantizan los permisos a hacer commit en Git y por tanto a la manipulación del contenido.

Cuando el sitio se vuelve a desplegar, Astro genera las páginas actualizadas.

Esto elimina muchas de las capas tradicionales de un CMS y simplifica el mantenimiento del proyecto.

## Cuándo usar Sveltia CMS

Sveltia CMS funciona especialmente bien en proyectos donde el contenido es el elemento principal.

Blogs, documentación técnica o sitios de marketing suelen beneficiarse mucho de esta arquitectura porque permite gestionar contenido sin añadir infraestructura adicional.

Sin embargo, si el proyecto requiere funcionalidades complejas como usuarios, permisos avanzados o contenido altamente dinámico, puede ser más apropiado utilizar un CMS headless tradicional.

## Ver la implementación completa

Aunque este artículo cubre todos los archivos y configuraciones necesarias, en el **video del canal muestro la implementación completa dentro de un proyecto real**, incluyendo:

- creación del proyecto
- configuración del CMS
- autenticación
- publicación del primer artículo

📺 Puedes verlo aquí:

[iframe video otra vez]

Si quieres entender realmente cómo se siente trabajar con esta arquitectura, te recomiendo verlo porque allí se ve todo el flujo en acción.

## Conclusión

La combinación de Astro y Sveltia CMS muestra muy bien hacia dónde está evolucionando el desarrollo web moderno.

En lugar de depender de sistemas monolíticos complejos, cada vez más proyectos utilizan herramientas especializadas que hacen una sola cosa pero la hacen muy bien.

Para sitios enfocados en contenido, esta arquitectura ofrece una solución ligera, rápida y extremadamente flexible.

Y lo mejor de todo es que mantiene el control completo del contenido dentro de tu propio repositorio.
