/**
 * Datos personales del sitio.
 * Los valores que empiezan con TODO_ son placeholders: reemplazalos (ver docs/TODOS.md).
 */
export const SITIO = {
  url: "https://datos.brandoncarrillo.dev",
  nombre: "Brandon Carrillo · Datos",
  /** <title> del inicio. */
  tituloInicio: "Brandon Carrillo · Analista de datos en Costa Rica | SQL, Python, Power BI",
  /** Meta description del inicio (≤ 155 caracteres). */
  descripcion:
    "Analista de datos en Costa Rica. Convierto datos en respuestas que cualquiera entiende, con SQL, Python y Power BI: economía, empleo, negocios y más.",
  locale: "es_CR",
} as const

export const PERFIL = {
  nombre: "Brandon Carrillo Álvarez",
  nombreCorto: "Brandon Carrillo",
  rol: "Analista de datos · Full Stack Developer",
  /** Cargo para SEO / JSON-LD. */
  cargo: "Analista de datos",
  lugar: "Nicoya, Guanacaste, Costa Rica",
  ciudad: "Nicoya",
  provincia: "Guanacaste",
  stack: ["Astro", "React", "NestJS", "Python", "SQL"],
  enlaces: {
    linkedin: "https://www.linkedin.com/in/brandonca/",
    github: "https://github.com/BrandonJafeth",
    cv: "TODO_CV_URL",
    email: "TODO_EMAIL",
    certificacionesLinkedIn: "https://www.linkedin.com/in/brandonca/details/certifications/",
  },
  /** TODO_FOTO: colocá tu foto en src/assets/foto.jpg (o .png/.webp) y se usa sola. */
} as const

/** true si el valor sigue siendo un placeholder. */
export const esPendiente = (v: string) => v.startsWith("TODO_")

export type Experiencia = {
  rol: string
  organizacion: string
  periodo: string
  resumen: string
  etiquetas: string[]
}

export const EXPERIENCIA: Experiencia[] = [
  {
    rol: "Tutor Académico",
    organizacion: "Universidad Nacional (UNA)",
    periodo: "feb 2022 – may 2026",
    // TODO_DETALLE_TUTORIA: agregá qué cursos acompañabas.
    resumen: "Tutorías a estudiantes universitarios. Explicar simple es mi práctica diaria.",
    etiquetas: ["Docencia"],
  },
  {
    rol: "Cofundador",
    organizacion: "One Out Solutions",
    periodo: "TODO_FECHAS",
    resumen: "Desarrollo web para PYMEs de Guanacaste: del requerimiento a producción.",
    etiquetas: ["Astro", "React", "NestJS"],
  },
  {
    rol: "Pasante de datos",
    organizacion: "CRCCODING",
    periodo: "TODO_FECHAS",
    resumen: "Consultas en Oracle SQL y un proceso ETL para mover y limpiar datos.",
    etiquetas: ["Oracle SQL", "ETL"],
  },
]

export type Credencial = {
  nombre: string
  emisor: string
  anio?: string
  estado?: "en curso"
}

export const EDUCACION: Credencial[] = [
  {
    nombre: "Bachillerato en Ingeniería en Sistemas de Información",
    emisor: "Universidad Nacional (UNA)",
    anio: "2026",
  },
  {
    nombre: "Licenciatura en Ingeniería en Sistemas de Información",
    emisor: "Universidad Nacional (UNA)",
    estado: "en curso",
  },
]

/** Logo del emisor: clave de src/components/LogoEmisor.astro */
export type LogoEmisor = "cisco" | "anthropic" | "scrumstudy"

export type Certificacion = {
  nombre: string
  emisor: string
  /** Contexto opcional del emisor (programa, alianza). */
  emisorDetalle?: string
  logo: LogoEmisor
  anio?: string
  /** Datos extra cortos: horas, nota. */
  detalle?: string[]
  /** Link de verificación pública. Sin link: se muestra solo el texto. */
  verificar?: string
}

/**
 * Ordenadas de más a menos relevante para datos.
 * Nunca publiques imágenes de los certificados (algunos muestran la cédula): solo nombre, emisor y link.
 */
export const CERTIFICACIONES: Certificacion[] = [
  {
    nombre: "Data Analytics Essentials",
    emisor: "Cisco Networking Academy",
    emisorDetalle: "Programa de Centros Comunitarios Inteligentes del MICITT",
    logo: "cisco",
    anio: "2026",
    detalle: ["40 horas", "Nota 95"],
    verificar: "https://www.credly.com/badges/232be9fc-33af-46f0-b0df-c53466c9636c",
  },
  {
    nombre: "Introduction to Data Science",
    emisor: "Cisco Networking Academy",
    logo: "cisco",
    anio: "2026",
    verificar: "https://www.credly.com/badges/e72a0179-f24e-4f50-8789-c510fd3e27f5",
  },
  {
    nombre: "Claude Code in Action",
    emisor: "Anthropic",
    logo: "anthropic",
    anio: "2026",
    verificar: "https://verify.skilljar.com/c/qixkqnqjegc9",
  },
  { nombre: "Claude Code 101", emisor: "Anthropic", logo: "anthropic", anio: "2026" },
  { nombre: "Scrum Fundamentals Certified (SFC)", emisor: "SCRUMstudy", logo: "scrumstudy" },
]

/** Links de verificación públicos (también van en JSON-LD sameAs). */
export const LINKS_CREDENCIALES = CERTIFICACIONES.flatMap((c) =>
  c.verificar?.includes("credly.com") ? [c.verificar] : [],
)

/** Flujo de trabajo, en el orden real. */
export const FLUJO = [
  { paso: "Aprendizaje", detalle: "Estudio la técnica" },
  { paso: "Backlog", detalle: "Elijo una pregunta real" },
  { paso: "Obtención de datos", detalle: "Fuentes oficiales" },
  { paso: "Proyecto", detalle: "SQL y Python" },
  { paso: "Resultado", detalle: "Una respuesta clara" },
  { paso: "Publicación", detalle: "Sitio y LinkedIn" },
] as const
