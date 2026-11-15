/**
 * Gráficos con Observable Plot renderizados a SVG en build (cero JS en el cliente).
 * Regla de diseño: un solo color destacado, el resto en gris; anotaciones directas, sin leyenda.
 */
import * as Plot from "@observablehq/plot"
import { parseHTML } from "linkedom"
import type { DatosBarras, DatosLinea } from "./datos"
import { formatear, formatearEje } from "./formato"

const { document } = parseHTML("<!doctype html><html><body></body></html>")

const C = {
  acento: "var(--chart-accent)",
  gris: "var(--chart-muted)",
  rejilla: "var(--chart-grid)",
  tinta: "var(--tinta)",
  tinta2: "var(--tinta-2)",
  papel: "var(--papel)",
}

const ESTILO = {
  fontFamily: "inherit",
  fontSize: "13px",
  color: "var(--tinta-2)",
  background: "transparent",
  overflow: "visible",
}

export type Variante = { ancho: number; svg: string }

const aSvg = (el: unknown) => (el as { outerHTML: string }).outerHTML

const mesCorto = new Intl.DateTimeFormat("es-CR", { month: "short", timeZone: "UTC" })
const anio = new Intl.DateTimeFormat("es-CR", { year: "numeric", timeZone: "UTC" })

function formatoFecha(d: Date) {
  return d.getUTCMonth() === 0 ? anio.format(d) : mesCorto.format(d).replace(".", "")
}

/* ── Línea ─────────────────────────────────────────────── */

type PuntoPlano = { serie: string; destacar: boolean; x: Date | number | string; y: number }

export function renderLinea(d: DatosLinea, anchos = [720, 360]): Variante[] {
  const parseX = (x: string | number) =>
    d.ejeX.tipo === "fecha" ? new Date(String(x)) : d.ejeX.tipo === "numero" ? Number(x) : String(x)

  const puntos: PuntoPlano[] = d.series.flatMap((s) =>
    s.puntos.map((p) => ({ serie: s.nombre, destacar: s.destacar, x: parseX(p.x), y: p.y })),
  )
  // Grises primero, destacadas encima.
  const ordenadas = [...d.series].sort((a, b) => Number(a.destacar) - Number(b.destacar))
  const muchasSeries = d.series.length > 3
  const dominioCat =
    d.ejeX.tipo === "categoria" ? [...new Set(d.series.flatMap((s) => s.puntos.map((p) => String(p.x))))] : undefined

  return anchos.map((ancho) => {
    const angosto = ancho < 480
    const etiquetaFinalAncho = Math.min(
      110,
      Math.max(...d.series.filter((s) => s.destacar || !muchasSeries).map((s) => s.nombre.length), 4) * 8 + 12,
    )

    const marcas: Plot.Markish[] = [
      Plot.gridY({ stroke: C.rejilla, strokeOpacity: 1, ticks: angosto ? 4 : 5 }),
      ...(d.ejeY.desdeCero ? [Plot.ruleY([0], { stroke: C.tinta2, strokeOpacity: 0.6 })] : []),
    ]

    for (const s of ordenadas) {
      const datos = puntos.filter((p) => p.serie === s.nombre)
      marcas.push(
        Plot.line(datos, {
          x: "x",
          y: "y",
          stroke: s.destacar ? C.acento : C.gris,
          strokeWidth: s.destacar ? (angosto ? 2.5 : 3) : 1.5,
          strokeOpacity: s.destacar ? 1 : 0.9,
          curve: "monotone-x",
        }),
      )
      if (s.destacar || !muchasSeries) {
        marcas.push(
          Plot.dot(datos, Plot.selectLast({ x: "x", y: "y", r: s.destacar ? 4 : 2.5, fill: s.destacar ? C.acento : C.gris })),
          Plot.text(
            datos,
            Plot.selectLast({
              x: "x",
              y: "y",
              text: () => s.nombre,
              dx: 8,
              textAnchor: "start",
              fill: s.destacar ? C.acento : C.tinta2,
              fontWeight: s.destacar ? 700 : 400,
              fontSize: angosto ? 12 : 13,
            }),
          ),
        )
      }
    }

    for (const a of d.anotaciones) {
      const x = parseX(a.x)
      const off = angosto ? 18 : 24
      const pos = {
        arriba: { dx: 0, dy: -off, textAnchor: "middle" as const },
        abajo: { dx: 0, dy: off, textAnchor: "middle" as const },
        izquierda: { dx: -12, dy: 0, textAnchor: "end" as const },
        derecha: { dx: 12, dy: 0, textAnchor: "start" as const },
      }[a.lado]
      marcas.push(
        Plot.dot([{ x, y: a.y }], { x: "x", y: "y", r: 6, stroke: C.tinta, strokeWidth: 1.5, fill: "none" }),
        Plot.text([{ x, y: a.y }], {
          x: "x",
          y: "y",
          text: () => a.texto,
          ...pos,
          lineWidth: angosto ? 12 : 18,
          fill: C.tinta,
          stroke: C.papel,
          strokeWidth: 5,
          paintOrder: "stroke",
          fontWeight: 600,
          fontSize: angosto ? 12 : 13.5,
        }),
      )
    }

    const el = Plot.plot({
      document,
      width: ancho,
      height: angosto ? 260 : 340,
      marginTop: 28,
      marginLeft: angosto ? 46 : 60,
      marginRight: etiquetaFinalAncho,
      marginBottom: 32,
      style: ESTILO,
      x: {
        label: null,
        ...(dominioCat ? {} : { ticks: angosto ? 4 : 7 }),
        tickSize: 0,
        ...(d.ejeX.tipo === "fecha" ? { tickFormat: (v: Date) => formatoFecha(v) } : {}),
        ...(dominioCat
          ? {
              domain: dominioCat,
              ticks: angosto ? dominioCat.filter((_, i) => i % 3 === 0 || i === dominioCat.length - 1) : dominioCat,
              padding: 0.1,
            }
          : {}),
      },
      y: {
        label: d.ejeY.etiqueta,
        labelAnchor: "top",
        labelArrow: "none",
        tickSize: 0,
        ticks: angosto ? 4 : 5,
        zero: d.ejeY.desdeCero,
        nice: true,
        tickFormat: (v: number) => formatearEje(v, d.ejeY.formato),
      },
      marks: marcas,
    })
    return { ancho, svg: aSvg(el) }
  })
}

