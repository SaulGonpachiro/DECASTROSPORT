/**
 * ============================================================================
 *  utils/dom.js — Utilidades genéricas para trabajar con el DOM
 * ============================================================================
 *  No conocen la tienda: solo saben buscar y crear elementos HTML. Las usa la
 *  vista, y podría usarlas cualquier otra página.
 */

/**
 * Atajo para querySelector que FALLA RÁPIDO.
 *
 * querySelector devuelve `null` si el selector no existe, y el error aparece
 * más tarde y lejos del origen ("Cannot read properties of null"). Aquí, en
 * cambio, si el id está mal escrito en el HTML el error llega al ARRANCAR y
 * dice exactamente qué falta. (Principio "fail fast".)
 *
 * `raiz = document` es un parámetro por defecto: normalmente se busca en todo
 * el documento, pero se puede acotar la búsqueda a un contenedor.
 */
export function $(selector, raiz = document) {
  const nodo = raiz.querySelector(selector);
  if (nodo === null) {
    throw new Error(`No se encontró «${selector}» en el HTML.`);
  }
  return nodo;
}

/**
 * Crea un elemento del DOM de forma SEGURA.
 *
 * ⚠ SEGURIDAD: usamos `textContent` y NUNCA `innerHTML` para pintar datos que
 * vienen de fuera (la API). Si un producto se llamara
 * "<img src=x onerror=robarSesion()>", con innerHTML el navegador lo
 * EJECUTARÍA (ataque XSS); con textContent se muestra como texto inofensivo.
 *
 * Uso:  el("li", { clase: "producto" }, el("p", { texto: "Hola" }), botón)
 *   · 1.er parámetro: la etiqueta.
 *   · 2.º: opciones { texto, clase, atributos } (todas opcionales).
 *   · resto (...hijos): nodos que se añaden dentro, en orden.
 */
export function el(etiqueta, { texto = "", clase = "", atributos = {} } = {}, ...hijos) {
  const nodo = document.createElement(etiqueta);
  if (clase) nodo.className = clase;
  nodo.textContent = texto;
  for (const [nombre, valor] of Object.entries(atributos)) nodo.setAttribute(nombre, valor);
  nodo.append(...hijos);
  return nodo;
}
