/**
 * <ConsultaSQL> — isla Preact para que el visitante corra SQL sobre los datos del caso.
 *
 * Estado: PREPARADO (fase futura). Funciona, pero:
 *  - DuckDB-WASM (~7 MB) se descarga SOLO al hacer clic en "Abrir consola", desde jsDelivr.
 *  - Los datos (CSV/Parquet) vivirán en Cloudflare R2; por ahora pasá cualquier URL pública con CORS.
 *
 * Uso en MDX:
 *   import ConsultaSQL from "@/components/islas/ConsultaSQL"
 *   <ConsultaSQL client:visible archivo="https://.../tipo-cambio.parquet" tabla="tipo_cambio"
 *     consultaInicial="SELECT * FROM tipo_cambio LIMIT 10" />
 */
import { useRef, useState } from "preact/hooks"

/** Última versión estable (no -dev) publicada en npm. Revisá antes de actualizar. */
const DUCKDB_VERSION = "1.32.0"
const CDN = `https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@${DUCKDB_VERSION}/+esm`
const MAX_FILAS = 200

type Props = {
  /** URL del CSV o Parquet. */
  archivo: string
  /** Nombre de la tabla/vista para las consultas. */
  tabla: string
  consultaInicial?: string
}

type Estado =
  | { tipo: "cerrado" }
  | { tipo: "cargando"; paso: string }
  | { tipo: "listo" }
  | { tipo: "error"; mensaje: string }

type Resultado = { columnas: string[]; filas: unknown[][]; total: number; ms: number }

// Tipos mínimos de lo que usamos de DuckDB (se carga desde CDN, sin dependencia npm).
type Conexion = {
  query: (sql: string) => Promise<{
    schema: { fields: { name: string }[] }
    numRows: number
    toArray: () => { toJSON: () => Record<string, unknown> }[]
  }>
}

const fmt = new Intl.NumberFormat("es-CR", { maximumFractionDigits: 2 })
const celda = (v: unknown) =>
  typeof v === "number" ? fmt.format(v) : typeof v === "bigint" ? fmt.format(Number(v)) : v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? "—")

export default function ConsultaSQL({ archivo, tabla, consultaInicial }: Props) {
  const [estado, setEstado] = useState<Estado>({ tipo: "cerrado" })
  const [sql, setSql] = useState(consultaInicial ?? `SELECT * FROM ${tabla} LIMIT 10`)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [errorConsulta, setErrorConsulta] = useState<string | null>(null)
  const [corriendo, setCorriendo] = useState(false)
  const con = useRef<Conexion | null>(null)

  async function abrir() {
    try {
      setEstado({ tipo: "cargando", paso: "Descargando el motor SQL (una sola vez)…" })
      const duckdb = await import(/* @vite-ignore */ CDN)
      const bundle = await duckdb.selectBundle(duckdb.getJsDelivrBundles())
      const workerUrl = URL.createObjectURL(
        new Blob([`importScripts("${bundle.mainWorker}");`], { type: "text/javascript" }),
      )
      const db = new duckdb.AsyncDuckDB(new duckdb.VoidLogger(), new Worker(workerUrl))
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker)
      URL.revokeObjectURL(workerUrl)

      setEstado({ tipo: "cargando", paso: "Cargando los datos del caso…" })
      const nombre = archivo.split("/").pop() ?? "datos"
      await db.registerFileURL(nombre, archivo, duckdb.DuckDBDataProtocol.HTTP, false)
      const c: Conexion = await db.connect()
      const lector = nombre.endsWith(".parquet") ? "read_parquet" : "read_csv_auto"
      await c.query(`CREATE VIEW ${tabla} AS SELECT * FROM ${lector}('${nombre}')`)
      con.current = c
      setEstado({ tipo: "listo" })
      await correr()
    } catch (e) {
      setEstado({
        tipo: "error",
        mensaje: `No se pudo abrir la consola. Revisá tu conexión e intentá de nuevo. (${e instanceof Error ? e.message : String(e)})`,
      })
    }
  }

  async function correr() {
    if (!con.current) return
    setCorriendo(true)
    setErrorConsulta(null)
    const t0 = performance.now()
    try {
      const r = await con.current.query(sql)
      const columnas = r.schema.fields.map((f) => f.name)
      const filas = r
        .toArray()
        .slice(0, MAX_FILAS)
        .map((row) => {
          const o = row.toJSON()
          return columnas.map((c) => o[c])
        })
      setResultado({ columnas, filas, total: r.numRows, ms: performance.now() - t0 })
    } catch (e) {
      setErrorConsulta(e instanceof Error ? e.message : String(e))
    } finally {
      setCorriendo(false)
    }
  }

  if (estado.tipo === "cerrado" || estado.tipo === "error") {
    return (
      <div class="consulta border-2 border-forma bg-papel-2 p-5">
        <p class="font-titulo text-xl text-tinta">Probá los datos vos mismo</p>
        <p class="mt-1 text-base text-tinta-2">
          Escribí consultas SQL sobre los datos de este caso, directo en tu navegador. Descarga unos 7 MB.
        </p>
        {estado.tipo === "error" && (
          <p role="alert" class="mt-3 text-base text-nivel-baja">
            {estado.mensaje}
          </p>
        )}
        <button
          type="button"
          onClick={abrir}
          class="mt-4 inline-flex items-center gap-2 bg-pluma px-5 py-2.5 text-base font-bold text-pluma-ink"
        >
          {estado.tipo === "error" ? "Reintentar" : "Abrir consola SQL"}
        </button>
      </div>
    )
  }

  if (estado.tipo === "cargando") {
    return (
      <div class="consulta border-2 border-forma bg-papel-2 p-5" aria-live="polite" aria-busy="true">
        <p class="text-base text-tinta-2">{estado.paso}</p>
      </div>
    )
  }

  return (
    <div class="consulta border-2 border-forma bg-papel-2 p-4">
      <label for="consulta-sql" class="text-sm font-bold text-tinta-2">
        Consulta sobre la tabla <code>{tabla}</code>
      </label>
      <textarea
        id="consulta-sql"
        value={sql}
        onInput={(e) => setSql((e.target as HTMLTextAreaElement).value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") correr()
        }}
        rows={4}
        spellcheck={false}
        class="mt-2 w-full border border-forma bg-papel p-3 font-mono text-sm text-tinta"
      />
      <div class="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={correr}
          disabled={corriendo}
          class="bg-pluma px-4 py-2 text-base font-bold text-pluma-ink disabled:opacity-60"
        >
          {corriendo ? "Corriendo…" : "Correr"}
        </button>
        <span class="text-sm text-tinta-3">Ctrl + Enter</span>
      </div>
      <div aria-live="polite">
        {errorConsulta && (
          <p role="alert" class="mt-3 font-mono text-sm text-nivel-baja">
            {errorConsulta}
          </p>
        )}
        {resultado && (
          <>
            <p class="mt-3 text-sm text-tinta-3">
              {fmt.format(resultado.total)} filas · {Math.round(resultado.ms)} ms
              {resultado.total > MAX_FILAS && ` · mostrando ${MAX_FILAS}`}
            </p>
            <div class="mt-2 max-h-96 overflow-auto border border-forma">
              <table class="num w-full text-sm">
                <thead class="sticky top-0 bg-forma-f">
                  <tr>
                    {resultado.columnas.map((c) => (
                      <th scope="col" class="px-3 py-2 text-left font-bold">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resultado.filas.map((f) => (
                    <tr class="border-t border-forma">
                      {f.map((v) => (
                        <td class="px-3 py-1.5">{celda(v)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
