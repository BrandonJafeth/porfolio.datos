# Despliegue en Cloudflare

El sitio es **100 % estático** (`astro build` → `dist/`) y se publica con **Cloudflare Workers con static assets**. Es la opción que Cloudflare y Astro recomiendan hoy para proyectos nuevos, en lugar de Pages. No hace falta el adaptador `@astrojs/cloudflare`, porque no hay renderizado en el servidor.

Revisado en noviembre de 2026 contra estas fuentes:
- https://docs.astro.build/en/guides/deploy/cloudflare/
- https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/
- https://developers.cloudflare.com/workers/static-assets/
- https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
- https://developers.cloudflare.com/workers/ci-cd/builds/deploy-hooks/

Todo lo que necesita Cloudflare ya está en el repo:

| Archivo | Para qué |
|---|---|
| `wrangler.jsonc` | Nombre del Worker, carpeta `dist`, página 404 y dominio `datos.brandoncarrillo.dev` |
| `public/_headers` | Caché larga para `/_astro/*` y cabeceras de seguridad básicas |
| `.nvmrc` | Node 24.12.0 (Astro 7.4 pide **22.23.4 o superior**) |
| `package.json` → `packageManager` | pnpm 11.1.2 |
| `pnpm-workspace.yaml` | Permite los scripts de `esbuild`, `workerd` y `sharp` (pnpm 10 y 11) |

> **Error "Node.js v22.12.0 is not supported by Astro"**: la versión anterior del `.nvmrc` decía 22.12.0. Ya está en 24.12.0. Si tu proyecto de Cloudflare tiene una variable `NODE_VERSION` vieja, cambiala a `24.12.0` o borrala.

---

## 0. Si ya creaste el proyecto en **Cloudflare Pages**

Pages sigue funcionando para sitios estáticos. Configuración exacta:

1. **Settings → Build → Build configuration**
   - **Framework preset:** Astro
   - **Build command:** `pnpm build`
   - **Build output directory:** `dist`
   - **Root directory:** vacío
2. **Settings → Variables and secrets** (entorno *Production* y *Preview*):
   - `NODE_VERSION` = `24.12.0`
   - `PNPM_VERSION` = `11.1.2` (sin esto Pages usa pnpm 10 y avisa "Ignored build scripts")
3. **Retry deployment** en el último despliegue fallido.
4. Dominio: **Custom domains → Set up a custom domain → `datos.brandoncarrillo.dev`**.
5. Deploy hook en Pages: **Settings → Builds → Deploy hooks → Add deploy hook** (nombre y rama `main`). Se usa igual que el de Workers (POST a la URL, guardada como secreto).

El `wrangler.jsonc` es para Workers; Pages lo ignora porque no tiene `pages_build_output_dir`. Si Pages muestra un aviso sobre ese archivo, no afecta el build. Si más adelante pasás a Workers, seguí la sección 1.

---

## 1. Primer despliegue con integración Git (recomendado)

1. Subí el repo a GitHub.
2. En el dashboard de Cloudflare, andá a **Compute → Workers & Pages → Create application**.
3. En **Import a repository**, elegí tu cuenta de GitHub y este repositorio.
4. Configurá el build:
   - **Build command:** `pnpm build`
   - **Deploy command:** `npx wrangler deploy`
   - **Root directory:** `/`
   - **Variables de entorno:** ninguna. **No** agregues `MOSTRAR_BORRADORES`, porque esa variable publica los borradores.
5. Hacé clic en **Save and Deploy**.

> Workers Builds detecta pnpm por el `pnpm-lock.yaml`, que ahora sí se versiona: lo quité del `.gitignore`. Su Node por defecto cumple con Astro 7. Si un build falla por la versión de Node, agregá la variable `NODE_VERSION=24.12.0`.

### Alternativa: desplegar desde tu máquina

```bash
pnpm build
npx wrangler login       # solo la primera vez
npx wrangler deploy
```

Para probar localmente con el runtime de Cloudflare antes de desplegar:

```bash
pnpm preview:cf          # = astro build && wrangler dev
```

## 2. Dominio personalizado `datos.brandoncarrillo.dev`

`wrangler.jsonc` ya declara la ruta con `"custom_domain": true`. En el primer `wrangler deploy` (o en el primer build de Workers Builds), Cloudflare crea el registro DNS y el certificado. Para eso la zona `brandoncarrillo.dev` tiene que estar en la misma cuenta.

Antes del primer despliegue, revisá esto:

