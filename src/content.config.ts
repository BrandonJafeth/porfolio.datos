import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"
import { HERRAMIENTAS } from "./lib/herramientas"

/** Cuenta palabras ignorando la marca de glosario {{término|texto}}. */
const contarPalabras = (texto: string) =>
  texto
    .replace(/\{\{([^|}]+)\|([^}]+)\}\}/g, "$2")
    .replace(/\{\{([^}]+)\}\}/g, "$1")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

const maxPalabras = (max: number) =>
  z.string().trim().min(1).refine((t) => contarPalabras(t) <= max, {
    error: `Máximo ${max} palabras: hacelo más corto y directo.`,
  })

/** Ninguna oración de más de 20 palabras en las capas simples. */
const oracionesCortas = (max = 20) =>
  z.string().trim().min(1).refine(
    (t) =>
      t
        .split(/(?<=[.!?¿¡])\s+/)
        .every((oracion) => contarPalabras(oracion) <= max),
    { error: `Cada oración debe tener ${max} palabras o menos.` },
  )

const casos = defineCollection({
  loader: glob({ pattern: "**/index.mdx", base: "./src/content/casos" }),
  schema: ({ image }) =>
    z
      .strictObject({
        /** Título técnico / SEO. Se muestra en modo "Detalle técnico" y en <title>. */
        titulo: z.string().trim().min(10).max(90),
        /** La pregunta en lenguaje cotidiano. Máx. 15 palabras. */
        pregunta: maxPalabras(15),
        /** La conclusión en UNA frase. Máx. 25 palabras. */
        respuestaCorta: maxPalabras(25),
        /** 2 a 4 cifras clave. */
        cifras: z
          .array(
            z.strictObject({
              valor: z.string().trim().min(1).max(14),
              etiqueta: maxPalabras(6),
              significado: oracionesCortas(),
            }),
          )
          .min(2)
          .max(4),
        /** 2–3 viñetas: qué cambia para una persona común. */
        porQueImporta: z.array(oracionesCortas()).min(2).max(3),
        audiencia: z.string().trim().min(3),
        /** Tema para el filtro de /casos (ej. "Economía", "Turismo", "Justicia"). */
        tema: z.string().trim().min(3).max(30),
        /** Fase de la ruta de 26 semanas (0–6). */
        fase: z.number().int().min(0).max(6),
        herramientas: z.array(z.enum(HERRAMIENTAS)).min(1),
        fuentes: z
          .array(z.strictObject({ nombre: z.string().trim().min(2), url: z.url() }))
          .min(1),
        confianza: z.enum(["alta", "media", "baja"]),
        /** Por qué ese nivel de confianza, en una frase simple. */
        confianzaMotivo: oracionesCortas().optional(),
        limitaciones: z.array(z.string().trim().min(5)).min(1),
        repo: z.url(),
        postLinkedIn: z.url().optional(),
        fecha: z.coerce.date(),
        estado: z.enum(["borrador", "publicado"]),
        /** Archivo (sin .json) en src/data/casos/<slug>/ con el gráfico principal. */
        graficoPrincipal: z.string().regex(/^[a-z0-9-]+$/),
        portada: image().optional(),
        portadaAlt: z.string().optional(),
      })
      .refine((d) => !d.portada || !!d.portadaAlt, {
        error: "Si hay portada, agregá portadaAlt (texto alternativo).",
        path: ["portadaAlt"],
      }),
})

export const collections = { casos }
