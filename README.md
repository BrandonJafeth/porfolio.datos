# datos.brandoncarrillo.dev

Portafolio de análisis de datos de **Brandon Carrillo Álvarez** (Nicoya, Guanacaste, Costa Rica).
Cada caso responde una pregunta real con datos públicos de Costa Rica (BCCR, INEC, Poder Judicial, ICT…).
El diseño pone **la respuesta primero**: se entiende en 10 segundos, y la capa técnica está a un clic.

Los análisis viven en repos aparte (Python/SQL). Este sitio solo publica sus resultados (JSON).

## Stack

Astro 7 (salida estática) · Tailwind CSS 4 (`@tailwindcss/vite`) · MDX · Observable Plot → SVG en build ·
Preact (islas) · satori/resvg (imágenes OG) · Cloudflare Workers static assets.

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm install` | Instala dependencias (Node ≥ 22.12) |
| `pnpm dev` | Servidor local en `localhost:4321` (muestra borradores) |
| `pnpm build` | `astro check` + build de producción en `dist/` (sin borradores) |
| `MOSTRAR_BORRADORES=true pnpm build` | Build local incluyendo borradores |
| `pnpm preview` | Sirve `dist/` |
| `pnpm preview:cf` | Build + `wrangler dev` (runtime de Cloudflare) |

## Estructura

```
src/
  content.config.ts            colección "casos" (esquema Zod estricto)
  content/casos/<slug>/        index.mdx de cada caso
  data/casos/<slug>/*.json     datos de gráficos (los genera Python)
  data/indicadores/latest.json tablero semanal (fase futura)
  data/ruta.json               avance en la ruta de 26 semanas
  data/perfil.ts               datos personales, experiencia, educación
  data/glosario.ts             definiciones de términos técnicos
  lib/                         formato es-CR, gráficos, validación de datos, OG
  components/caso/             Termino, CifraClave, ToggleLectura, CapaTecnica, Confianza, TarjetaCaso
  components/graficos/         GraficoLinea, GraficoBarras, Anotacion, Fuente
  components/islas/            ConsultaSQL (DuckDB-WASM, se carga al hacer clic)
  pages/                       /, /casos, /casos/[slug], /indicadores, /ruta, rss.xml, robots.txt, og.png
docs/
  NUEVO-CASO.md                paso a paso + checklist de legibilidad
  DATOS-FORMATO.md             formato de los JSON
  DESPLIEGUE.md                Cloudflare, dominio y deploy hook
  TODOS.md                     datos personales pendientes
```

## Licencia y créditos

Diseño basado en [porfolio.dev](https://github.com/midudev/porfolio.dev) de midudev,
bajo licencia [CC BY-NC 4.0](./LICENSE.md). Uso personal, no comercial.
