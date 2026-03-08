---
title: 'Islands Architecture: la arquitectura frontend que está cambiando cómo construimos sitios web'
description: Qué es Islands Architecture, por qué mejora el rendimiento web y cómo frameworks como Astro o Fresh están popularizando este nuevo enfoque frontend.
date: 2026-03-07
image: /uploads/island-architecture.png
published: true
featured: false
youtubeId: ''
reading_time: 7
categories:
  - Frontend
keywords:
  - islands architecture
  - astro framework
  - frontend performance
  - partial hydration
  - arquitectura frontend moderna
---

Durante muchos años el desarrollo frontend estuvo dominado por un modelo muy claro: **las Single Page Applications (SPA)**.

Frameworks como React, Angular o Vue popularizaron una forma de construir aplicaciones donde prácticamente toda la lógica se ejecuta en el navegador. El servidor envía un HTML inicial bastante ligero, y luego el JavaScript del cliente se encarga de construir la interfaz completa, manejar el estado y actualizar la vista.

Este enfoque funcionó muy bien para aplicaciones complejas. Pero con el tiempo también aparecieron algunos problemas evidentes: bundles de JavaScript cada vez más grandes, tiempos de carga elevados y una experiencia inicial que muchas veces dependía demasiado de la ejecución del cliente.

A medida que la web evolucionó, comenzaron a aparecer nuevas formas de abordar el problema del rendimiento. Una de las más interesantes es **Islands Architecture**, un patrón que está ganando mucha popularidad en frameworks modernos.

## El problema de hidratar toda la página

En una SPA típica, el navegador descarga el bundle JavaScript principal y luego **hidrata toda la aplicación**. Esto significa que React o Vue vuelven a ejecutar la lógica necesaria para conectar la interfaz renderizada con los eventos interactivos.

En aplicaciones pequeñas esto no suele ser un problema, pero en sitios grandes puede significar que el navegador tenga que procesar grandes cantidades de JavaScript antes de que la página sea realmente interactiva.

Incluso cuando utilizamos SSR o SSG, muchas aplicaciones siguen hidratando todo el árbol de componentes.

En otras palabras: aunque gran parte del contenido sea estático, **terminamos enviando JavaScript para toda la página**.

Ahí es donde Islands Architecture introduce una idea bastante elegante.

## El concepto detrás de Islands Architecture

La idea principal es muy simple: en lugar de hidratar toda la página, **solo hidratamos las partes que realmente necesitan interactividad**.

La página se genera principalmente como HTML estático desde el servidor. Dentro de ese HTML aparecen pequeñas “islas” de interactividad que se activan cuando es necesario.

Estas islas pueden ser componentes interactivos como:

- un buscador
- un formulario
- un carrito de compra
- un widget dinámico

Todo lo demás permanece como HTML estático, lo que reduce drásticamente la cantidad de JavaScript que se envía al navegador.

Esto mejora dos métricas críticas del rendimiento web:

- **Time to Interactive**
- **JavaScript shipped to the client**

## Un ejemplo simple de cómo funciona

Imagina una página de blog que contiene:

- el contenido del artículo
- comentarios
- un buscador
- un botón de compartir

En un modelo SPA tradicional, todos estos componentes formarían parte de la aplicación completa y serían hidratados en el cliente.

Con Islands Architecture, el artículo completo puede renderizarse como HTML estático, mientras que solo los componentes interactivos se convierten en islas independientes.

Por ejemplo, en Astro podríamos tener algo así:

```jsx
---
import Search from "../components/Search.jsx"
import Comments from "../components/Comments.jsx"
---

<article>
  <h1>Título del artículo</h1>
  <p>Contenido renderizado como HTML estático...</p>
</article>

<Search client:idle />
<Comments client:visible />
```

Aquí Astro renderiza la página como HTML estático, pero **activa la interactividad solo cuando es necesario**.

El buscador se hidrata cuando el navegador está libre (`client:idle`), y los comentarios cuando el componente aparece en pantalla (`client:visible`).

## Frameworks que están adoptando este modelo

Islands Architecture fue popularizada originalmente por el trabajo de **Katie Sylor-Miller y Jason Miller**, y con el tiempo diferentes frameworks han adoptado esta idea con variaciones propias.

Uno de los ejemplos más conocidos es **Astro**, que utiliza este patrón como base de su arquitectura. Astro permite combinar múltiples frameworks de componentes —React, Vue, Svelte, Solid— y decidir exactamente cuándo cada componente debe hidratarse.

Otros frameworks también exploran conceptos similares.

**Fresh**, desarrollado por el equipo de Deno, utiliza un modelo basado en islas que prioriza el envío mínimo de JavaScript al cliente.

**Qwik**, por su parte, lleva el concepto aún más lejos con la idea de _resumability_, donde el estado de la aplicación puede retomarse sin necesidad de hidratar completamente la página.

Aunque las implementaciones varían, la filosofía es la misma: **menos JavaScript en el cliente y más HTML generado en el servidor**.

## Por qué este enfoque está ganando popularidad

La web actual está experimentando una especie de ajuste después de años de aplicaciones cada vez más pesadas.

Los navegadores son más potentes que nunca, pero también los usuarios esperan sitios rápidos, especialmente en dispositivos móviles.

Las Core Web Vitals de Google han reforzado esta tendencia, empujando a los desarrolladores a optimizar métricas como:

- **Largest Contentful Paint**
- **First Input Delay**
- **Interaction to Next Paint**

Reducir el JavaScript enviado al cliente se ha convertido en una de las formas más efectivas de mejorar estas métricas.

Islands Architecture ofrece una solución elegante: mantener la interactividad cuando es necesaria, pero **sin convertir toda la página en una aplicación JavaScript gigante**.

## Un cambio interesante en la mentalidad frontend

Durante mucho tiempo la industria frontend se movió hacia aplicaciones cada vez más complejas que se ejecutaban completamente en el cliente.

Hoy estamos viendo un pequeño cambio de dirección.

Frameworks como Next.js, Astro o SvelteKit están explorando modelos híbridos donde el servidor vuelve a tener un papel importante en el renderizado de la interfaz.

Islands Architecture encaja perfectamente en esta tendencia. No intenta reemplazar las aplicaciones interactivas, sino optimizar cómo se distribuye la lógica entre servidor y cliente.

El resultado es una web más rápida, más eficiente y, en muchos casos, más fácil de mantener.
