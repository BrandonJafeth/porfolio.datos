/**
 * Formato de números al estilo Costa Rica (es-CR).
 * Regla: porcentajes con 1 decimal como máximo, colones con ₡.
 */
const LOCALE = "es-CR"

const cache = new Map<string, Intl.NumberFormat>()
const nf = (opts: Intl.NumberFormatOptions) => {
  const key = JSON.stringify(opts)
  let f = cache.get(key)
  if (!f) {
    f = new Intl.NumberFormat(LOCALE, opts)
    cache.set(key, f)
  }
  return f
}

export type Formato = "numero" | "colones" | "dolares" | "porcentaje" | "entero"

export const numero = (v: number, decimales = 1) =>
  nf({ maximumFractionDigits: decimales }).format(v)

export const entero = (v: number) => nf({ maximumFractionDigits: 0 }).format(v)

export const colones = (v: number, decimales = 2) =>
  nf({
    style: "currency",
    currency: "CRC",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: decimales,
  }).format(v)

export const dolares = (v: number, decimales = 2) =>
  nf({
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: decimales,
  }).format(v)

/** Recibe el porcentaje ya en escala 0–100 (ej. 4.25 → "4,3 %"). */
export const porcentaje = (v: number, decimales: 0 | 1 = 1) =>
  nf({ style: "percent", maximumFractionDigits: decimales }).format(v / 100)

export const formatear = (v: number, formato: Formato = "numero") => {
  switch (formato) {
    case "colones":
      return colones(v)
    case "dolares":
      return dolares(v)
    case "porcentaje":
      return porcentaje(v)
    case "entero":
      return entero(v)
    default:
      return numero(v)
  }
}

/** Versión corta para ejes de gráficos (sin decimales). */
export const formatearEje = (v: number, formato: Formato = "numero") => {
  switch (formato) {
    case "colones":
      return colones(v, 0)
    case "dolares":
      return dolares(v, 0)
    case "porcentaje":
      return porcentaje(v, 0)
    default:
      return nf({ maximumFractionDigits: 0, notation: Math.abs(v) >= 1e6 ? "compact" : "standard" }).format(v)
  }
}

export const fecha = (d: Date, estilo: "largo" | "corto" | "mes" = "largo") =>
  new Intl.DateTimeFormat(LOCALE, {
    timeZone: "UTC",
    ...(estilo === "largo"
      ? { day: "numeric", month: "long", year: "numeric" }
      : estilo === "mes"
        ? { month: "short", year: "numeric" }
        : { day: "numeric", month: "short", year: "numeric" }),
  }).format(d)

export const fechaISO = (d: Date) => d.toISOString().slice(0, 10)
