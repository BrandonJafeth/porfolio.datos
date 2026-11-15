/** Herramientas permitidas en los casos (y filtros de /casos). */
export const HERRAMIENTAS = [
  "SQL",
  "Python",
  "Power BI",
  "Estadística",
  "Automatización",
] as const

export type Herramienta = (typeof HERRAMIENTAS)[number]

export const slugHerramienta = (h: string) =>
  h
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
