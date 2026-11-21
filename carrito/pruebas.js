/**
 * pruebas.js — Pruebas automáticas del modelo.
 *
 * Ejecutar (Node 18 o superior):   npm test      (o:  node --test)
 *
 * En la sesión se usaba console.assert, que solo AVISA si algo falla. Un
 * "test runner" como node:test hace lo mismo pero mejor: da nombre a cada
 * caso, ejecuta TODOS aunque alguno falle y muestra un informe final. Es la
 * misma forma de trabajar de Jasmine/Jest/Vitest, que usaréis con Angular.
 *
 * PATRÓN "Arrange – Act – Assert" (preparar, actuar, comprobar):
 *   const p = new Producto({...});        // ARRANGE: preparo el escenario
 *   const precio = p.precioConIVA();      // ACT:     ejecuto lo que pruebo
 *   assert.equal(precio, 24.2);           // ASSERT:  compruebo el resultado
 *
 * Seguimos la ruta de resolución de la sesión: caso válido, caso inválido
 * y comprobación de que, tras un rechazo, el estado anterior se conserva.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  CONFIG,
  Carrito,
  ErrorValidacion,
  Producto,
  ProductoRebajado,
  construirCatalogo,
  crearProducto,
} from "./modelo/modelo.js";
import { DATOS_API } from "./modelo/datos.js";

// Fábricas de apoyo: evitan repetir los mismos datos en cada prueba.
const crearBalon = (extra = {}) =>
  new Producto({ sku: "BAL-0001", nombre: "Balón", precio: 20, stock: 5, ...extra });

const crearZapatillas = () =>
  new ProductoRebajado({ sku: "ZAP-0004", nombre: "Zapatillas", precio: 100, stock: 3, descuento: 0.15 });

// ----------------------------------------------------------------------------
// Producto: creación y validación
// ----------------------------------------------------------------------------

test("Producto válido: guarda los datos y calcula el precio con IVA", () => {
  const balon = crearBalon();
  assert.equal(balon.sku, "BAL-0001");
  assert.equal(balon.nombre, "Balón");
  assert.equal(balon.precioConIVA(), 24.2); // 20 × 1,21
});

test("Producto: el stock por defecto es 0", () => {
  assert.equal(new Producto({ sku: "BAL-0001", nombre: "Balón", precio: 20 }).stock, 0);
});

test("Producto: rechaza datos inválidos con ErrorValidacion y dice qué campo falló", () => {
  const casos = [
    [{ sku: "bal-1" }, "sku"],
    [{ nombre: "A" }, "nombre"],
    [{ nombre: 42 }, "nombre"],
    [{ precio: -1 }, "precio"],
    [{ precio: "20" }, "precio"], // texto: no se convierte en silencio
    [{ precio: NaN }, "precio"],
    [{ precio: Infinity }, "precio"],
    [{ stock: 1.5 }, "stock"],
    [{ stock: -1 }, "stock"],
  ];
  for (const [datosMalos, campoEsperado] of casos) {
    assert.throws(
      () => crearBalon(datosMalos),
      (error) => error instanceof ErrorValidacion && error.campo === campoEsperado,
      `debería rechazar ${JSON.stringify(datosMalos)}`
    );
  }
});

// ----------------------------------------------------------------------------
// Producto: encapsulación
// ----------------------------------------------------------------------------

test("Setter: un valor inválido se rechaza y el valor anterior se conserva", () => {
  const balon = crearBalon();
  assert.throws(() => (balon.precio = -5), ErrorValidacion);
  assert.equal(balon.precio, 20); // sigue intacto
  balon.precio = 25; // un valor válido sí se acepta
  assert.equal(balon.precio, 25);
});

test("sku y stock son de solo lectura (módulo = modo estricto → TypeError)", () => {
  const balon = crearBalon();
  assert.throws(() => (balon.sku = "OTR-9999"), TypeError);
  assert.throws(() => (balon.stock = 999), TypeError);
  assert.equal(balon.stock, 5);
});

test("Los campos privados no son propiedades visibles", () => {
  const balon = crearBalon();
  assert.deepEqual(Object.keys(balon), []); // ni #precio ni los demás aparecen
  assert.equal(balon["#precio"], undefined); // "#precio" como texto no existe
});

test("toJSON: sin él, JSON.stringify devolvería {} por los campos privados", () => {
  const json = JSON.parse(JSON.stringify(crearBalon()));
  assert.deepEqual(json, { sku: "BAL-0001", nombre: "Balón", precio: 20, stock: 5 });
});

test("retirar y reponer: modifican el stock solo con reglas", () => {
  const balon = crearBalon();
  balon.retirar(2);
  assert.equal(balon.stock, 3);
  balon.reponer(10);
  assert.equal(balon.stock, 13);

  assert.throws(() => balon.retirar(14), ErrorValidacion); // más de lo que hay
  assert.equal(balon.stock, 13); // el rechazo no tocó nada
  assert.throws(() => balon.retirar(0), ErrorValidacion);
  assert.throws(() => balon.reponer(-3), ErrorValidacion);
});

// ----------------------------------------------------------------------------
// Herencia y polimorfismo
// ----------------------------------------------------------------------------

test("ProductoRebajado: override del precio reutilizando super", () => {
  // 100 × 1,21 = 121 → −15 % = 102,85
  assert.equal(crearZapatillas().precioConIVA(), 102.85);
});

test("ProductoRebajado ES un Producto (instanceof), pero un Producto no es Rebajado", () => {
  const zapatillas = crearZapatillas();
  assert.ok(zapatillas instanceof ProductoRebajado);
  assert.ok(zapatillas instanceof Producto);
  assert.ok(!(crearBalon() instanceof ProductoRebajado));
});

test("El resumen heredado usa el precio sobrescrito (this apunta a la instancia real)", () => {
  const texto = crearZapatillas().resumen();
  assert.match(texto, /ZAP-0004/);
  assert.match(texto, /102,85/); // precio YA rebajado
  assert.match(texto, /\[-15 %\]/); // etiqueta añadida por la hija
});

test("ProductoRebajado: validaciones del padre primero, luego las propias", () => {
  const datos = { sku: "ZAP-0004", nombre: "Zapatillas", precio: 100, descuento: 5 };

  // Descuento inválido con todo lo demás correcto → falla la validación de la hija.
  assert.throws(
    () => new ProductoRebajado(datos),
    (e) => e instanceof ErrorValidacion && e.campo === "descuento"
  );
  // Sku inválido Y descuento inválido → gana el error del PADRE (se ejecuta antes).
  assert.throws(
    () => new ProductoRebajado({ ...datos, sku: "malo" }),
    (e) => e instanceof ErrorValidacion && e.campo === "sku"
  );
  // El límite máximo permitido se acepta; justo por encima se rechaza.
  assert.doesNotThrow(() => new ProductoRebajado({ ...datos, descuento: CONFIG.descuentoMaximo }));
  assert.throws(() => new ProductoRebajado({ ...datos, descuento: 0 }), ErrorValidacion);
});

test("La clase hija conserva toJSON del padre y añade su campo", () => {
  assert.deepEqual(JSON.parse(JSON.stringify(crearZapatillas())), {
    sku: "ZAP-0004",
    nombre: "Zapatillas",
    precio: 100,
    stock: 3,
    descuento: 0.15,
  });
});

// ----------------------------------------------------------------------------
// Carrito
// ----------------------------------------------------------------------------

test("Carrito: acumula unidades y calcula el total de forma polimórfica", () => {
  const carrito = new Carrito();
  carrito.agregar(crearBalon(), 2); // 2 × 24,20 = 48,40
  carrito.agregar(crearZapatillas()); // 1 × 102,85
  carrito.agregar(crearBalon(), 1); // mismo sku → se acumula (3 balones)

  assert.equal(carrito.unidades, 4);
  assert.equal(carrito.lineas.length, 2);
  assert.equal(carrito.total, 175.45); // 3 × 24,20 + 102,85
});

test("Carrito: rechaza lo que no es un Producto, aunque tenga la misma forma", () => {
  const imitacion = { sku: "BAL-0001", nombre: "Balón", precio: 20, stock: 5 };
  assert.throws(() => new Carrito().agregar(imitacion), ErrorValidacion);
});

test("Carrito: no permite superar el stock (contando lo que ya hay en el carrito)", () => {
  const carrito = new Carrito();
  const raqueta = new Producto({ sku: "RAQ-0003", nombre: "Raqueta", precio: 80, stock: 2 });

  carrito.agregar(raqueta, 2);
  assert.throws(() => carrito.agregar(raqueta, 1), ErrorValidacion); // 3 > 2
  assert.equal(carrito.unidades, 2); // el rechazo no cambió nada
});

test("Carrito: lineas devuelve una COPIA (no se puede manipular desde fuera)", () => {
  const carrito = new Carrito();
  carrito.agregar(crearBalon(), 1);

  const copia = carrito.lineas;
  copia.length = 0; // intento de vaciarlo "por la puerta de atrás"
  copia[0] = null;

  assert.equal(carrito.lineas.length, 1);
  assert.equal(carrito.unidades, 1);
});

test("Carrito: quitar y vaciar", () => {
  const carrito = new Carrito();
  carrito.agregar(crearBalon(), 1);
  carrito.quitar("BAL-0001");
  assert.equal(carrito.unidades, 0);
  assert.throws(() => carrito.quitar("BAL-0001"), ErrorValidacion);
});

test("confirmarCompra: descuenta stock, vacía el carrito y devuelve el resumen", () => {
  const balon = crearBalon();
  const carrito = new Carrito();
  carrito.agregar(balon, 2);

  assert.deepEqual(carrito.confirmarCompra(), { unidades: 2, total: 48.4 });
  assert.equal(balon.stock, 3);
  assert.equal(carrito.unidades, 0);
  assert.throws(() => carrito.confirmarCompra(), ErrorValidacion); // ya está vacío
});

test("confirmarCompra es ATÓMICA: si falla una línea, no se descuenta nada", () => {
  const raqueta = new Producto({ sku: "RAQ-0003", nombre: "Raqueta", precio: 80, stock: 2 });
  const balon = crearBalon();

  const carritoA = new Carrito();
  const carritoB = new Carrito();
  carritoA.agregar(raqueta, 2);
  carritoB.agregar(balon, 1); // línea 1: hay stock
  carritoB.agregar(raqueta, 2); // línea 2: B también cree que hay stock...

  carritoA.confirmarCompra(); // ...pero A se lleva las dos raquetas primero

  assert.throws(() => carritoB.confirmarCompra(), ErrorValidacion);
  assert.equal(balon.stock, 5, "el balón NO debe descontarse si la compra falla");
  assert.equal(carritoB.unidades, 3, "el carrito de B queda intacto");
});

// ----------------------------------------------------------------------------
// Carga desde la API simulada
// ----------------------------------------------------------------------------

test("crearProducto: elige la clase según los datos y traduce los campos", () => {
  const normal = crearProducto({ sku: "BAL-0001", name: "Balón", price: 20, stock: 1 });
  const rebajado = crearProducto({ sku: "ZAP-0004", name: "Zapatillas", price: 100, discount: 0.15 });

  assert.ok(!(normal instanceof ProductoRebajado));
  assert.equal(normal.nombre, "Balón"); // name → nombre
  assert.ok(rebajado instanceof ProductoRebajado);
  assert.equal(rebajado.descuento, 0.15);
});

test("construirCatalogo: un registro malo NO impide procesar los siguientes", () => {
  const { validos, rechazados } = construirCatalogo(DATOS_API);

  assert.deepEqual(
    validos.map((p) => p.sku),
    ["BAL-0001", "CAM-0002", "RAQ-0003", "ZAP-0004"]
  );
  assert.deepEqual(
    rechazados.map((r) => r.indice),
    [4, 5, 6, 7, 8, 9]
  );
  assert.equal(rechazados.at(-1).sku, "(sin sku)"); // el null
  assert.match(rechazados[3].motivo, /duplicado/i); // el sku repetido
});

test("construirCatalogo: un bug que NO es de validación no se esconde", () => {
  // Un Proxy que lanza TypeError al leer "sku" simula un fallo inesperado.
  const registroRoto = new Proxy({}, { get() { throw new TypeError("fallo inesperado"); } });
  assert.throws(() => construirCatalogo([registroRoto]), TypeError);
});
