import type { APIRoute } from "astro"
import { generarOG } from "@/lib/og"

export const GET: APIRoute = async () => {
  const png = await generarOG({
    etiquetaTitulo: "Ocupación",
    titulo: "Analista de datos en Costa Rica",
    etiquetaBajada: "¿Qué hace?",
    bajada: "Convierto datos en respuestas que cualquiera entiende.",
    etiqueta: "SQL, Python, Power BI",
  })
  return new Response(png as BodyInit, { headers: { "Content-Type": "image/png" } })
}
