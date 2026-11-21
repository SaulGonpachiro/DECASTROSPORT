//Mostrar en el mini-calendario de la cabecera el día, mes (abreviado) y año actuales. (Usar un Array)

// fecha de hoy en el calendario, se llama ahí abajo
function mostrarFecha() {
    const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
                   "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

    const ahora = new Date();
    const dia = ahora.getDate();
    const mes = meses[ahora.getMonth()];
    const anno = ahora.getFullYear();

    document.querySelector(".cal-dia").textContent = dia;
    document.querySelector(".cal-mes").textContent = mes;
    document.querySelector(".cal-anio").textContent = anno;

    document.querySelector(".mini-calendario").setAttribute("datetime", ahora.toISOString().split("T")[0]);
}
mostrarFecha();



/* ===== Formulario de contacto: valida los 3 campos y manda la confirmación ===== */

const formulario = document.querySelector(".form-contacto");

// En Index.html y Utilidades.html no hay formulario, así que aquí dentro no se hace nada en esas páginas
if (formulario) {
    const nombreInput = document.getElementById("nombre");
    const correoInput = document.getElementById("correo");
    const mensajeInput = document.getElementById("mensaje");
    const confirmacion = document.getElementById("confirmacion");

    function validarNombre() {
        if (!nombreInput) return;

        if (nombreInput.value.length < 2) {
            nombreInput.setCustomValidity("Oye oye, ¿así te llamas de verdad? Pon al menos 2 letras 😅");
        } else {
            nombreInput.setCustomValidity("");
        }

        nombreInput.reportValidity();
    }

    function validarCorreo() {
        if (!correoInput) return;

        if (correoInput.validity.valueMissing) {
            correoInput.setCustomValidity("Al correo le falta algo... ¡a ti! Escribe uno, anda 📨");
        } else if (correoInput.validity.typeMismatch) {
            correoInput.setCustomValidity("Eso no es un correo, es un churro 🥐. Prueba con algo tipo nombre@correo.com");
        } else {
            correoInput.setCustomValidity("");
        }

        correoInput.reportValidity();
    }

    /* ===== Para generar los mensajes de error cuando hacen algo mal en el textarea ===== */
    function validarMensaje() {
        if (!mensajeInput) return;

        if (mensajeInput.value.length < 10) {
            mensajeInput.setCustomValidity("Has escrito un mensaje muy cortito");
        } else {
            mensajeInput.setCustomValidity("");
        }

        mensajeInput.reportValidity();
    }

    // Validamos cada campo mientras se escribe, no solo cuando le das a enviar
    nombreInput.addEventListener("input", validarNombre);
    correoInput.addEventListener("input", validarCorreo);
    mensajeInput.addEventListener("input", validarMensaje);

    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault(); // no hay server real, que no se recargue

        if (!formulario.reportValidity()) {
            return;
        }

        confirmacion.textContent = "¡Mensaje enviado! Gracias por contactar con nosotros. ✅";
        formulario.reset();
    });
}


/* ===== Para saber en qué rango cae un número ===== */
// esta la reutilizo en imc, fcm y categoria
function buscarCategoria(valor, listaSelector) {
    const items = document.querySelectorAll(listaSelector);

    for (const li of items) {
        // Si el <li> no tiene data-min, no hay límite inferior (-Infinity)
        // Si no tiene data-max, no hay límite superior (Infinity)
        const min = li.dataset.min !== undefined ? parseFloat(li.dataset.min) : -Infinity;
        const max = li.dataset.max !== undefined ? parseFloat(li.dataset.max) : Infinity;

        if (valor >= min && valor <= max) {
            return li;
        }
    }

    return null;
}


/* ===== Calculadora de IMC ===== */
function calcularIMC() {
    const pesoInput = document.getElementById("peso");
    const estaturaInput = document.getElementById("estatura");
    const resultado = document.getElementById("resultadoIMC");

    if (!pesoInput.reportValidity()) {
        return;
    }

    if (!estaturaInput.reportValidity()) {
        return;
    }

    const peso = parseFloat(pesoInput.value);
    const estaturaCm = parseFloat(estaturaInput.value);
    const estaturaMetros = estaturaCm / 100;
    const imc = peso / (estaturaMetros * estaturaMetros);

    const categoriaLi = buscarCategoria(imc, "#imc .info-tarjeta li");

    let nombreCategoria = "categoría desconocida";
    if (categoriaLi) {
        nombreCategoria = categoriaLi.textContent.split("—")[1].trim();
    }

    resultado.textContent = "💪 Tu IMC es " + imc.toFixed(2) + " — " + nombreCategoria + "💪" ;
}

