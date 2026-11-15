import type { APIRoute } from "astro"
import { generarOG } from "@/lib/og"

export const GET: APIRoute = async () => {
  const png = await generarOG({
    titulo: "Convierto datos públicos de Costa Rica en respuestas que cualquiera entiende.",
    bajada: "Analista de datos · Full Stack Developer",
  })
  return new Response(png as BodyInit, { headers: { "Content-Type": "image/png" } })
}
