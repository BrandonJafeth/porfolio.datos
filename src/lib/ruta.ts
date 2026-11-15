/**
 * Cálculos de la ruta de 26 semanas.
 * La semana actual se calcula en el momento del build (sitio estático):
 * para que avance cada lunes, programá un build semanal (ver docs/DESPLIEGUE.md).
 */
import { esquemaRuta, type Ruta } from "./datos"
import crudo from "@/data/ruta.json"

export const ruta: Ruta = esquemaRuta.parse(crudo)

const DIA = 86_400_000

/** 0 = todavía no empieza; 1..total = semana en curso; > total = terminó. */
export function semanaActual(hoy = new Date(), r: Ruta = ruta): number {
  const dias = Math.floor((hoy.getTime() - r.inicio.getTime()) / DIA)
  if (dias < 0) return 0
  return Math.floor(dias / 7) + 1
}

export function resumenRuta(hoy = new Date(), r: Ruta = ruta) {
  const actual = semanaActual(hoy, r)
  const hechas = new Set(r.semanasCompletadas)
  const colchon = new Set(r.colchon)
  // Atraso: semanas pasadas (no colchón) sin completar.
  const atrasadas = Array.from({ length: Math.min(Math.max(actual - 1, 0), r.totalSemanas) }, (_, i) => i + 1).filter(
    (s) => !hechas.has(s) && !colchon.has(s),
  )
  return {
    actual,
    total: r.totalSemanas,
    empezo: actual >= 1,
    termino: actual > r.totalSemanas,
    hechas,
    colchon,
    atrasadas,
    enColchon: colchon.has(actual),
  }
}
