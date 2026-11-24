/** MODELO · ALUMNADO · SOLO EDITAR ESTE ARCHIVO
 * Trabaja los TODO en orden. NO borres los export ni cambies los nombres.
 * Cuando una prueba falle, lee qué esperaba antes de pedir ayuda.
 */
import { crearFormateadorMoneda, redondear } from "../utils/numeros.js";

// PASO 1 · Configuración y validaciones
export const CONFIG = Object.freeze({ iva: 0.21, descuentoMaximo: 0.9, locale: "es-ES", moneda: "EUR" });
export const formatearMoneda = crearFormateadorMoneda(CONFIG.locale, CONFIG.moneda);
const PATRON_SKU = /^[A-Z]{3}-\d{4}$/;
export class ErrorValidacion extends Error {
  constructor(campo, mensaje) {
    super(mensaje);
    this.name = "ErrorValidacion";
    this.campo = campo;
  }
}

function exigirTexto(campo, valor, longitudMinima = 2) {
    // TODO 1A: si no es string o tiene pocos caracteres tras trim(), lanzar ErrorValidacion(campo, mensaje).
  if (typeof valor !== "string" || valor.trim().length < longitudMinima) {
    throw new ErrorValidacion(campo, `«${campo}» debe tener al menos ${longitudMinima} letras.`);
  }
}
function exigirNumeroNoNegativo(campo, valor) {
    // TODO 1B: typeof number, Number.isFinite(valor) y valor >= 0.
  if (typeof valor !== "number" || !Number.isFinite(valor) || valor < 0) {
    throw new ErrorValidacion(campo, `«${campo}» debe ser un número mayor o igual que 0.`);
  }
}


function exigirEnteroPositivo(campo, valor) {
    // TODO 1C: Number.isInteger(valor) y valor > 0.
  if (!Number.isInteger(valor) || valor <= 0) {
    throw new ErrorValidacion(campo, `«${campo}» debe ser un número entero mayor que 0.`);
  }
}
function exigirEnteroNoNegativo(campo, valor) {
    // TODO 1D: Number.isInteger(valor) y valor >= 0.
  if (!Number.isInteger(valor) || valor < 0) {
    throw new ErrorValidacion(campo, `«${campo}» debe ser un número entero mayor o igual que 0.`);
  }
}



