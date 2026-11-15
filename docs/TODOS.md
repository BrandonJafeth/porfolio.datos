# Datos pendientes (TODO)

Buscá `TODO_` en el repo para encontrarlos. Mientras falten, los botones y enlaces correspondientes **no se muestran en producción**. En `pnpm dev` aparecen como avisos punteados.

| Placeholder | Dónde | Qué poner |
|---|---|---|
| `TODO_CV_URL` | `src/data/perfil.ts` → `enlaces.cv` | URL o ruta del CV. Ej.: `/cv-brandon-carrillo.pdf` en `public/` |
| `TODO_FECHAS` | `src/data/perfil.ts` → `EXPERIENCIA` | Periodos de la pasantía en CRCCODING y de One Out Solutions (mientras tanto el campo queda vacío) |
| `TODO_DETALLE_TUTORIA` | `src/data/perfil.ts` | Qué cursos acompañabas como tutor (opcional) |
| `TODO_GITHUB_USUARIO` | caso de ejemplo (borrador) | Solo afecta al ejemplo ficticio. Podés borrar ese caso cuando publiques el primero real |

Ya resueltos: LinkedIn, GitHub, email (`brandoncarrilloworks@gmail.com`), foto (`src/assets/foto.avif`) y los 5 links de verificación de certificaciones.

Pendientes de revisar por vos:
- Resumen de cada experiencia (una línea) en `EXPERIENCIA`.
- `semanasCompletadas` en `src/data/ruta.json`: marcalas a mano cada semana.
- La carpeta `assets/` de la raíz (tu foto original) ya no se usa: el sitio lee `src/assets/foto.avif`. Podés borrarla.
