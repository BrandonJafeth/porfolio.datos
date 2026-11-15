/**
 * Glosario de términos técnicos inevitables.
 * Cada definición: una oración corta, sin jerga, de 20 palabras o menos.
 * Se usa con <Termino t="mediana" /> en MDX o con {{mediana|el valor del medio}} en el frontmatter.
 */
export const GLOSARIO = {
  mediana: "El valor del medio: la mitad de los datos queda por debajo y la otra mitad por encima.",
  promedio: "La suma de todos los valores dividida entre cuántos son.",
  volatilidad: "Qué tanto sube y baja un valor en poco tiempo. Más volatilidad, más sorpresas.",
  estacionalidad: "Un patrón que se repite en la misma época de cada año.",
  "tipo de cambio": "Cuántos colones hay que pagar por un dólar.",
  "variación interanual": "Cuánto cambió un valor comparado con el mismo mes del año anterior.",
  "desviación estándar": "Una medida de qué tan lejos suelen estar los datos de su promedio.",
  percentil: "La posición de un valor: el percentil 90 supera al 90 % de los casos.",
  correlación: "Dos cosas que tienden a moverse juntas. No prueba que una cause la otra.",
  inflación: "Cuánto suben los precios en general. Con inflación, el mismo dinero compra menos.",
  ETL: "Extraer datos de su fuente, limpiarlos y cargarlos donde se van a analizar.",
  muestra: "La parte de los datos que se analiza para sacar conclusiones del total.",
  "serie de tiempo": "Datos medidos uno tras otro en el tiempo, por ejemplo cada mes.",
} as const satisfies Record<string, string>

export type TerminoGlosario = keyof typeof GLOSARIO

export const definicion = (t: string): string | undefined =>
  (GLOSARIO as Record<string, string>)[t] ??
  (GLOSARIO as Record<string, string>)[t.toLowerCase()]
