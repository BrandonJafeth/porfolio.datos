import { getCollection, type CollectionEntry } from "astro:content"

export type Caso = CollectionEntry<"casos">

/**
 * Los borradores solo se ven en `astro dev`.
 * Para probar el diseño con borradores en un build local:
 *   MOSTRAR_BORRADORES=true pnpm build
 * Nunca actives esa variable en Cloudflare.
 */
export const incluirBorradores = () =>
  import.meta.env.DEV || process.env.MOSTRAR_BORRADORES === "true"

export async function obtenerCasos(): Promise<Caso[]> {
  const todos = await getCollection("casos", ({ data }) =>
    incluirBorradores() ? true : data.estado === "publicado",
  )
  return todos.sort((a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf())
}

export const urlCaso = (c: Caso) => `/casos/${c.id}/`

/**
 * Número de caso (P1, P2…): orden de publicación, del más viejo al más nuevo.
 * Es estable: un caso nuevo no cambia el número de los anteriores.
 */
export function numerarCasos(casos: Caso[]): Map<string, number> {
  const orden = [...casos].sort((a, b) => a.data.fecha.valueOf() - b.data.fecha.valueOf() || a.id.localeCompare(b.id))
  return new Map(orden.map((c, i) => [c.id, i + 1]))
}

export async function numeroDeCaso(id: string): Promise<number> {
  return numerarCasos(await obtenerCasos()).get(id) ?? 0
}

/** Quita la marca de glosario: {{mediana|el valor del medio}} → "el valor del medio". */
export const textoPlano = (t: string) =>
  t.replace(/\{\{([^|}]+)\|([^}]+)\}\}/g, "$2").replace(/\{\{([^}]+)\}\}/g, "$1")

export const contarPalabras = (t: string) =>
  textoPlano(t).trim().split(/\s+/).filter(Boolean).length

export const textoConfianza = {
  alta: "Confianza alta",
  media: "Confianza media",
  baja: "Confianza baja",
} as const

export const motivoConfianzaPorDefecto = {
  alta: "Los datos son oficiales y el resultado se repite de forma clara.",
  media: "Los datos son buenos, pero hay huecos o pocos años para comparar.",
  baja: "Es una primera mirada. Tomalo como pista, no como prueba.",
} as const
