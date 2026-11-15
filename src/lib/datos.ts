/**
 * Lectura y validación de los JSON que generan los scripts de Python.
 * Formato documentado en docs/DATOS-FORMATO.md.
 * Si un JSON no cumple el formato, el build falla con un mensaje claro.
 */
import { z } from "astro/zod"

const formato = z.enum(["numero", "colones", "dolares", "porcentaje", "entero"])
const fuente = z.strictObject({ nombre: z.string().min(2), url: z.url() })

const base = {
  /** El título ES la conclusión. Ej.: "El dólar sube casi todos los diciembres". */
  titulo: z.string().min(8).max(90),
  /** Resumen en texto para lectores de pantalla: qué muestra y qué concluye. */
  resumen: z.string().min(20),
  fuente,
  /** true si los datos son de muestra (inventados). Se muestra un aviso. */
  ficticio: z.boolean().default(false),
  actualizado: z.coerce.date().optional(),
}

const valorX = z.union([z.string(), z.number()])

export const esquemaLinea = z.strictObject({
  ...base,
  tipo: z.literal("linea"),
  ejeX: z.strictObject({
    tipo: z.enum(["fecha", "numero", "categoria"]).default("fecha"),
    etiqueta: z.string().optional(),
  }),
  ejeY: z.strictObject({
    etiqueta: z.string(),
    formato: formato.default("numero"),
    desdeCero: z.boolean().default(false),
  }),
  series: z
    .array(
      z.strictObject({
        nombre: z.string(),
        destacar: z.boolean().default(false),
        puntos: z.array(z.strictObject({ x: valorX, y: z.number() })).min(2),
      }),
    )
    .min(1),
  anotaciones: z
    .array(
      z.strictObject({
        x: valorX,
        y: z.number(),
        texto: z.string().max(60),
        /** Hacia dónde va el texto respecto al punto. */
        lado: z.enum(["arriba", "abajo", "izquierda", "derecha"]).default("arriba"),
      }),
    )
    .max(4)
    .default([]),
})

export const esquemaBarras = z.strictObject({
  ...base,
  tipo: z.literal("barras"),
  valor: z.strictObject({
    etiqueta: z.string(),
    formato: formato.default("numero"),
  }),
  /** "horizontal" se lee mejor con etiquetas largas (recomendado). */
  orientacion: z.enum(["horizontal", "vertical"]).default("horizontal"),
  ordenar: z.enum(["original", "desc", "asc"]).default("original"),
  barras: z
    .array(
      z.strictObject({
        etiqueta: z.string(),
        valor: z.number(),
        destacar: z.boolean().default(false),
        nota: z.string().max(60).optional(),
      }),
    )
    .min(2)
    .max(24),
})

export const esquemaGrafico = z.discriminatedUnion("tipo", [esquemaLinea, esquemaBarras])

export type DatosLinea = z.infer<typeof esquemaLinea>
export type DatosBarras = z.infer<typeof esquemaBarras>
export type DatosGrafico = z.infer<typeof esquemaGrafico>

const archivos = import.meta.glob<unknown>("/src/data/casos/**/*.json", {
  eager: true,
  import: "default",
})

/** Carga y valida src/data/casos/<slug>/<nombre>.json */
export function cargarGrafico(slug: string, nombre: string): DatosGrafico {
  const ruta = `/src/data/casos/${slug}/${nombre}.json`
  const crudo = archivos[ruta]
  if (crudo === undefined) {
    throw new Error(`No encontré ${ruta}. Revisá graficoPrincipal en el MDX del caso "${slug}".`)
  }
  const r = esquemaGrafico.safeParse(crudo)
  if (!r.success) {
    throw new Error(`El archivo ${ruta} no tiene el formato esperado:\n${z.prettifyError(r.error)}`)
  }
  return r.data
}

/** Todos los JSON de un caso que digan ficticio: true. */
export function tieneDatosFicticios(slug: string): boolean {
  return Object.entries(archivos).some(
    ([ruta, v]) =>
      ruta.startsWith(`/src/data/casos/${slug}/`) &&
      typeof v === "object" &&
      v !== null &&
      (v as { ficticio?: unknown }).ficticio === true,
  )
}

/* ── Indicadores (fase futura) ─────────────────────────── */

export const esquemaIndicadores = z.strictObject({
  actualizado: z.coerce.date().nullable(),
  nota: z.string().optional(),
  indicadores: z.array(
    z.strictObject({
      id: z.string(),
      nombre: z.string(),
      valor: z.number(),
      formato,
      /** Cambio vs. el periodo anterior, en la misma unidad o en %. */
      cambio: z.number().optional(),
      cambioFormato: formato.optional(),
      periodo: z.string(),
      /** Qué significa en palabras simples (≤ 20 palabras). */
      explicacion: z.string(),
      /** true = que suba es bueno; false = que suba es malo; null = neutro. */
      subirEsBueno: z.boolean().nullable().default(null),
      serie: z.array(z.number()).optional(),
      fuente,
    }),
  ),
})

export type Indicadores = z.infer<typeof esquemaIndicadores>

/* ── Ruta de 26 semanas ───────────────────────────────── */

export const esquemaRuta = z
  .strictObject({
    /** Lunes de la semana 1 (ISO). */
    inicio: z.coerce.date(),
    fin: z.coerce.date().optional(),
    totalSemanas: z.number().int().positive(),
    /** Semanas de colchón (fin de año, Semana Santa): no cuentan como atraso. */
    colchon: z.array(z.number().int().positive()).default([]),
    /** Semanas que marcás a mano como completadas. */
    semanasCompletadas: z.array(z.number().int().positive()),
    nota: z.string().optional(),
    fases: z
      .array(
        z.strictObject({
          numero: z.number().int().min(0).max(6),
          nombre: z.string(),
          objetivo: z.string().optional(),
          semanas: z.tuple([z.number().int(), z.number().int()]),
          temas: z.array(z.string()).default([]),
          /** Caso planeado para la fase. */
          caso: z
            .strictObject({ titulo: z.string(), fuente: z.string().optional(), url: z.string().optional() })
            .optional(),
        }),
      )
      .min(1),
  })
  .refine((r) => r.semanasCompletadas.every((s) => s <= r.totalSemanas), {
    error: "semanasCompletadas tiene semanas fuera de la ruta.",
  })

export type Ruta = z.infer<typeof esquemaRuta>
