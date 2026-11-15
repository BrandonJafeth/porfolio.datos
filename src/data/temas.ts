/**
 * Textos SEO de las páginas /casos/tema/[tema].
 * La clave es el slug del campo `tema` de los casos (sin tildes, minúsculas).
 * Si un tema no está aquí, se genera un texto genérico.
 */
export type TextoTema = { h1: string; intro: string; titulo: string; descripcion: string }

export const TEMAS: Record<string, TextoTema> = {
  economia: {
    h1: "Análisis de datos de economía en Costa Rica",
    intro: "Tipo de cambio, tasas, inflación y precios, explicados con datos del BCCR y el INEC.",
    titulo: "Análisis de datos de economía en Costa Rica",
    descripcion: "Análisis de datos de economía en Costa Rica: tipo de cambio, tasas e inflación con datos oficiales, explicados en una frase.",
  },
  empleo: {
    h1: "Análisis de datos de empleo en Costa Rica",
    intro: "Trabajo, ingresos y desempleo por región, con encuestas oficiales del INEC.",
    titulo: "Análisis de datos de empleo en Costa Rica",
    descripcion: "Análisis de datos de empleo en Costa Rica: desempleo, ingresos y diferencias por región, con datos del INEC.",
  },
  seguridad: {
    h1: "Análisis de datos de seguridad en Costa Rica",
    intro: "Delitos por cantón y su evolución, con estadísticas del Poder Judicial.",
    titulo: "Análisis de datos de seguridad en Costa Rica",
    descripcion: "Análisis de datos de seguridad en Costa Rica: delitos por cantón y tendencias, con estadísticas del Poder Judicial.",
  },
  negocios: {
    h1: "Análisis de datos para negocios",
    intro: "Ventas, inventario y clientes: tableros que responden preguntas de una PYME.",
    titulo: "Análisis de datos para negocios en Costa Rica",
    descripcion: "Análisis de datos para negocios en Costa Rica: ventas, inventario y tableros en Power BI para PYMEs.",
  },
  turismo: {
    h1: "Análisis de datos de turismo en Costa Rica",
    intro: "Llegadas, temporadas y ocupación, con foco en Guanacaste y datos del ICT.",
    titulo: "Análisis de datos de turismo en Costa Rica",
    descripcion: "Análisis de datos de turismo en Costa Rica y Guanacaste: llegadas, temporadas y ocupación, con datos del ICT.",
  },
}

export function textoTema(slug: string, nombre: string): TextoTema {
  return (
    TEMAS[slug] ?? {
      h1: `Análisis de datos de ${nombre.toLowerCase()} en Costa Rica`,
      intro: `Casos sobre ${nombre.toLowerCase()} con datos públicos, explicados en una frase.`,
      titulo: `Análisis de datos de ${nombre.toLowerCase()} en Costa Rica`,
      descripcion: `Análisis de datos de ${nombre.toLowerCase()} en Costa Rica con datos públicos: cada caso responde una pregunta en una frase.`,
    }
  )
}
