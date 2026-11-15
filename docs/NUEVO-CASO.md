# Cómo agregar un caso nuevo

## 1. Crear las carpetas

```
src/content/casos/<slug>/index.mdx        ← el texto del caso
src/content/casos/<slug>/portada.jpg      ← opcional
src/data/casos/<slug>/<grafico>.json      ← lo que exporta tu script de Python
```

El `<slug>` va en minúsculas y con guiones (`dolar-diciembre`), y es la URL: `/casos/dolar-diciembre/`.

El formato de los JSON está en [DATOS-FORMATO.md](./DATOS-FORMATO.md).

## 2. Escribir el frontmatter

Usá como plantilla `src/content/casos/ejemplo-dolar-diciembre/index.mdx`. El esquema está en `src/content.config.ts` y **el build falla** si algo no cumple.

```yaml
---
titulo: "Estacionalidad del tipo de cambio CRC/USD 2020–2025"   # técnico / SEO
pregunta: "¿Cuándo conviene comprar dólares?"                    # máx. 15 palabras
respuestaCorta: "En febrero: el dólar baja casi siempre después de diciembre."  # máx. 25 palabras
cifras:                                                          # 2 a 4
  - valor: "₡8"
    etiqueta: "de diferencia por dólar"                          # máx. 6 palabras
    significado: "Entre el mes más caro y el más barato."        # oraciones ≤ 20 palabras
porQueImporta:                                                   # 2 o 3
  - "Si pagás algo en dólares, elegir el mes te ahorra plata."
audiencia: "Personas que ahorran o pagan en dólares"
tema: "Economía"                                                 # para el filtro de /casos
fase: 1                                                          # 0–6, enlaza con /ruta
herramientas: ["SQL", "Python"]                                  # SQL, Python, Power BI, Estadística, Automatización
fuentes:
  - nombre: "BCCR — Indicadores económicos"
    url: "https://gee.bccr.fi.cr/indicadoreseconomicos/"
confianza: "alta"                                                # alta | media | baja
confianzaMotivo: "Los datos son oficiales y cubren 6 años."     # opcional
limitaciones:
  - "No incluye el tipo de cambio de ventanilla de cada banco."
repo: "https://github.com/<usuario>/<repo>"
postLinkedIn: "https://www.linkedin.com/posts/…"                 # opcional, cuando exista
fecha: 2026-12-01
estado: "borrador"                                               # cambiá a "publicado" al final
graficoPrincipal: "estacionalidad"                               # nombre del JSON, sin .json
# portada: "./portada.jpg"
# portadaAlt: "Descripción de la imagen"
---
```

### Términos técnicos en el frontmatter

Dentro de `respuestaCorta`, `significado`, `porQueImporta`, `confianzaMotivo` y `limitaciones` podés marcar términos del glosario:

- `{{mediana}}` muestra la palabra con su definición al tocarla.
- `{{volatilidad|qué tanto sube y baja}}` muestra el texto cotidiano en modo simple y "volatilidad" en modo técnico.

Las definiciones viven en `src/data/glosario.ts`. Si usás un término que no está ahí, el build falla y te avisa que lo agregues.

## 3. Escribir la capa técnica (cuerpo del MDX)

Todo lo que va debajo del frontmatter aparece dentro de **"Para curiosos: cómo lo hice"**, que está cerrado por defecto. Ahí van el método, el código y los gráficos extra.

Componentes disponibles sin importar nada:

| Componente | Uso |
|---|---|
| `<Termino t="mediana" />` | Palabra técnica con definición |
| `<Termino t="volatilidad">qué tanto se mueve</Termino>` | Texto cotidiano en modo simple |
| `<Grafico slug="x" archivo="y" />` | Elige línea o barras según el JSON |
| `<GraficoLinea …/>` · `<GraficoBarras …/>` | Si querés uno explícito |
| `<Anotacion titulo="…">texto</Anotacion>` | Nota al margen |
| `<Fuente nombre="…" url="…" />` | Línea de fuente |

Para el código usá bloques con lenguaje (` ```sql `, ` ```python `). Se resaltan solos, en claro y en oscuro.

Consola SQL en el navegador (fase futura): importá la isla y pasale un CSV o Parquet público que permita CORS, por ejemplo uno en R2.

```mdx
import ConsultaSQL from "@/components/islas/ConsultaSQL"

<ConsultaSQL client:visible archivo="https://datos-r2.example/tipo-cambio.parquet" tabla="tipo_cambio" />
```

DuckDB (~7 MB) se descarga solo cuando el visitante hace clic en "Abrir consola SQL".

## 4. Probar

```bash
pnpm dev                                  # los borradores se ven en dev
MOSTRAR_BORRADORES=true pnpm build        # build local con borradores (no lo uses en Cloudflare)
pnpm build                                # build real: los borradores NO aparecen
```

Si el texto simple pasa de unas 200 palabras, el build avisa con `[legibilidad]`.

## 5. Checklist de legibilidad antes de publicar

Leelo en el teléfono, en modo **Explicación simple**:

- [ ] La **pregunta** suena como la diría tu mamá o tu vecino, no un informe.
- [ ] La **respuesta corta** se entiende sola, sin ver nada más, en 10 segundos.
- [ ] Ninguna oración de las capas simples pasa de **20 palabras**. El build lo valida en cifras y viñetas; revisá a mano lo demás.
- [ ] Cada palabra técnica inevitable usa `{{término}}` o `<Termino>`.
- [ ] Cada **cifra** tiene su "¿qué significa?" en palabras simples.
- [ ] El **título del gráfico es la conclusión**, no la descripción de los ejes.
- [ ] El gráfico tiene **un solo color destacado** y anotaciones directas, sin leyenda.
- [ ] El `resumen` del JSON describe el gráfico para alguien que no lo ve.
- [ ] "¿Por qué te importa?" dice qué cambia para una persona común.
- [ ] La confianza está explicada en una frase honesta.
- [ ] Antes de "Para curiosos" se lee en **menos de 1 minuto** (~200 palabras).
- [ ] Ningún JSON tiene `"ficticio": true`.
- [ ] Revisaste la imagen para LinkedIn en `/casos/<slug>/og.png`.
- [ ] Cambiaste `estado` a `"publicado"`.

## 6. Publicar

1. Hacé commit y push a `main`. Cloudflare reconstruye solo (ver [DESPLIEGUE.md](./DESPLIEGUE.md)).
2. Compartí `https://datos.brandoncarrillo.dev/casos/<slug>/` en LinkedIn. La imagen OG ya trae la pregunta y la respuesta.
3. Cuando tengas el link del post, agregalo en `postLinkedIn` y volvé a publicar.