document.getElementById("btnIMC")?.addEventListener("click", calcularIMC);


function validarPeso() {
    const peso = document.getElementById("peso");
    if (!peso) return;

    if (peso.validity.rangeUnderflow) {
        peso.setCustomValidity("¿Pesas menos que un folio? 📄 Pon un peso real (mínimo " + peso.min + " kg)");
    } else if (peso.validity.rangeOverflow) {
        peso.setCustomValidity("Tranquilo, que no eres un elefante 🐘 (máximo " + peso.max + " kg)");
    } else {
        peso.setCustomValidity("");
    }

    peso.reportValidity();
}

function validarEstatura() {
    const estatura = document.getElementById("estatura");
    if (!estatura) return;

    if (estatura.validity.rangeUnderflow) {
        estatura.setCustomValidity("¿Eres un gnomo de jardín? 🧙 Pon una estatura real (mínimo " + estatura.min + " cm)");
    } else if (estatura.validity.rangeOverflow) {
        estatura.setCustomValidity("Ni Shaquille O'Neal llega a eso 🏀 (máximo " + estatura.max + " cm)");
    } else {
        estatura.setCustomValidity("");
    }

    estatura.reportValidity();
}

document.getElementById("peso")?.addEventListener("input", validarPeso);
document.getElementById("estatura")?.addEventListener("input", validarEstatura);



/* ===== Calculadora de FCM ===== */

// guardo el texto original de cada zona, si no al pulsar el boton varias veces se va acumulando
document.querySelectorAll("#fcm .info-tarjeta li").forEach(function(li) {
    li.dataset.textoOriginal = li.textContent.trim();
});

function calcularFCM() {
    const edadInput = document.getElementById("edad");
    const sexoSelect = document.getElementById("sexo");
    const resultado = document.getElementById("resultadoFCM");

    if (!edadInput.reportValidity()) {
        return;
    }

    if (!sexoSelect.reportValidity()) {
        return;
    }

    const edad = parseInt(edadInput.value);
    const sexo = sexoSelect.value;

    let fcm;

    switch (sexo) {
        case "H":
            fcm = 220 - edad;
            break;

        case "M":
            fcm = 226 - edad;
            break;

        case "B":
            resultado.textContent = "Tu corazón late a dos ritmos distintos ❤️❤️, imposible de medir con una sola fórmula. 💀";
            return;

        case "MO":
            resultado.textContent = "🛠️ Tu FCM depende de la cilindrada, no de la edad. Consulta con tu mecánico de cabecera. 🛠️";
            return;

        case "HA":
            resultado.textContent = "🤖 Tu Frecuencia Cardíaca Máxima ha sido clasificada como secreto militar. 🤖";
            return;
    }

    resultado.textContent = "❤️ Tu Frecuencia Cardíaca Máxima estimada es " + fcm + " ppm. ❤️";

    actualizarZonasFCM(fcm);
}

// esto pone las pulsaciones reales en cada zona, calculadas a partir del %
function actualizarZonasFCM(fcm) {
    const items = document.querySelectorAll("#fcm .info-tarjeta li");

    items.forEach(function(li) {
        const minPorcentaje = parseFloat(li.dataset.min);
        const maxPorcentaje = parseFloat(li.dataset.max);

        const minPpm = Math.round(fcm * minPorcentaje / 100);
        const maxPpm = Math.round(fcm * maxPorcentaje / 100);

        li.textContent = li.dataset.textoOriginal + " → " + minPpm + "–" + maxPpm + " ppm";
    });
}

document.getElementById("btnFCM")?.addEventListener("click", calcularFCM);


