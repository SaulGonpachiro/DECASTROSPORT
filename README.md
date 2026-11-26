# DECASTROSPORTS

Web de la Asociación Deportiva DeCastro SPORTS que hemos ido haciendo en clase (DIW y DWEC). Tiene la home, unas utilidades para los socios, un formulario de contacto, el aviso legal y ahora también una mini-tienda (Carrito).

## Cómo abrirlo

Con XAMPP (Apache encendido) y la carpeta dentro de htdocs:

```
http://localhost/DIW/DECASTROSPORT/Index.html
```

Ojo, el Carrito no funciona abriéndolo con doble clic (file:///), porque usa módulos (type="module") y el navegador bloquea los import. Hay que abrirlo siempre por http://localhost o con Live Server.

## Páginas

- **Index.html**: la home, con próximos eventos, el texto de bienvenida y los accesos rápidos.
- **Utilidades.html**: calculadora de IMC, de frecuencia cardiaca máxima (FCM), la categoría por año de nacimiento y las tablas de horario (que se hacen con JS).
- **contacto.html**: el formulario de contacto con validación (nombre, correo y mensaje), la dirección y las redes.
- **aviso-legal.html**: el aviso legal.
- **carrito/index.html**: la mini-tienda.

Todas tienen el mismo header (con el mini-calendario que pone la fecha de hoy) y el mismo footer. En el menú están HOME, UTILIDADES, CONTACTO y CARRITO.

## Archivos

- **style.css**: el css de toda la web, con los colores arriba en :root.
- **Index.js**: el js de todas las páginas menos el carrito (calendario, validación del formulario, calculadoras y tablas de horario).
- **carrito/**: la práctica de la mini-tienda (Tema 3, sesión 2).

## Carrito

Es la práctica de POO del Tema 3. Va por capas:

- **modelo/**: las clases Producto, ProductoRebajado (hereda de Producto) y Carrito, las validaciones y el catálogo que viene de la API. Es lo que he hecho yo (modelo.js).
- **vista/**, **controlador/**, **utils/** y **main.js**: venían hechos por el profesor.
- **pruebas.js**: las pruebas del modelo.

Para pasar las pruebas, desde la carpeta carrito:

```
npm.cmd test
```

Pasan las 23 (la captura está en carrito/captura_pruebas.png). Las respuestas de la hoja y el registro de cómo fueron pasando las pruebas están al final de carrito/GUIA_ALUMNO.md.

Lo que hace la tienda:
- Enseña el catálogo con el precio con IVA (y con el descuento si está rebajado).
- Los registros malos de la API salen abajo en "rechazados" con el motivo, y los buenos se cargan igual.
- No deja meter en el carrito más unidades de las que hay en stock (contando las que ya tienes).
- Al confirmar la compra primero mira todas las líneas y si alguna falla no se compra nada.

Para meter el carrito en la web solo he cambiado el carrito/index.html (para que tenga el mismo header y footer que las demás páginas) y he añadido un trozo al final de carrito/css/estilos.css, porque el main de style.css va en flex y descolocaba la tienda.

## Git

- **main**: la versión de la web.
- **carrito**: la rama donde he ido haciendo el carrito, un commit por cada TODO (del 4A al 5F) y luego el cierre. Cuando estuvo acabado se hizo el merge a main.
