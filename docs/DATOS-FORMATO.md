# Formato de los datos (JSON)

Tus scripts de Python **generan** estos archivos y el sitio solo los **lee**. Todos se validan en build con Zod (`src/lib/datos.ts`). Si un JSON no cumple el formato, `pnpm build` falla y el mensaje dice qué campo está mal.

Reglas generales:
- Codificación UTF-8 y números como números, no como texto: `523.4`, no `"523,4"`.
- El sitio formatea los números al estilo es-CR: ₡, coma decimal y máximo 1 decimal en porcentajes. **No** exportes los números ya formateados.
- Fechas en ISO: `"2026-11-15"`.
- Si los datos son de muestra, poné `"ficticio": true`. El sitio muestra un aviso.

---

## Gráficos de un caso: `src/data/casos/<slug>/<nombre>.json`

`<slug>` es el nombre de la carpeta del caso. `<nombre>` usa minúsculas y guiones; es lo que ponés en `graficoPrincipal` o en `archivo="…"`.

### Campos comunes

| Campo | Tipo | Notas |
|---|---|---|
| `tipo` | `"linea"` \| `"barras"` | Obligatorio |
| `titulo` | string (8–90 caracteres) | **Es la conclusión**: "El dólar sube casi todos los diciembres", no "Tipo de cambio 2020–2026" |
| `resumen` | string | Texto para lectores de pantalla: qué muestra y qué concluye |
| `fuente` | `{ "nombre", "url" }` | Se muestra debajo del gráfico |
| `ficticio` | boolean | Opcional. `true` muestra el aviso "Datos ficticios" |
| `actualizado` | fecha ISO | Opcional |

### Línea (`"tipo": "linea"`)

```json
{
  "tipo": "linea",
  "titulo": "El dólar sube casi todos los diciembres",
  "resumen": "Línea destacada: promedio 2020–2025. Sube de octubre a diciembre y baja en febrero.",
  "fuente": { "nombre": "BCCR", "url": "https://gee.bccr.fi.cr/indicadoreseconomicos/" },
  "ejeX": { "tipo": "fecha" },
  "ejeY": { "etiqueta": "Colones por dólar", "formato": "colones", "desdeCero": false },
  "series": [
    { "nombre": "2024", "destacar": false, "puntos": [{ "x": "2024-01-01", "y": 518.2 }, { "x": "2024-02-01", "y": 512.9 }] },
    { "nombre": "Promedio", "destacar": true, "puntos": [{ "x": "2024-01-01", "y": 520.1 }, { "x": "2024-02-01", "y": 514.0 }] }
  ],
  "anotaciones": [
    { "x": "2024-02-01", "y": 514.0, "texto": "Febrero: el más barato", "lado": "abajo" }
  ]
}
```

- `ejeX.tipo` acepta `"fecha"` (x en ISO), `"numero"` o `"categoria"` (x como texto; el orden de aparición manda).
- `ejeY.formato` acepta `numero`, `entero`, `colones`, `dolares` o `porcentaje`. Los porcentajes van en escala 0–100: `4.25` se muestra como "4,3 %".
- **Un solo color**: marcá `destacar: true` solo en la serie que cuenta la historia. Las demás salen en gris.
- No hay leyenda. Cada serie se rotula al final de su línea y, con más de 3 series, solo se rotulan las destacadas.
- `anotaciones` admite hasta 4, con texto de 60 caracteres como máximo. `lado` acepta `arriba`, `abajo`, `izquierda` o `derecha`.

### Barras (`"tipo": "barras"`)

```json
{
  "tipo": "barras",
  "titulo": "Guanacaste recibe 1 de cada 3 turistas",
  "resumen": "Barras horizontales: llegadas por provincia en 2025. Guanacaste está destacada.",
  "fuente": { "nombre": "ICT", "url": "https://www.ict.go.cr/" },
  "valor": { "etiqueta": "Llegadas", "formato": "entero" },
  "orientacion": "horizontal",
  "ordenar": "desc",
  "barras": [
    { "etiqueta": "Guanacaste", "valor": 1200000, "destacar": true },
    { "etiqueta": "San José", "valor": 950000 }
  ]
}
```

- `orientacion` usa `"horizontal"` por defecto, que se lee mejor con etiquetas largas.
- `ordenar` acepta `"original"`, `"desc"` o `"asc"`.
- Las barras van de 2 a 24.

---

## Indicadores: `src/data/indicadores/latest.json`

El GitHub Action semanal reemplaza este archivo completo. Si `indicadores` es `[]`, la página muestra "En construcción".

```json
{
  "actualizado": "2026-11-16",
  "indicadores": [
    {
      "id": "tipo-cambio-venta",
      "nombre": "Dólar (venta)",
      "valor": 512.35,
      "formato": "colones",
      "cambio": -1.8,
      "cambioFormato": "colones",
      "periodo": "Semana del 10 al 14 de nov.",
      "explicacion": "Comprar $100 te cuesta unos ₡180 menos que la semana pasada.",
      "subirEsBueno": null,
      "serie": [520.1, 518.4, 515.0, 514.2, 512.35],
      "fuente": { "nombre": "BCCR", "url": "https://gee.bccr.fi.cr/indicadoreseconomicos/" }
    }
  ]
}
```

- `subirEsBueno` vale `true` si que suba es bueno, `false` si es malo y `null` si es neutro. Define el color del cambio.
- `serie` es opcional y dibuja una mini línea con los últimos valores.

## Ruta: `src/data/ruta.json`

```json
{
  "inicio": "2026-11-02",
  "totalSemanas": 26,
  "semanasCompletadas": [1, 2, 3],
  "fases": [
    { "numero": 0, "nombre": "Fundamentos", "objetivo": "…", "semanas": [1, 2], "temas": ["Git"] }
  ]
}
```

- Si `nota` empieza con `"EJEMPLO"`, la página muestra el aviso "Datos de ejemplo". Borrá la `nota` cuando cargues tu ruta real.
- El campo `fase` de cada caso (0–6) enlaza el caso con su fase.
