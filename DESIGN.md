# DESIGN — "Boletín cívico"

Un periódico serio que te explica todo claro. Papel cálido, tinta oscura, un solo acento.

## Tokens (src/styles/global.css)

| Rol | Claro | Oscuro |
|---|---|---|
| `--paper` fondo | #f5f1e8 | #141618 |
| `--paper-2` superficie | #fbf9f4 | #1b1e21 |
| `--ink` texto | #1b1e22 | #ede8de |
| `--ink-2` secundario | #4b5057 | #b6b0a5 |
| `--rule` filetes | #d6cdbc | #33383d |
| `--accent` verde-azulado | #0d6a65 | #5fc7bb |
| `--accent-wash` resaltador | #c9e4de | teal 22 % |
| `--chart-muted` gris de gráficos | #a49d8e | #5d6267 |
| `--chart-alt` 2.º color (naranja, seguro para daltonismo) | #b0520b | #f0a35e |

Tema: `data-theme` en `<html>` (script en `<head>`); sin JS sigue `prefers-color-scheme`.

## Tipografía
- Títulos: **Newsreader Variable** (eje óptico), peso ~560, tracking −0.015 a −0.03em.
- Texto: **Atkinson Hyperlegible Next Variable**, 18 px (19 px ≥ 768 px), interlineado 1.65, medida ≤ 65ch.
- Números: `.num` → `tabular-nums`. Versalitas (`.versalitas`) para metadatos, nunca como "eyebrow" sobre títulos.

## Firma visual
- **Resaltador** (`.resaltado` + `.trazo`): la respuesta corta se "subraya" con marcador al cargar. Único momento animado.
- Filetes gruesos (`border-t-2 ink`) abren secciones, como un diario.
- La pregunta hace *morph* entre listado y caso (view transitions nativas, sin JS).

## Gráficos
Observable Plot → SVG en build. Un color destacado, resto gris, anotaciones directas, sin leyenda,
título = conclusión, resumen sr-only, tabla de datos plegable, fuente debajo. Versión ancha y angosta por container query.

## Movimiento
Ease-out exponencial (`--ease-salida`). Todo se apaga con `prefers-reduced-motion`.
