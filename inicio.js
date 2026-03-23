const usuarioSaludo = localStorage.getItem('usuario')
const nombreSaludoUsuario = document.querySelector('.saludo_usuario')
nombreSaludoUsuario.textContent = usuarioSaludo

if(nombreSaludoUsuario.textContent == ""){ nombreSaludoUsuario.textContent = 'Usuario' }
else{ nombreSaludoUsuario.textContent = usuarioSaludo }

const fechaSpan = document.querySelector('.fecha span')
const horaSpan = document.querySelector('.hora span')
const ahora = new Date();

const fecha = ahora.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
});

localStorage.setItem('ultimo_acceso', new Date().toISOString())

const fechaUltimoAcceso = new Date(localStorage.getItem('ultimo_acceso'))
const formato = fechaUltimoAcceso.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
})
console.log(formato)

const hora = ahora.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
});

fechaSpan.textContent = fecha
horaSpan.textContent = hora

const pCitasHoy = document.querySelector('.citasHoy')
const nPacientes = document.querySelector('.nPacientes')
const pacientesPorMes = document.querySelector('.pacientesMes')

const listaPacientes = JSON.parse(localStorage.getItem('listaPacientes')) || []
nPacientes.textContent = listaPacientes.length

const listaCitas = JSON.parse(localStorage.getItem('listaCitas')) || []
const hoy = new Date()
const citasDeHoy = listaCitas.filter(c =>
    c.dia === hoy.getDate() &&
    c.mes === hoy.getMonth() &&
    c.anio === hoy.getFullYear()
).length
pCitasHoy.textContent = citasDeHoy

let pacientesMes = localStorage.getItem('pacientesMes')