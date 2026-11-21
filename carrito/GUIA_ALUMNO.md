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
| Inicio | | |
| Tras Producto | | |
| Tras herencia | | |
| Tras Carrito | | |
| Final | | |

## Cierre (responde en 2–3 líneas)
1. ¿Por qué un Carrito *tiene* productos pero no *es* un producto?
2. ¿Por qué validar stock en `agregar` no basta para `confirmarCompra`?
3. ¿Por qué un error de datos se registra, pero un bug debe propagarse?

## Ampliación para casa
Experimenta con `demo.js`, `this` y callbacks; explica `toJSON`; añade una prueba nueva. **No es obligatorio para completar los 90 minutos.**