function validarEdad() {
    const edad = document.getElementById("edad");
    if (!edad) return;

    if (edad.validity.rangeUnderflow || edad.validity.rangeOverflow) {
        edad.setCustomValidity("¿Edad negativa o eterna? 🧛 Pon algo entre " + edad.min + " y " + edad.max + " años");
    } else {
        edad.setCustomValidity("");
    }

    edad.reportValidity();
}

document.getElementById("edad")?.addEventListener("input", validarEdad);



/* ===== Calculadora de Categoría por edad ===== */

// el max del año no puede ser fijo pq cambia cada año, lo pongo por js
document.getElementById("anioNacimiento")?.setAttribute("max", new Date().getFullYear());

function calcularCategoria() {
    const anioInput = document.getElementById("anioNacimiento");
    const resultado = document.getElementById("resultadoCategoria");

    if (!anioInput.reportValidity()) {
        return;
    }

    const anioNacimiento = parseInt(anioInput.value);
    const anioActual = new Date().getFullYear();
    const edad = anioActual - anioNacimiento;

    const categoriaLi = buscarCategoria(edad, "#categoria .info-tarjeta li");

    let nombreCategoria = "🚨 sin categoría asignada 🚨";
    if (categoriaLi) {
        nombreCategoria = categoriaLi.textContent;
    }

    resultado.textContent = "⚡Con " + edad + " años, tu categoría es: " + nombreCategoria + "⚡";
}

document.getElementById("btnCategoria")?.addEventListener("click", calcularCategoria);


function validarAnioNacimiento() {
    const anio = document.getElementById("anioNacimiento");
    if (!anio) return;

    if (anio.validity.rangeUnderflow || anio.validity.rangeOverflow) {
        anio.setCustomValidity("¿Naciste antes que la rueda? 🛞 Pon un año entre " + anio.min + " y " + anio.max);
    } else {
        anio.setCustomValidity("");
    }

    anio.reportValidity();
}

document.getElementById("anioNacimiento")?.addEventListener("input", validarAnioNacimiento);



/* ===== Tablas de horario (con createElement, sin innerHTML) ===== */
function generarTablaHorario(idContenedor, dias, franjas) {
    const tabla = document.createElement("table");
    tabla.classList.add("tabla-horario");

    // ----- Cabecera: una celda vacía + una por cada día -----
    const thead = document.createElement("thead");
    const filaCabecera = document.createElement("tr");

    filaCabecera.appendChild(document.createElement("th")); // esquina vacía

    dias.forEach(function(dia) {
        const th = document.createElement("th");
        th.textContent = dia;
        filaCabecera.appendChild(th);
    });

    thead.appendChild(filaCabecera);
    tabla.appendChild(thead);

    // ----- Cuerpo: una fila por cada franja horaria -----
    const tbody = document.createElement("tbody");

    franjas.forEach(function(franja) {
        const fila = document.createElement("tr");

        const thFranja = document.createElement("th");
        thFranja.textContent = franja;
        fila.appendChild(thFranja);

        // Una celda por cada día, con el mismo horario disponible
        dias.forEach(function() {
            const td = document.createElement("td");
            td.textContent = "✅";
            fila.appendChild(td);
        });

        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);

    document.getElementById(idContenedor).replaceChildren(tabla);
}


// genera las franjas solo en vez de escribirlas a mano, le paso inicio, fin e intervalo
function generarFranjas(horaInicio, horaFin, intervalo) {
    const franjas = [];

    for (let hora = horaInicio; hora < horaFin; hora += intervalo) {
        const inicio = String(hora).padStart(2, "0") + ":00";
        const fin = String(hora + intervalo).padStart(2, "0") + ":00";
        franjas.push(inicio + "–" + fin);
    }

    return franjas;
}


const franjasHorario = [ // info de las 2 tablas, asi monto las dos con el mismo bucle
    {
        contenedor: "tablaManana",
        dias: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
        horas: generarFranjas(9, 15, 2)
    },
    {
        contenedor: "tablaTarde",
        dias: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
        horas: generarFranjas(16, 21, 1)
    }
];

franjasHorario.forEach(function(franja) {
    if (document.getElementById(franja.contenedor)) {
        generarTablaHorario(franja.contenedor, franja.dias, franja.horas);
    }
});