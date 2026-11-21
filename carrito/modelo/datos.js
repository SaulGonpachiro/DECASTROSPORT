/**
 * datos.js — Respuesta SIMULADA de una API de catálogo.
 *
 * Es un array en memoria, no una llamada fetch real (eso llegará en los
 * Temas 4+5). Los campos vienen en INGLÉS (sku, name, price, stock, discount)
 * y el modelo los traduce a español en crearProducto().
 *
 * Los datos están preparados para que haya de todo, como en la vida real:
 * 4 registros válidos y 6 que deben ser RECHAZADOS cada uno por un motivo
 * distinto. Antes de ejecutar, ¡predecid cuáles caen y por qué!
 */
export const DATOS_API = [
  // 0 · Válido: producto normal
  { sku: "BAL-0001", name: "Balón de fútbol", price: 20, stock: 5 },

  // 1 · Válido: rebajado (-20 %) y SIN stock (saldrá con el botón desactivado)
  { sku: "CAM-0002", name: "Camiseta oficial", price: 35, stock: 0, discount: 0.2 },

  // 2 · Válido: stock bajo (2 unidades) → ideal para probar el límite de stock
  { sku: "RAQ-0003", name: "Raqueta de pádel", price: 80, stock: 2 },

  // 3 · Válido: rebajado (-15 %)
  { sku: "ZAP-0004", name: "Zapatillas running", price: 100, stock: 3, discount: 0.15 },

  // 4 · RECHAZADO: sku con formato incorrecto (minúsculas y sin ceros)
  { sku: "bal-1", name: "Balón de playa", price: 10, stock: 1 },

  // 5 · RECHAZADO: precio negativo
  { sku: "GOR-0005", name: "Gorra", price: -5, stock: 10 },

  // 6 · RECHAZADO: precio como TEXTO (la API se equivoca de tipo; no lo convertimos en silencio)
  { sku: "MOC-0006", name: "Mochila", price: "29.99", stock: 4 },

  // 7 · RECHAZADO: sku duplicado (BAL-0001 ya entró en la posición 0)
  { sku: "BAL-0001", name: "Balón (duplicado)", price: 22, stock: 3 },

  // 8 · RECHAZADO: descuento imposible (150 %)
  { sku: "CAL-0007", name: "Calcetines", price: 8, stock: 20, discount: 1.5 },

  // 9 · RECHAZADO: ni siquiera es un objeto
  null,
];
