import rss from "@astrojs/rss"
import type { APIRoute } from "astro"
import { obtenerCasos, textoPlano, urlCaso } from "@/lib/casos"
import { PERFIL, SITIO } from "@/data/perfil"

export const GET: APIRoute = async (context) => {
  const casos = (await obtenerCasos()).filter((c) => c.data.estado === "publicado")
  return rss({
    title: `Casos · ${PERFIL.nombreCorto}`,
    description: SITIO.descripcion,
    site: context.site ?? SITIO.url,
    customData: "<language>es-CR</language>",
    items: casos.map((c) => ({
      title: c.data.pregunta,
      description: textoPlano(c.data.respuestaCorta),
      pubDate: c.data.fecha,
      link: urlCaso(c),
      categories: [c.data.tema, ...c.data.herramientas],
    })),
  })
}
