/**
 * Textos de interfaz en español de Costa Rica.
 * Para agregar otro idioma: crear en.ts con las mismas claves y registrarlo en src/i18n/index.ts
 * y en `i18n.locales` de astro.config.mjs.
 */
export const esCR = {
  "nav.casos": "Casos",
  "nav.indicadores": "Indicadores",
  "nav.ruta": "Ruta",
  "nav.sobreMi": "Sobre mí",
  "nav.principal": "Principal",
  "skip": "Saltar al contenido",

  "hero.h1": "Analista de datos en Costa Rica",
  "hero.promesa": "Convierto datos en respuestas que cualquiera entiende.",
  "hero.apoyo": "SQL, Python y Power BI aplicados a economía, empleo, negocios y más. Datos abiertos de Costa Rica y del mundo.",
  "hero.verCasos": "Ver casos",

  "ruta.empieza": "Mi ruta de datos empieza el {fecha}",
  "ruta.enProgreso": "En progreso: semana {semana} de {total}",
  "ruta.colchon": "Semana {semana} de {total} (semana de colchón)",
  "ruta.terminada": "Ruta de {total} semanas completada",
  "ruta.ver": "ver mi ruta",

  "lectura.nivel": "Nivel de lectura",
  "lectura.simple": "Explicación simple",
  "lectura.tecnico": "Detalle técnico",

  "certs.verificar": "Verificar",
  "certs.sinLink": "Sin link público",
  "certs.verTodas": "Ver todas en LinkedIn",
} as const

export type ClaveUI = keyof typeof esCR
