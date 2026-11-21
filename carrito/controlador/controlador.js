/**
 * ============================================================================
 *  controlador/controlador.js — ORQUESTADOR · Mini-tienda DeCastro Sports
 * ============================================================================
 *
 *  RESPONSABILIDADES DEL CONTROLADOR
 *  ---------------------------------
 *    ✔ ESCUCHA las intenciones del usuario (a través de la vista).
 *    ✔ Las TRADUCE en operaciones sobre el modelo (carrito.agregar, ...).
 *    ✔ Decide QUÉ HACER con el resultado: confirmar, mostrar el error de
 *      validación al usuario o relanzar un bug.
 *    ✔ Ordena a la vista que se REPINTE desde el modelo.
 *
 *    ✘ NO toca el DOM: no hay document, ni querySelector, ni addEventListener
 *      en este archivo. Por eso se puede probar en Node con una vista falsa.
 *    ✘ NO contiene reglas de negocio (el límite de stock, el IVA...): esas
 *      viven en el modelo. El controlador solo coordina.
 *
 *  INYECCIÓN DE DEPENDENCIAS
 *  -------------------------
 *  El controlador NO crea su carrito ni su vista: los RECIBE en el
 *  constructor. Quien los crea (main.js) decide con qué piezas se monta.
 *  Gracias a eso, en las pruebas le pasamos una vista falsa. Es el mismo
 *  mecanismo que Angular usa en sus constructores, y lo veréis pronto.
 *
 *  FLUJO DE UNA ACCIÓN (ejemplo: pulsar «Añadir al carrito»)
 *
 *    clic → Vista.#alPulsar → callback(sku) → Controlador.#ejecutar
 *         → Controlador.#agregar → Carrito.agregar (reglas del modelo)
 *         → mensaje de éxito  o  ErrorValidacion → Vista.mostrarEstado
 *         → Controlador.#repintar → Vista.pintarCatalogo / pintarCarrito
 */
import { ErrorValidacion, formatearMoneda } from "../modelo/modelo.js";

export class Controlador {
  #catalogo;
  #rechazados;
  #carrito;
  #vista;

  /** Un único objeto con nombre en vez de cuatro parámetros posicionales. */
  constructor({ catalogo, rechazados, carrito, vista }) {
    this.#catalogo = catalogo;
    this.#rechazados = rechazados;
    this.#carrito = carrito;
    this.#vista = vista;
  }

  /** Conecta los eventos y hace el primer pintado. Se llama UNA vez, al arrancar. */
  iniciar() {
    /**
     * ⚠ EL PROBLEMA DEL `this` (tip de la sesión) EN SU CONTEXTO REAL
     *
     * Cada callback es una FLECHA que llama al método a través de `this`.
     * La flecha hereda el `this` del método `iniciar`, que es el controlador.
     *
     * Si hiciéramos esto (pasar el método suelto):
     *
     *     this.#vista.alVaciar(this.#vaciar);          // ✖ MAL
     *
     * la vista lo invocaría como `callback()`, sin instancia delante, y dentro
     * de #vaciar `this` valdría undefined:
     *   "TypeError: Cannot read properties of undefined (reading '#carrito')"
     *
     * Dos soluciones válidas:
     *   (a) una flecha que llama al método          ← la usada aquí
     *   (b) this.#vaciar.bind(this)
     */
    this.#vista.alAgregar((sku) => this.#ejecutar(() => this.#agregar(sku)));
    this.#vista.alQuitar((sku) => this.#ejecutar(() => this.#quitar(sku)));
    this.#vista.alVaciar(() => this.#ejecutar(() => this.#vaciar()));
    this.#vista.alConfirmar(() => this.#ejecutar(() => this.#confirmar()));

    this.#vista.pintarRechazados(this.#rechazados);
    this.#repintar();
  }

  // ==========================================================================
  // Casos de uso: cada uno es UNA acción del usuario. Devuelven el mensaje
  // de éxito para el usuario o lanzan un error. No se preocupan de pintar.
  // ==========================================================================

  #agregar(sku) {
    const producto = this.#catalogo.find((p) => p.sku === sku);
    if (!producto) {
      throw new ErrorValidacion("sku", `No existe el producto ${sku}.`);
    }
    this.#carrito.agregar(producto); // aquí se aplican las reglas del modelo
    return `«${producto.nombre}» añadido al carrito.`;
  }

  #quitar(sku) {
    this.#carrito.quitar(sku);
    return "Producto quitado del carrito.";
  }

  #vaciar() {
    this.#carrito.vaciar();
    return "Carrito vaciado.";
  }

  #confirmar() {
    const { unidades, total } = this.#carrito.confirmarCompra(); // destructuring del resultado
    return `Compra confirmada: ${unidades} uds. por ${formatearMoneda(total)}.`;
  }

  // ==========================================================================
  // Infraestructura del orquestador
  // ==========================================================================

  /**
   * Ejecuta un caso de uso con una gestión de errores única y centralizada.
   *   · La `accion` devuelve un texto de confirmación.
   *   · Si lanza un ErrorValidacion, es lo ESPERADO: se muestra al usuario.
   *   · Si lanza cualquier otro error, es un BUG: se relanza para verlo.
   *   · `finally` se ejecuta SIEMPRE (haya error o no): repintamos desde el
   *     modelo, así la pantalla nunca queda desincronizada de los datos.
   */
  #ejecutar(accion) {
    try {
      this.#vista.mostrarEstado(accion());
    } catch (error) {
      if (!(error instanceof ErrorValidacion)) throw error;
      this.#vista.mostrarEstado(error.message, true);
    } finally {
      this.#repintar();
    }
  }

  /** Pide a la vista que se dibuje de nuevo a partir del estado actual del modelo. */
  #repintar() {
    this.#vista.pintarCatalogo(this.#catalogo); // el stock puede haber cambiado
    this.#vista.pintarCarrito(this.#carrito);
  }
}
