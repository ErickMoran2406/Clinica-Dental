const fechaSpan = document.querySelector('.fecha span')
const horaSpan = document.querySelector('.hora span')
const ahora = new Date();

const fecha = ahora.toLocaleDateString("es-MX", {
    weekday: "long",   // día de la semana
    year: "numeric",
    month: "long",
    day: "numeric"
});

const hora = ahora.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
});

fechaSpan.textContent = fecha
horaSpan.textContent = hora