- En **DNS** de `brandoncarrillo.dev`, **no** puede existir un registro `CNAME` (ni A/AAAA) para `datos`. Si existe, borralo primero. Cloudflare no crea un Custom Domain sobre un hostname que ya tiene CNAME.
- Si preferís hacerlo a mano, andá a **Workers & Pages → datos-brandoncarrillo → Settings → Domains & Routes → Add → Custom Domain** y escribí `datos.brandoncarrillo.dev`.

Con `"workers_dev": false` y `"preview_urls": false`, el sitio solo responde en tu dominio. Si querés una URL `*.workers.dev` para pruebas, cambiá esas dos opciones a `true`.

## 3. Deploy hook: reconstruir cuando tu pipeline de Python tenga datos nuevos

El flujo previsto es este:

```
repo de análisis (Python)            este repo (sitio)
─────────────────────────            ─────────────────
GitHub Action semanal
  1. descarga datos (BCCR, INEC…)
  2. calcula y exporta JSON
  3. hace commit de los JSON  ─────►  src/data/indicadores/latest.json
                                      src/data/casos/<slug>/*.json
  4. POST al deploy hook      ─────►  Workers Builds corre `pnpm build` y despliega
```

> Si el paso 3 hace commit directo a la rama de producción, Workers Builds ya despliega con ese push y **no necesitás el hook**. El hook sirve cuando los datos llegan por otra vía, por ejemplo cuando el build los descarga desde R2, o para forzar un build programado.

### Crear el hook

1. Entrá a **Workers & Pages** y elegí el Worker `datos-brandoncarrillo`. El Worker tiene que estar conectado a Git, como en el paso 1.
2. Andá a **Settings → Builds → Deploy Hooks**.
3. Ponele nombre (`pipeline-python`), elegí la rama `main` y hacé clic en **Create**.
4. Copiá la URL. Tiene esta forma:
   `https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/<DEPLOY_HOOK_ID>`

> **La URL es la credencial**: cualquiera que la tenga puede disparar builds. Guardala como secreto y nunca la pongas en el código. Si se filtra, borrá el hook y creá otro.

### Guardarlo en GitHub

En el repo **del pipeline de Python**, andá a **Settings → Secrets and variables → Actions → New repository secret**:
- Nombre: `CF_DEPLOY_HOOK_DATOS`
- Valor: la URL del hook

### Usarlo desde el GitHub Action

```yaml
# .github/workflows/actualizar-datos.yml (en el repo de análisis)
name: Actualizar datos del sitio
on:
  schedule:
    - cron: "0 12 * * 1"   # lunes 12:00 UTC (6:00 en Costa Rica)
  workflow_dispatch:

jobs:
  datos:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # … tus pasos de Python que generan y suben los JSON …
      - name: Reconstruir datos.brandoncarrillo.dev
        run: |
          curl --fail --silent --show-error -X POST "${{ secrets.CF_DEPLOY_HOOK_DATOS }}"
```

Cómo se comporta el hook:
- Un POST mientras ya hay un build en cola o iniciando devuelve el build existente (`already_exists: true`). No duplica trabajo.
- Límites: 10 builds por minuto por Worker y 100 por minuto por cuenta.
- La respuesta incluye `build_uuid`. Podés ver el resultado en **Deployments** del Worker.

Si necesitás autenticación con token en vez de URL secreta, existe el endpoint de builds manuales de la API de Workers Builds, que pide un API token: https://developers.cloudflare.com/api/resources/workers_builds/subresources/triggers/methods/create_build

### Build semanal para la ruta

La semana actual de `/ruta` y del indicador del inicio se calcula **al momento del build** (el sitio es estático). Para que avance sola cada lunes, programá un build semanal con el mismo hook, por ejemplo en este repo:

```yaml
# .github/workflows/build-semanal.yml
name: Build semanal
on:
  schedule:
    - cron: "0 7 * * 1"   # lunes 7:00 UTC (1:00 en Costa Rica)
  workflow_dispatch:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: curl --fail --silent --show-error -X POST "${{ secrets.CF_DEPLOY_HOOK_DATOS }}"
```

## 4. Checklist antes de cada publicación

- [ ] `pnpm build` termina sin errores ni advertencias, `astro check` incluido.
- [ ] Ningún caso con `estado: "publicado"` usa JSON con `"ficticio": true`.
- [ ] `MOSTRAR_BORRADORES` **no** está definida en Cloudflare.
- [ ] Revisaste la imagen OG en `/casos/<slug>/og.png`.
