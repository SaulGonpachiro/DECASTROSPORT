/**
 * ============================================================================
 *  vista/vista.js — CAPA DE VISTA · Mini-tienda DeCastro Sports
 * ============================================================================
 *
 *  RESPONSABILIDADES DE LA VISTA
 *  -----------------------------
 *    ✔ Conoce el HTML: ids, clases CSS, estructura de los nodos.
 *    ✔ PINTA lo que le dan (productos, carrito, mensajes). Solo LEE el modelo.
 *    ✔ TRADUCE los eventos del DOM ("clic en el botón con data-sku=X") a
 *      INTENCIONES del usuario ("quiere agregar X") y se las comunica al
 *      controlador mediante callbacks.
 *
 *    ✘ NO modifica el modelo (nunca llama a carrito.agregar ni a retirar).
 *    ✘ NO conoce al Controlador: no lo importa. Solo ofrece "enchufes"
 *      (alAgregar, alQuitar...) donde cualquiera puede registrar un callback.
 *    ✘ NO contiene reglas de negocio ni captura errores del negocio.
 *
 *  ¿Por qué esta separación? Porque cada capa cambia por motivos distintos:
 *    · Si rediseñamos la pantalla → solo se toca la vista.
 *    · Si cambia una regla de la tienda → solo se toca el modelo.
 *    · Y la vista se puede sustituir por una FALSA en las pruebas (ver
 *      pruebas.js) para comprobar el controlador sin navegador.
 *  Es la misma idea que en Angular: el componente (plantilla) emite eventos y
 *  la lógica vive en otra parte.
 */
import { formatearMoneda } from "../modelo/modelo.js";
import { $, el } from "../utils/dom.js";

export class Vista {
  /** Referencias a los nodos del HTML, guardadas UNA vez (ver constructor). */
  #nodos;

  constructor() {
    // Buscar en el DOM es relativamente costoso y repetitivo: se hace una
    // sola vez al crear la vista. Gracias a que `$` falla rápido, si falta un
    // id en index.html el error aparece AQUÍ, al arrancar, y no al primer clic.
    this.#nodos = {
      catalogo: $("#catalogo"),
      lineasCarrito: $("#lineas-carrito"),
      total: $("#total"),
      vaciar: $("#vaciar"),
      confirmar: $("#confirmar"),
      estado: $("#estado"),
      numRechazados: $("#num-rechazados"),
      rechazados: $("#rechazados"),
    };
  }

  // ==========================================================================
  // PINTAR: del modelo hacia la pantalla
  // ==========================================================================

  /** Dibuja la lista de productos. Recibe instancias de Producto (o subclases). */
  pintarCatalogo(productos) {
    const filas = productos.map((producto) => {
      const agotado = !producto.hayStock();

      const boton = el("button", {
        texto: "Añadir al carrito",
        atributos: { type: "button", "data-sku": producto.sku }, // el sku identifica el producto
      });
      if (agotado) boton.disabled = true;

      return el(
        "li",
        { clase: "producto" },
        el(
          "div",
          {},
          // resumen() es polimórfico: el rebajado sale con su precio y su
          // etiqueta sin que la vista sepa que existen los rebajados.
          el("p", { texto: producto.resumen(), clase: "producto__nombre" }),
          el("p", {
            texto: agotado ? "Agotado" : `Quedan ${producto.stock} uds.`,
            clase: agotado ? "producto__stock producto__stock--agotado" : "producto__stock",
          })
        ),
        boton
      );
    });
    // replaceChildren: vacía el contenedor y pone los nodos nuevos de una vez.
    this.#nodos.catalogo.replaceChildren(...filas);
  }

  /** Dibuja las líneas del carrito, el total y el estado de los botones. */
  pintarCarrito(carrito) {
    // `carrito.lineas` devuelve una COPIA: aquí solo se LEE, nunca se manipula.
    const lineas = carrito.lineas.map(({ producto, cantidad }) =>
      el(
        "li",
        { clase: "linea" },
        el("span", { texto: `${cantidad} × ${producto.nombre}` }),
        el("span", { texto: formatearMoneda(producto.precioConIVA() * cantidad), clase: "linea__importe" }),
        el("button", {
          texto: "Quitar",
          clase: "boton-secundario",
          atributos: { type: "button", "data-quitar": producto.sku },
        })
      )
    );

    if (lineas.length === 0) {
      lineas.push(el("li", { texto: "Aún no has añadido nada. Elige un producto del catálogo.", clase: "vacio" }));
    }
    this.#nodos.lineasCarrito.replaceChildren(...lineas);
    this.#nodos.total.textContent = `Total: ${formatearMoneda(carrito.total)}`;

    const vacio = carrito.unidades === 0;
    this.#nodos.vaciar.disabled = vacio;
    this.#nodos.confirmar.disabled = vacio;
  }

  /** Lista los registros de la API que no pasaron la validación. */
  pintarRechazados(rechazados) {
    this.#nodos.numRechazados.textContent = rechazados.length;
    this.#nodos.rechazados.replaceChildren(
      ...rechazados.map(({ indice, sku, motivo }) =>
        el("li", { texto: `Registro ${indice} (${sku}): ${motivo}` })
      )
    );
  }

  /** Muestra un mensaje al usuario; con esError=true se destaca como error. */
  mostrarEstado(mensaje, esError = false) {
    this.#nodos.estado.textContent = mensaje;
    this.#nodos.estado.className = esError ? "estado estado--error" : "estado";
  }

  // ==========================================================================
  // ESCUCHAR: de la pantalla hacia el controlador
  // ==========================================================================
  // Cada método recibe un callback y lo llamará cuando el usuario haga algo.
  // Observad QUÉ se le pasa al callback: datos simples (un sku), NUNCA el
  // evento del DOM ni un botón. Así el controlador no depende del navegador.

  /** El usuario pulsa «Añadir al carrito». El callback recibe el sku. */
  alAgregar(callback) {
    this.#alPulsar(this.#nodos.catalogo, "button[data-sku]", (boton) => callback(boton.dataset.sku));
  }

  /** El usuario pulsa «Quitar» en una línea. El callback recibe el sku. */
  alQuitar(callback) {
    this.#alPulsar(this.#nodos.lineasCarrito, "button[data-quitar]", (boton) => callback(boton.dataset.quitar));
  }

  /**
   * El usuario pulsa «Vaciar carrito». Se envuelve `callback` en una flecha
   * para NO pasarle el MouseEvent que el navegador entrega al listener: el
   * controlador no tiene por qué saber que existe un evento del DOM.
   */
  alVaciar(callback) {
    this.#nodos.vaciar.addEventListener("click", () => callback());
  }

  alConfirmar(callback) {
    this.#nodos.confirmar.addEventListener("click", () => callback());
  }

  /**
   * DELEGACIÓN DE EVENTOS: un único listener en el contenedor (<ul>) en lugar
   * de uno por botón. Ventajas: hay menos listeners y sigue funcionando
   * aunque replaceChildren() destruya y recree los botones en cada pintado.
   *
   * closest() sube desde el elemento pulsado hasta encontrar el botón que
   * coincide con `selector` (por si el clic cae en un hijo del botón). Si el
   * clic fue en otra parte del <ul>, no hay botón y no se hace nada.
   *
   * Es un MÉTODO PRIVADO (#): detalle interno que no forma parte de la
   * "ventanilla pública" de la vista.
   */
  #alPulsar(contenedor, selector, callback) {
    contenedor.addEventListener("click", (evento) => {
      const boton = evento.target.closest(selector);
      if (boton) callback(boton);
    });
  }
}
