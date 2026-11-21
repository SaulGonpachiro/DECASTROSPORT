/**
 * ============================================================================
 *  main.js — PUNTO DE ENTRADA · RAÍZ DE COMPOSICIÓN
 * ============================================================================
 *
 *  Es el ÚNICO archivo que conoce TODAS las capas. Su trabajo es crear las
 *  piezas y conectarlas entre sí; no contiene lógica propia. Un archivo de
 *  "cableado" así se llama raíz de composición (composition root).
 *
 *  MAPA DE DEPENDENCIAS (la flecha significa "importa de"):
 *
 *      main.js ──┬──► controlador ──► modelo ──► utils
 *                ├──► vista ────────► modelo
 *                │        └─────────► utils
 *                └──► demo ─────────► modelo, utils
 *
 *      (No hay ninguna flecha entre vista y controlador.)
 *
 *  Reglas que se cumplen (y que podéis comprobar mirando los `import`):
 *    · utils no depende de nada.
 *    · modelo solo depende de utils.
 *    · vista y controlador dependen del modelo (la vista para LEER, el
 *      controlador para modificarlo), pero NO entre sí: el controlador recibe
 *      una vista por el constructor y usa solo sus métodos públicos.
 *    · Solo main.js los junta.
 *
 *  ES un módulo (type="module" en index.html), lo que implica:
 *    · modo estricto siempre;
 *    · carga diferida: el DOM ya está listo al ejecutarse (no hace falta
 *      DOMContentLoaded);
 *    · necesita servirse por http (Live Server de VS Code, o `npx serve`):
 *      abierto con doble clic (file://) el navegador bloquea los imports.
 */
import { Carrito, construirCatalogo } from "./modelo/modelo.js";
import { DATOS_API } from "./modelo/datos.js";
import { Vista } from "./vista/vista.js";
import { Controlador } from "./controlador/controlador.js";
import { ejecutarDemostracion } from "./demo.js";

// 1) Datos y modelo. Cuando lleguemos a fetch() (Temas 4+5) este paso será
//    asíncrono: se esperará la respuesta antes de construir el catálogo.
const { validos: catalogo, rechazados } = construirCatalogo(DATOS_API);
const carrito = new Carrito();

// 2) Vista y controlador, conectados por inyección de dependencias.
const vista = new Vista();
const controlador = new Controlador({ catalogo, rechazados, carrito, vista });

// 3) Arrancar. La demostración va al final: si fallara, la tienda ya funciona.
controlador.iniciar();
ejecutarDemostracion({ catalogo, rechazados });