/* ── Barras ────────────────────────────────────────────── */

export function renderBarras(d: DatosBarras, anchos = [720, 360]): Variante[] {
  let barras = [...d.barras]
  if (d.ordenar === "desc") barras.sort((a, b) => b.valor - a.valor)
  if (d.ordenar === "asc") barras.sort((a, b) => a.valor - b.valor)
  const orden = barras.map((b) => b.etiqueta)
  const fmt = (v: number) => formatear(v, d.valor.formato)

  return anchos.map((ancho) => {
    const angosto = ancho < 480
    let el: unknown

    if (d.orientacion === "horizontal") {
      const largoEtiqueta = Math.max(...barras.map((b) => b.etiqueta.length))
      const marginLeft = Math.min(angosto ? 120 : 200, largoEtiqueta * (angosto ? 7 : 7.6) + 14)
      const fila = angosto ? 30 : 34
      el = Plot.plot({
        document,
        width: ancho,
        height: barras.length * fila + 16,
        marginLeft,
        marginRight: angosto ? 64 : 84,
        marginTop: 8,
        marginBottom: 8,
        style: ESTILO,
        x: { axis: null, zero: true, nice: true },
        y: { label: null, domain: orden, tickSize: 0, padding: 0.28 },
        marks: [
          Plot.barX(barras, {
            x: "valor",
            y: "etiqueta",
            fill: (b: (typeof barras)[number]) => (b.destacar ? C.acento : C.gris),
            rx: 2,
          }),
          Plot.ruleX([0], { stroke: C.tinta2, strokeOpacity: 0.6 }),
          ...[true, false].map((dest) =>
            Plot.text(
              barras.filter((b) => b.destacar === dest),
              {
                x: "valor",
                y: "etiqueta",
                text: (b: (typeof barras)[number]) => fmt(b.valor),
                dx: 6,
                textAnchor: "start",
                fill: dest ? C.acento : C.tinta2,
                fontWeight: dest ? 700 : 400,
                fontVariant: "tabular-nums",
              },
            ),
          ),
        ],
      })
    } else {
      el = Plot.plot({
        document,
        width: ancho,
        height: angosto ? 260 : 320,
        marginTop: 28,
        marginBottom: 36,
        marginLeft: 8,
        marginRight: 8,
        style: ESTILO,
        x: { label: null, domain: orden, tickSize: 0, padding: 0.25 },
        y: { axis: null, zero: true, nice: true },
        marks: [
          Plot.barY(barras, {
            x: "etiqueta",
            y: "valor",
            fill: (b: (typeof barras)[number]) => (b.destacar ? C.acento : C.gris),
            rx: 2,
          }),
          Plot.ruleY([0], { stroke: C.tinta2, strokeOpacity: 0.6 }),
          ...[true, false].map((dest) =>
            Plot.text(
              barras.filter((b) => b.destacar === dest),
              {
                x: "etiqueta",
                y: "valor",
                text: (b: (typeof barras)[number]) => fmt(b.valor),
                dy: -10,
                fill: dest ? C.acento : C.tinta2,
                fontWeight: dest ? 700 : 400,
                fontSize: angosto ? 11 : 13,
              },
            ),
          ),
        ],
      })
    }
    return { ancho, svg: aSvg(el) }
  })
}


/** Mini línea para tarjetas: path SVG simple, sin ejes. */
export function sparkline(valores: number[], ancho = 120, alto = 32) {
  if (valores.length < 2) return null
  const min = Math.min(...valores)
  const max = Math.max(...valores)
  const rango = max - min || 1
  const pasos = ancho / (valores.length - 1)
  const pts = valores.map((v, i) => [i * pasos, alto - 3 - ((v - min) / rango) * (alto - 6)] as const)
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")
  const ultimo = pts[pts.length - 1]!
  return { d, ultimo, ancho, alto }
}
