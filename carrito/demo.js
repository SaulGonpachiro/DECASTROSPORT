/**
 * ============================================================================
 *  demo.js — DEMOSTRACIÓN POR CONSOLA  (abrid DevTools → pestaña Console)
 * ============================================================================
 *
 *  Es material DIDÁCTICO, no parte de la aplicación: por eso vive aparte de
 *  vista y controlador. Usa SUS PROPIOS objetos (balón y raqueta de prueba, carritos
 *  de prueba), así que no altera el catálogo ni el carrito que ve el usuario.
 *
 *  Recibe lo que necesita por parámetro (catálogo y rechazados ya
 *  construidos) en lugar de crearlo él: otra aplicación de la inyección de
 *  dependencias.
 */
import { Carrito, Producto, ProductoRebajado } from "./modelo/modelo.js";
import { intentar } from "./utils/consola.js";

export function ejecutarDemostracion({ catalogo, rechazados }) {
  console.group("PASO 6.1 · Encapsulación (campos privados, getters y setters)");
  const balon = new Producto({ sku: "BAL-0009", nombre: "Balón de prueba", precio: 20, stock: 5 });
  console.log("Propiedades visibles:", Object.keys(balon), "← vacío: todo es privado");
  console.log("JSON.stringify:", JSON.stringify(balon), "← gracias a toJSON()");
  intentar("balon.precio = -5   (setter con validación)", () => (balon.precio = -5));
  console.log("  El precio anterior se conserva:", balon.precio);
  intentar("balon.stock = 999   (solo getter)", () => (balon.stock = 999));
  // console.log(balon.#precio);
  //   ↑ DESCOMENTAD SOLO PARA PROBAR: es un SyntaxError ("Private field '#precio'
  //   must be declared in an enclosing class") y, al detectarse al ANALIZAR el
  //   archivo, impediría que se cargara este módulo entero (y con él, la app).
  console.groupEnd();

  console.group("PASO 6.2 · Herencia y polimorfismo");
  const zapatillas = new ProductoRebajado({
    sku: "ZAP-0009",
    nombre: "Zapatillas de prueba",
    precio: 100,
    stock: 3,
    descuento: 0.15,
  });
  // Mismo método, distinta respuesta, SIN ningún `if` que mire el tipo:
  [balon, zapatillas].forEach((producto) => console.log(" ", producto.resumen()));
  console.log("  zapatillas instanceof ProductoRebajado:", zapatillas instanceof ProductoRebajado);
  console.log("  zapatillas instanceof Producto        :", zapatillas instanceof Producto, "← ES un Producto");
  console.log("  balon      instanceof ProductoRebajado:", balon instanceof ProductoRebajado, "← un Producto NO es Rebajado");
  console.groupEnd();

  console.group("PASO 6.3 · Carrito: composición y compra atómica");
  const raqueta = new Producto({ sku: "RAQ-0009", nombre: "Raqueta de prueba", precio: 80, stock: 2 });
  const carritoA = new Carrito();
  const carritoB = new Carrito();
  carritoA.agregar(raqueta, 2);
  carritoB.agregar(balon, 1);
  carritoB.agregar(raqueta, 2); // B también ve "stock suficiente" (aún no ha comprado nadie)
  console.log("  Carrito B antes de comprar:\n    " + carritoB.resumen().replaceAll("\n", "\n    "));
  carritoA.confirmarCompra(); // A se lleva las dos raquetas primero
  intentar("carritoB.confirmarCompra() (ya no quedan raquetas)", () => carritoB.confirmarCompra());
  console.log("  Stock del balón (NO debe haberse descontado):", balon.stock);
  intentar("carritoA.agregar({ ...objeto literal... })", () =>
    carritoA.agregar({ sku: "FAL-0001", nombre: "Falso", precio: 1, stock: 1 })
  );
  console.groupEnd();

  console.group("PASO 6.4 · Carga desde la API simulada");
  console.log(`  ${catalogo.length} productos válidos y ${rechazados.length} rechazados:`);
  console.table(rechazados); // console.table pinta un array de objetos como tabla
  console.groupEnd();

  console.group("PASO 6.5 · `this` y los callbacks");
  const vaciarSuelto = new Carrito().vaciar; // sacamos el método de su instancia...
  intentar("vaciarSuelto()   (se llama sin instancia delante)", () => vaciarSuelto());
  // En el controlador, cada callback es una flecha que evita justo esto.
  console.groupEnd();
}
