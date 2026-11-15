import type { APIRoute, GetStaticPaths } from "astro"
import { obtenerCasos, textoPlano, type Caso } from "@/lib/casos"
import { generarOG } from "@/lib/og"

export const getStaticPaths = (async () => {
  const casos = await obtenerCasos()
  return casos.map((caso) => ({ params: { slug: caso.id }, props: { caso } }))
}) satisfies GetStaticPaths

export const GET: APIRoute<{ caso: Caso }> = async ({ props }) => {
  const { data } = props.caso
  const png = await generarOG({
    titulo: data.pregunta,
    bajada: textoPlano(data.respuestaCorta),
    etiqueta: data.tema,
  })
  return new Response(png as BodyInit, { headers: { "Content-Type": "image/png" } })
}
