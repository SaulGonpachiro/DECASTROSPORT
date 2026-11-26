# CUADERNO DEL ALUMNO · DeCastro Sports
**2.º DAW · DWEC · Tema 3 · 90 minutos guiados + ampliación**

## Tu misión
Completar **solo `modelo/modelo.js`** para que las pruebas del modelo pasen. La vista, controlador y utilidades están hechos. **No modifiques `pruebas.js`**. La carpeta real del proyecto usa `modelo/`, `vista/`, `controlador/`, `utils/` (sin prefijo `js/`).

## Puesta en marcha
1. Abre `02_ALUMNOS_PRACTICA` en VS Code. Comprueba que estás junto a `package.json`.
2. Ejecuta `node -v` (necesitas Node 18+).
3. En PowerShell: `npm.cmd test` (o `npm test` en otras terminales).
4. Para la web: `python -m http.server 8000` y visita `http://localhost:8000`. Al principio **puede fallar** porque falta el modelo: es normal.
5. Guarda cada cambio y repite `npm.cmd test`. Una prueba fallida indica un comportamiento pendiente, no que el proyecto esté roto.

## Arquitectura
| Capa | Ubicación | Hace | No hace |
|---|---|---|---|
| Modelo | `modelo/modelo.js` | Reglas de producto, descuento, stock, carrito | Acceder al DOM |
| Vista | `vista/vista.js` | Pintar la pantalla y notificar clics | Calcular precios |
| Controlador | `controlador/controlador.js` | Coordinar acciones entre vista y modelo | Validar reglas del producto |
| Utilidades | `utils/` | Redondeo, formato y DOM genérico | Conocer el negocio |
| Entrada | `main.js` | Conectar objetos y arrancar | Contener reglas |
| Pruebas | `pruebas.js` | Verificar comportamiento con Node | Ser parte de la interfaz |

**Flujo:** clic → vista avisa → controlador llama al modelo → modelo valida y devuelve/lanza error → controlador solicita actualizar la vista.

## Guía paso a paso (no saltes pasos)
| Tiempo | Tarea exacta en `modelo/modelo.js` | Comprueba |
|---|---|---|
| 0–10 | Abrir proyecto; localizar `main.js`, `modelo.js`, `pruebas.js`; ejecutar pruebas iniciales | Aparecen fallos esperados |
| 10–20 | TODO 1A–1D: validadores. CONFIG y ErrorValidacion ya vienen hechos para ahorrar tiempo | Un valor inválido debe lanzar `ErrorValidacion` |
| 20–42 | TODO 2A–2K: constructor, getters, setters, stock, IVA, JSON | Balón de 20 € → 24,20 € con IVA; precio -5 no se acepta |
| 42–57 | TODO 3A–3D: `extends`, `super`, descuento y JSON | 100 € con descuento 15 % → 102,85 € |
| 57–77 | TODO 4A–4K: carrito, suma de unidades, total y compra en dos pasadas | No superar stock; no comprar parcialmente |
| 77–87 | TODO 5A–5F: factoría y catálogo con errores por registro | Registros malos rechazados; otros siguen |
| 87–90 | `npm.cmd test`, registrar resultados y explicar una decisión de diseño | Comparar pruebas pasadas y fallidas |

## Pistas de desbloqueo
- **TODO 1:** `typeof valor !== 'string'`; `Number.isFinite`; `Number.isInteger`.
- **TODO 2:** primero validar y luego modificar; `this.nombre = nombre` activa el setter. `sku` y `stock` NO tienen setter.
- **TODO 3:** primero `super(datos)`; para calcular descuento usa `super.precioConIVA()`; no intentes leer `#precio` del padre.
- **TODO 4:** `find`, `findIndex`, `reduce`, `map`; `lineas` debe devolver copia defensiva; primero verificar todas las líneas y después retirar stock.
- **TODO 5:** el `try/catch` va **dentro** del bucle; captura `ErrorValidacion` y relanza los demás errores.
- **Si ves `undefined`:** comprueba que has escrito `return` en getters y métodos.
- **Si ves `SyntaxError`:** comprueba llaves, `#campos` declarados y llamadas a `super`.

## Registro de progreso
| Momento | Pruebas superadas | Error que resolví |
|---|---|---|
| Inicio | 0 | |
| Tras Producto | | |
| Tras herencia | 13 | |
| Tras Carrito | 20 | En agregar comprobaba el stock solo con la cantidad nueva, y hay que sumarle lo que ya había en el carrito |
| Final | 23 | En construirCatalogo el try/catch tiene que ir dentro del forEach, y relanzar los errores que no son ErrorValidacion |

## Cierre (responde en 2–3 líneas)
1. ¿Por qué un Carrito *tiene* productos pero no *es* un producto?

   Porque el carrito no es un producto, no tiene sku ni precio ni stock, lo que tiene son productos dentro con su cantidad. Por eso no hace extends de Producto, sino que guarda un array con las lineas.

2. ¿Por qué validar stock en `agregar` no basta para `confirmarCompra`?

   Porque desde que lo metes en el carrito hasta que compras el stock puede cambiar, entonces en confirmarCompra hay que volver a mirarlo. Primero se comprueban todas las lineas y si alguna falla no se compra nada, y si van todas bien ya se quita el stock.

3. ¿Por qué un error de datos se registra, pero un bug debe propagarse?

   Porque si un dato de la API viene mal se apunta en rechazados y se sigue con los siguientes, ya que no es culpa del codigo. Pero si es un bug como un TypeError hay que relanzarlo con throw, ya que si lo escondes no te enteras del fallo.

## Ampliación para casa
Experimenta con `demo.js`, `this` y callbacks; explica `toJSON`; añade una prueba nueva. **No es obligatorio para completar los 90 minutos.**


## Respuestas del PDF

Resultado de pruebas: 23 / 23
Lo que más entiendo: lo de validar antes de cambiar nada y lo de comprobar todo el carrito antes de quitar el stock.
Mi duda: 

1. ¿Por qué Carrito no hereda de Producto?

   Porque el carrito no es un producto, no tiene sku ni precio ni stock, lo que tiene son productos dentro con su cantidad. Si heredara tendria cosas que no le sirven para nada.

2. ¿Por qué se valida antes de modificar?

   Porque si primero cambias el valor y luego compruebas, cuando el dato esta mal ya lo has estropeado. Validando antes, si salta el error el objeto se queda como estaba, por ejemplo si pones precio -5 se queda el precio de antes.

3. ¿Por qué try/catch va dentro del bucle?

   Porque asi si un registro viene mal se apunta en rechazados y el bucle sigue con los siguientes. Si estuviera fuera, al primer error se pararia todo y no se procesaria el resto del catalogo.