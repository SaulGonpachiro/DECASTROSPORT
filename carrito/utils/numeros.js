/**
 * ============================================================================
 *  utils/numeros.js — Utilidades numéricas y de formato
 * ============================================================================
 *
 *  ¿QUÉ ES LA CAPA utils/ Y CUÁNDO SE JUSTIFICA?
 *  ---------------------------------------------
 *  Son funciones pequeñas, GENÉRICAS y SIN ESTADO: servirían igual en una
 *  tienda, en un banco o en un juego. Para que sigan siendo "utils" cumplen
 *  tres reglas:
 *
 *    1. NO importan nada de modelo/, vista/ ni controlador/. Las demás capas
 *       dependen de utils, nunca al revés. Así no pueden aparecer ciclos de
 *       importación (A importa B, B importa A), que dan errores muy confusos.
 *    2. Reciben TODO por parámetros. Ninguna lee CONFIG ni variables globales
 *       de la aplicación; quien las usa les pasa los valores concretos.
 *    3. Son FUNCIONES, no clases: son transformaciones sin estado propio
 *       (regla de decisión del apartado 3.4 de la sesión).
 *
 *  Si una función necesita saber qué es un Producto o un Usuario, ya NO es un
 *  util: pertenece al modelo.
 */

/**
 * Redondea a 2 decimales.
 *
 * Los números de JavaScript son binarios en coma flotante: 0.1 + 0.2 da
 * 0.30000000000000004. Number.EPSILON compensa ese error diminuto antes de
 * redondear.
 *
 * NOTA PROFESIONAL: en sistemas de pago reales NO se guarda dinero como
 * decimal; se guardan CÉNTIMOS como enteros (2000 en lugar de 20.00). Aquí
 * lo simplificamos para centrarnos en POO.
 */
export const redondear = (importe) => Math.round((importe + Number.EPSILON) * 100) / 100;

/**
 * FACTORÍA de formateadores de moneda: recibe el idioma y la moneda y
 * DEVUELVE una función ya configurada.
 *
 *   const eur = crearFormateadorMoneda("es-ES", "EUR");
 *   eur(24.2);   // "24,20 €"
 *
 * Dos ideas importantes:
 *   · CLOSURE: la función devuelta "recuerda" la variable `formateador` aunque
 *     crearFormateadorMoneda ya haya terminado de ejecutarse.
 *   · EFICIENCIA: construir un Intl.NumberFormat es relativamente caro; se
 *     hace UNA vez aquí y se reutiliza en cada llamada posterior.
 *
 * Fijaos en que NO usa CONFIG: locale y moneda llegan por parámetro (regla 2).
 * Es el modelo quien decide con qué valores configurarla.
 */
export function crearFormateadorMoneda(locale, moneda) {
  const formateador = new Intl.NumberFormat(locale, { style: "currency", currency: moneda });
  return (importe) => formateador.format(importe);
}
