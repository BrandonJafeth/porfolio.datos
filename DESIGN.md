# DESIGN — "Boleta"

Todo dato público empieza como un formulario: una boleta censal, una encuesta, un expediente.
El sitio es esa boleta ya llenada. La estructura está impresa en **tinta de formulario** (salmón)
y cada respuesta está escrita en **azul de bolígrafo**. La pregunta es un ítem del formulario;
la respuesta es lo único "escrito a mano".

## Reglas del mundo
1. **Un solo color de respuesta.** `--pluma` marca respuestas, cifras y la opción elegida. Nada más compite con él.
2. **La estructura es tinta de formulario.** Campos, líneas y etiquetas usan `--forma*`; nada de grises de relleno ni sombras decorativas.
3. **Cajas solo donde hay un dato que llenar** (respuesta, cifras, gráfico, filtros). Las listas usan reglas horizontales; esquinas rectas, sin píldoras.
4. **Las etiquetas nombran campos**, en minúscula normal (`.etiqueta`): nunca versalitas ni "eyebrows" decorativos.
5. **Números protagonistas** en Archivo tabular (cero sin cruzar). Dígitos sueltos van en `.casillas`.

## Tokens (src/styles/global.css)

| Rol | Claro | Oscuro | Contraste (sobre papel) |
|---|---|---|---|
| `--papel` fondo | #FCFCFA | #111317 | — |
| `--tinta` texto | #14161A | #ECEEF1 | 17,6 / 16,0 |
| `--tinta-3` texto terciario | #5D626A | #9DA1A9 | 6,0 / 7,2 |
| `--forma` líneas decorativas | #EBA591 | #5B3429 | 2,0 / 1,7 (solo decoración) |
| `--forma-fuerte` bordes de controles | #C0614A | #B5705C | 4,1 / 4,8 (≥ 3:1 UI) |
| `--forma-t` etiquetas (texto) | #A3412A | #F2AB94 | 6,1 / 9,8 (AA) |
| `--forma-f` relleno de campo | #FCECE6 | #1E1714 | etiquetas encima: 5,5 / 9,3 |
| `--pluma` respuesta | #1C3FC4 | #93A9FF | 8,0 / 8,3 |

Gráficos: serie destacada `--chart-accent` (pluma), resto `--chart-muted`, rejilla `--chart-grid` (salmón pálido).
Categórica para futuras series: pluma, `--chart-2` naranja, `--chart-3` grafito, `--chart-4` magenta.

## Tipografía
- **Títulos:** Archivo Variable, ancho 112–125 % (`font-stretch`), peso 760–820.
- **Cuerpo:** Public Sans Variable, 18 px (19 px ≥ 768 px), interlineado 1,6, medida ≤ 65ch.
- **Cifras:** `.num` → Archivo tabular.
- **₡:** ni Archivo ni Public Sans lo traen; "Colon CR" (Noto Sans, `unicode-range: U+20A1`) lo dibuja igual en todos los sistemas.

## Componentes clave
- **Hero (minimalista, sin foto ni cajas):** nombre pequeño, rol (H1), la promesa en pluma escrita sobre **renglones** de tinta de formulario, herramientas, LinkedIn + Escribime + enlaces de texto, y la ruta en una línea.
- **Logo:** solo "Brandon Carrillo" en Archivo, con una casilla marcada en pluma (la misma del favicon).
- **Caso:** P{n} + pregunta; campo Respuesta con relleno; cifras como campos; gráfico dentro de un campo con la fuente "cosida" en el pie; confianza como pregunta de opción única.
- **Interruptor de lectura y filtros:** opciones con casillas cuadradas; la elegida se marca en pluma.

## Movimiento
Un solo momento: la respuesta "se escribe" (clip-path de izquierda a derecha, 820 ms) en el hero y en cada caso.
View transitions nativas entre páginas. Todo se apaga con `prefers-reduced-motion`.
