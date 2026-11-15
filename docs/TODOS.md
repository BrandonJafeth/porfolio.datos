# Datos pendientes (TODO)

Buscá `TODO_` en el repo para encontrarlos. Mientras falten, los botones y enlaces correspondientes **no se muestran en producción**. En `pnpm dev` aparecen como avisos punteados.

| Placeholder | Dónde | Qué poner |
|---|---|---|
| `TODO_CV_URL` | `src/data/perfil.ts` → `enlaces.cv` | URL o ruta del CV. Ej.: `/cv-brandon-carrillo.pdf` en `public/` |
| `TODO_EMAIL` | `src/data/perfil.ts` → `enlaces.email` | Correo de contacto público |
| `TODO_FOTO` | `src/assets/foto.jpg` (o .png/.webp) | Tu foto, vertical 4:5, ≥ 544×680 px. Se detecta sola; mientras tanto se muestran tus iniciales |
| `TODO_FECHAS` | `src/data/perfil.ts` → `EXPERIENCIA` | Periodos de la pasantía en CRCCODING y de One Out Solutions |
| `TODO_DETALLE_TUTORIA` | `src/data/perfil.ts` | Qué cursos acompañabas como tutor (opcional) |
| `TODO_GITHUB_USUARIO` | caso de ejemplo (borrador) | Solo afecta al ejemplo ficticio. Podés borrar ese caso cuando publiques el primero real |

Pendientes de revisar por vos:
- Resumen de cada experiencia (una línea) en `EXPERIENCIA`.
- `semanasCompletadas` en `src/data/ruta.json`: marcalas a mano cada semana.
- Links de verificación de Claude Code 101 y Scrum Fundamentals Certified, cuando los tengas (`verificar` en `CERTIFICACIONES`).