// PASO 2 · Producto
export class Producto {
  #sku; #nombre; #precio; #stock;
  constructor({ sku, nombre, precio, stock = 0 }) {
    // TODO 2A: comprobar PATRON_SKU.test(sku) y guardar #sku.
    // TODO 2B: asignar this.nombre y this.precio para pasar por los setters.
    // TODO 2C: validar stock y guardar #stock.
    if (typeof sku !== "string" || !PATRON_SKU.test(sku)) {
      throw new ErrorValidacion("sku", `«sku» debe tener el formato AAA-0000.`);
    }
    exigirEnteroNoNegativo("stock", stock);
    this.#sku = sku;
    this.nombre = nombre;
    this.precio = precio;
    this.#stock = stock;
  }
  get sku() { return this.#sku; }
  get nombre() { return this.#nombre; }
  set nombre(valor) {
    // TODO 2D: validar con exigirTexto y guardar valor.trim().
    exigirTexto("nombre", valor);
    this.#nombre = valor.trim();
  }
  get precio() { return this.#precio; }
  set precio(valor) {
    // TODO 2E: validar ANTES de guardar.
    exigirNumeroNoNegativo("precio", valor);
    this.#precio = valor;
  }
  get stock() { return this.#stock; }
  hayStock(cantidad = 1) {
    // TODO 2F: devolver booleano comparando cantidad y #stock.
    return cantidad <= this.#stock;
  }
  reponer(cantidad) {
    // TODO 2G: validar entero positivo y aumentar #stock.
    exigirEnteroPositivo("cantidad", cantidad);
    this.#stock += cantidad;
  }
  retirar(cantidad) {
    // TODO 2H: validar; si no hay stock, ErrorValidacion('stock', mensaje); si hay, restar.
    exigirEnteroPositivo("cantidad", cantidad);
    if (!this.hayStock(cantidad)) {
      throw new ErrorValidacion("stock", `«stock» insuficiente: quedan ${this.#stock} uds.`);
    }
    this.#stock -= cantidad;
  }
  precioConIVA() {
    // TODO 2I: redondear(precio * (1 + CONFIG.iva)).
    return redondear(this.#precio * (1 + CONFIG.iva));
  }
  resumen() {
    // TODO 2J: devolver texto con nombre, sku y formatearMoneda(this.precioConIVA()).
    return `${this.#nombre} (${this.#sku}) · ${formatearMoneda(this.precioConIVA())}`;
  }
  toJSON() {
    // TODO 2K: devolver objeto literal con sku, nombre, precio y stock.
    return { sku: this.#sku, nombre: this.#nombre, precio: this.#precio, stock: this.#stock };

  }
}

// PASO 3 · Herencia
export class ProductoRebajado extends Producto {
  #descuento;
  constructor(datos) {
    super(datos);
    // TODO 3A: validar descuento > 0 y <= CONFIG.descuentoMaximo, finito; guardar #descuento.
    const descuento = datos.descuento;
    if (typeof descuento !== "number" || !Number.isFinite(descuento) || descuento <= 0 || descuento > CONFIG.descuentoMaximo) {
      throw new ErrorValidacion("descuento", "Descuento no válido");
    }
    this.#descuento = descuento;
  }
  get descuento() { return this.#descuento; }
  precioConIVA() {
    // TODO 3B: redondear(super.precioConIVA() * (1 - this.#descuento)).
    return redondear(super.precioConIVA() * (1 - this.#descuento));

  }
  resumen() {
    // TODO 3C: ampliar super.resumen() con [-15 %] (según descuento).
    return `${super.resumen()} [-${this.#descuento * 100} %]`;
  }
  toJSON() {
    // TODO 3D: devolver {...super.toJSON(), descuento: this.#descuento}.
    return { ...super.toJSON(), descuento: this.#descuento };
  }
}

// PASO 4 · Carrito
export class Carrito {
  #lineas = [];
  #buscarLinea(sku) {
    // TODO 4A: find sobre #lineas, comparando producto.sku.
    return this.#lineas.find((linea) => linea.producto.sku === sku);
  }
  agregar(producto, cantidad = 1) {
    // TODO 4B: validar instanceof Producto y cantidad positiva.
if (!(producto instanceof Producto)) {
      throw new ErrorValidacion("producto", `«producto» debe ser un Producto del catálogo.`);
    }    
    exigirEnteroPositivo("cantidad", cantidad);
    // TODO 4C: sumar cantidad existente, comprobar stock TOTAL, actualizar o push.
    const linea = this.#buscarLinea(producto.sku);
    const yaEnCarrito = linea ? linea.cantidad : 0;
    const totalPedido = yaEnCarrito + cantidad;

    if (!producto.hayStock(totalPedido)) {
      throw new ErrorValidacion("stock", `«stock» insuficiente: quedan ${producto.stock} uds.`);
    }

    if (linea) {
      linea.cantidad = totalPedido;
    } else {
      this.#lineas.push({ producto, cantidad });
    }
  
  }
  quitar(sku) {
    // TODO 4D: findIndex y splice; si no existe, ErrorValidacion('sku', mensaje).
  }
  vaciar() {
    // TODO 4E: dejar #lineas vacío.
  }
  get lineas() {
    // TODO 4F: copia del array Y de cada registro {producto, cantidad}.
    return [];
  }
  get unidades() {
    // TODO 4G: reduce sumando cantidades.
    return 0;
  }
  get total() {
    // TODO 4H: reduce con producto.precioConIVA() * cantidad y redondear.
    return 0;
  }
  resumen() {
    // TODO 4I: si vacío '(carrito vacío)'; si no, líneas y TOTAL.
    return '(carrito vacío)';
  }
  confirmarCompra() {
    // TODO 4J: si vacío, error; PASADA 1 comprobar todas las líneas.
    // TODO 4K: guardar {unidades,total}; PASADA 2 retirar; vaciar y devolver resumen.
  }
}

// PASO 5 · Datos API
export function crearProducto(registroApi) {
  // TODO 5A: validar que sea objeto no null.
  // TODO 5B: mapear name->nombre, price->precio, discount->descuento.
  // TODO 5C: devolver Producto o ProductoRebajado según exista discount.
}
export function construirCatalogo(registrosApi) {
  const validos = [];
  const rechazados = [];
  const skusVistos = new Set();
  // TODO 5D: recorrer con forEach((registro, indice) => {...}).
  // TODO 5E: try/catch DENTRO; crearProducto, detectar duplicados, guardar válido.
  // TODO 5F: si ErrorValidacion, push {indice, sku, motivo}; si otro error, throw error.
  return { validos, rechazados };
}
