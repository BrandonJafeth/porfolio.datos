/**
 * i18n mínimo, listo para crecer. Hoy solo existe es-CR (sin prefijo en las URLs).
 * Uso: t("hero.h1") · t("ruta.enProgreso", { semana: 3, total: 26 })
 */
import { esCR, type ClaveUI } from "./es-CR"

export const IDIOMAS = { "es-CR": esCR } as const
export type Idioma = keyof typeof IDIOMAS
export const IDIOMA_POR_DEFECTO: Idioma = "es-CR"

export function t(clave: ClaveUI, vars: Record<string, string | number> = {}, idioma: Idioma = IDIOMA_POR_DEFECTO): string {
  const texto: string = IDIOMAS[idioma][clave] ?? IDIOMAS[IDIOMA_POR_DEFECTO][clave]
  return texto.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`))
}
