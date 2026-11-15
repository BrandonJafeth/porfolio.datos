/**
 * Imágenes Open Graph (1200×630) generadas en build con satori + resvg.
 * Muestran la pregunta y la respuesta corta: así se ven bien al compartir en LinkedIn.
 */
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import satori from "satori"
import { Resvg } from "@resvg/resvg-js"

type Nodo = { type: string; props: Record<string, unknown> & { children?: unknown } }
const h = (type: string, style: Record<string, unknown>, ...children: unknown[]): Nodo => ({
  type,
  props: { style, children: children.length <= 1 ? children[0] : children },
})

const fuente = (paquete: string, archivo: string) =>
  readFile(join(process.cwd(), "node_modules", "@fontsource", paquete, "files", archivo))

let fuentes: Awaited<ReturnType<typeof cargarFuentes>> | undefined
async function cargarFuentes() {
  const [s5, s5x, s6, s6x, a4, a4x, a7, a7x] = await Promise.all([
    fuente("newsreader", "newsreader-latin-500-normal.woff"),
    fuente("newsreader", "newsreader-latin-ext-500-normal.woff"),
    fuente("newsreader", "newsreader-latin-600-normal.woff"),
    fuente("newsreader", "newsreader-latin-ext-600-normal.woff"),
    fuente("atkinson-hyperlegible-next", "atkinson-hyperlegible-next-latin-400-normal.woff"),
    fuente("atkinson-hyperlegible-next", "atkinson-hyperlegible-next-latin-ext-400-normal.woff"),
    fuente("atkinson-hyperlegible-next", "atkinson-hyperlegible-next-latin-700-normal.woff"),
    fuente("atkinson-hyperlegible-next", "atkinson-hyperlegible-next-latin-ext-700-normal.woff"),
  ])
  const f = (name: string, data: Buffer, weight: 400 | 500 | 600 | 700) => ({ name, data, weight, style: "normal" as const })
  return [
    f("Newsreader", s5, 500),
    f("Newsreader", s5x, 500),
    f("Newsreader", s6, 600),
    f("Newsreader", s6x, 600),
    f("Atkinson", a4, 400),
    f("Atkinson", a4x, 400),
    f("Atkinson", a7, 700),
    f("Atkinson", a7x, 700),
  ]
}

const COLOR = {
  papel: "#f5f1e8",
  tinta: "#1b1e22",
  tinta2: "#4b5057",
  acento: "#0d6a65",
  lavado: "#c9e4de",
  regla: "#d6cdbc",
}

export type DatosOG = {
  /** Texto grande (la pregunta). */
  titulo: string
  /** Texto resaltado (la respuesta corta). */
  bajada?: string
  /** Etiqueta pequeña arriba a la derecha (tema). */
  etiqueta?: string
}

export async function generarOG({ titulo, bajada, etiqueta }: DatosOG): Promise<Uint8Array> {
  fuentes ??= await cargarFuentes()
  const tamTitulo = titulo.length > 60 ? 62 : titulo.length > 40 ? 72 : 84

  const arbol = h(
    "div",
    {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: COLOR.papel,
      padding: "56px 72px",
      fontFamily: "Atkinson",
      color: COLOR.tinta,
    },
    h(
      "div",
      {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        borderBottom: `2px solid ${COLOR.tinta}`,
        paddingBottom: 16,
      },
      h(
        "div",
        { display: "flex", alignItems: "baseline", gap: 14 },
        h("span", { fontFamily: "Newsreader", fontWeight: 600, fontSize: 34 }, "Brandon Carrillo"),
        h("span", { fontSize: 24, fontWeight: 700, color: COLOR.acento, letterSpacing: 3 }, "DATOS"),
      ),
      h("span", { fontSize: 24, color: COLOR.tinta2, letterSpacing: 2 }, (etiqueta ?? "Costa Rica").toUpperCase()),
    ),
    h(
      "div",
      { display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center", gap: 30 },
      h(
        "div",
        {
          fontFamily: "Newsreader",
          fontWeight: 600,
          fontSize: tamTitulo,
          lineHeight: 1.04,
          letterSpacing: -1.5,
          maxWidth: 1000,
        },
        titulo,
      ),
      ...(bajada
        ? [
            h(
              "div",
              { display: "flex", maxWidth: 1000 },
              h(
                "span",
                {
                  fontSize: bajada.length > 110 ? 30 : 34,
                  lineHeight: 1.35,
                  backgroundColor: COLOR.lavado,
                  padding: "4px 10px",
                  color: COLOR.tinta,
                },
                bajada,
              ),
            ),
          ]
        : []),
    ),
    h(
      "div",
      { display: "flex", justifyContent: "space-between", fontSize: 24, color: COLOR.tinta2 },
      h("span", {}, "datos.brandoncarrillo.dev"),
      h("span", {}, "Nicoya, Guanacaste"),
    ),
  )

  const svg = await satori(arbol as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts: fuentes })
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng()
}
