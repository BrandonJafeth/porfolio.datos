/**
 * Imágenes Open Graph (1200×630) generadas en build con satori + resvg.
 * Estilo Boleta: la pregunta como ítem del formulario y la respuesta escrita en azul pluma.
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
  const [a7, a7x, a8, a8x, p4, p4x, p6, p6x, colon] = await Promise.all([
    fuente("archivo", "archivo-latin-700-normal.woff"),
    fuente("archivo", "archivo-latin-ext-700-normal.woff"),
    fuente("archivo", "archivo-latin-800-normal.woff"),
    fuente("archivo", "archivo-latin-ext-800-normal.woff"),
    fuente("public-sans", "public-sans-latin-400-normal.woff"),
    fuente("public-sans", "public-sans-latin-ext-400-normal.woff"),
    fuente("public-sans", "public-sans-latin-600-normal.woff"),
    fuente("public-sans", "public-sans-latin-ext-600-normal.woff"),
    fuente("noto-sans", "noto-sans-latin-ext-700-normal.woff"),
  ])
  const f = (name: string, data: Buffer, weight: 400 | 600 | 700 | 800) => ({ name, data, weight, style: "normal" as const })
  return [
    f("Archivo", a7, 700),
    f("Archivo", a7x, 700),
    f("Archivo", a8, 800),
    f("Archivo", a8x, 800),
    f("Public Sans", p4, 400),
    f("Public Sans", p4x, 400),
    f("Public Sans", p6, 600),
    f("Public Sans", p6x, 600),
    f("Colon CR", colon, 700),
  ]
}

const C = {
  papel: "#fcfcfa",
  tinta: "#14161a",
  tinta2: "#464b53",
  forma: "#eba591",
  formaT: "#a3412a",
  formaF: "#fcece6",
  pluma: "#1c3fc4",
}

export type DatosOG = {
  /** Texto grande (la pregunta). */
  titulo: string
  /** Texto en azul pluma (la respuesta corta). */
  bajada?: string
  /** Campo superior derecho (tema). */
  etiqueta?: string
  /** Etiquetas de los campos. */
  etiquetaTitulo?: string
  etiquetaBajada?: string
}

/**
 * Archivo y Public Sans no traen el signo de colón (₡): lo dibujamos con Noto Sans.
 * Satori necesita palabras como hijos separados para poder partir líneas.
 */
const conColon = (texto: string) =>
  texto.split(/(\s+)/).map((pal) =>
    pal.includes("₡")
      ? h("span", { display: "flex" }, ...pal.split(/(₡)/).filter(Boolean).map((t) => (t === "₡" ? h("span", { fontFamily: "Colon CR" }, t) : t)))
      : pal.trim() === ""
        ? h("span", { width: 9 }, " ")
        : h("span", {}, pal),
  )

const etiqueta = (t: string) => h("span", { fontSize: 22, fontWeight: 600, color: C.formaT, fontFamily: "Public Sans" }, t)

export async function generarOG({
  titulo,
  bajada,
  etiqueta: tema,
  etiquetaTitulo = "Pregunta",
  etiquetaBajada = "Respuesta",
}: DatosOG): Promise<Uint8Array> {
  fuentes ??= await cargarFuentes()
  const tamTitulo = titulo.length > 70 ? 52 : titulo.length > 45 ? 60 : 72

  const arbol = h(
    "div",
    {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: C.papel,
      padding: 40,
      fontFamily: "Public Sans",
      color: C.tinta,
    },
    h(
      "div",
      { display: "flex", flexDirection: "column", width: 1120, height: 500, border: `3px solid ${C.forma}` },
      // Fila superior: marca | tema
      h(
        "div",
        { display: "flex", borderBottom: `2px solid ${C.forma}` },
        h(
          "div",
          { display: "flex", alignItems: "baseline", gap: 12, padding: "16px 22px", flexGrow: 1, borderRight: `2px solid ${C.forma}` },
          h("span", { fontFamily: "Archivo", fontWeight: 800, fontSize: 30 }, "Brandon Carrillo"),
          h("span", { fontSize: 26, color: C.formaT }, "datos"),
        ),
        h(
          "div",
          { display: "flex", flexDirection: "column", padding: "10px 22px", width: 330 },
          etiqueta("Tema"),
          h("span", { fontFamily: "Archivo", fontWeight: 700, fontSize: 28 }, tema ?? "Costa Rica"),
        ),
      ),
      // Pregunta
      h(
        "div",
        { display: "flex", flexDirection: "column", padding: "18px 22px 16px", flexGrow: 1, justifyContent: "center", gap: 6 },
        etiqueta(etiquetaTitulo),
        h("div", { fontFamily: "Archivo", fontWeight: 800, fontSize: tamTitulo, lineHeight: 1.04, letterSpacing: -1.5 }, titulo),
      ),
      // Respuesta
      ...(bajada
        ? [
            h(
              "div",
              {
                display: "flex",
                flexDirection: "column",
                gap: 6,
                padding: "16px 22px 20px",
                borderTop: `2px solid ${C.forma}`,
                backgroundColor: C.formaF,
              },
              etiqueta(etiquetaBajada),
              h("div", { display: "flex", flexWrap: "wrap", fontSize: bajada.length > 100 ? 28 : 33, fontWeight: 600, lineHeight: 1.3, color: C.pluma }, ...conColon(bajada)),
            ),
          ]
        : []),
    ),
    h(
      "div",
      { display: "flex", justifyContent: "space-between", width: 1120, fontSize: 22, color: C.tinta2, paddingTop: 14 },
      h("span", {}, "datos.brandoncarrillo.dev"),
      h("span", {}, "Nicoya, Guanacaste, Costa Rica"),
    ),
  )

  const svg = await satori(arbol as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts: fuentes })
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng()
}
