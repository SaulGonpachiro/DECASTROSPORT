/**
 * ============================================================================
 *  utils/consola.js — Utilidades para la consola del navegador
 * ============================================================================
 */

/**
 * Ejecuta una acción que PUEDE fallar y cuenta en consola qué pasó. Evita
 * escribir un try/catch por cada experimento de la demostración.
 *
 *   intentar("balon.precio = -5", () => (balon.precio = -5));
 *   //   ✖ balon.precio = -5 → ErrorValidacion: «precio» debe ser ...
 *
 * Es genérica: no sabe qué hace la acción ni qué tipo de error puede lanzar.
 */
export function intentar(descripcion, accion) {
  try {
    accion();
    console.log(`  ✔ ${descripcion} → no lanzó ningún error`);
  } catch (error) {
    console.log(`  ✖ ${descripcion} → ${error.name}: ${error.message}`);
  }
}
