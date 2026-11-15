// @ts-check
import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import preact from "@astrojs/preact"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: "https://datos.brandoncarrillo.dev",
  output: "static",
  // Astro 7 cambió el default a "jsx" (borra espacios entre elementos en línea).
  compressHTML: true,
  trailingSlash: "ignore",
  // Hoy solo es-CR, sin prefijo. Para otro idioma: agregarlo a locales y a src/i18n/.
  i18n: {
    defaultLocale: "es-CR",
    locales: ["es-CR"],
    routing: { prefixDefaultLocale: false },
  },
  // CSS en línea: evita una petición bloqueante (mejor LCP en móvil; las visitas llegan sueltas desde LinkedIn).
  build: { inlineStylesheets: "always" },
  integrations: [
    mdx(),
    preact(),
    sitemap({
      filter: (page) => !page.includes("/og.png"),
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      defaultColor: false,
      wrap: true,
    },
  },
  image: {
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
