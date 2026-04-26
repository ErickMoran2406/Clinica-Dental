const usuarioSaludo = localStorage.getItem('usuario')
const nombreSaludoUsuario = document.querySelectorAll('.usuario')
nombreSaludoUsuario.forEach(nombre => { nombre.textContent = usuarioSaludo || 'Usuario' });

const fechaSpan = document.querySelector('.fecha span')
const horaSpan = document.querySelector('.hora span')
const ahora = new Date();

const fecha = ahora.toLocaleDateString("es-MX", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
});
const hora = ahora.toLocaleTimeString("es-MX", {
    hour: "2-digit", minute: "2-digit", second: "2-digit"
});

localStorage.setItem('ultimo_acceso', new Date().toISOString())
fechaSpan.textContent = fecha
horaSpan.textContent = hora

const fechaUltimoAcceso = new Date(localStorage.getItem('ultimo_acceso'))
const formato = fechaUltimoAcceso.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
})

const pCitasHoy = document.querySelector('.citasHoy')
const nPacientes = document.querySelector('.nPacientes')
const pacientesPorMes = document.querySelector('.pacientesMes')

const hoy = new Date()
const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,'0')}-${String(hoy.getDate()).padStart(2,'0')}`

async function cargarContadoresInicio(){
    try{
        const resPacientes = await fetch('http://localhost/clinicadental/base_de_datos.php?action=obtener_pacientes')
        const pacientes = await resPacientes.json()
        nPacientes.textContent = pacientes.length

        const resCitas = await fetch('http://localhost/clinicadental/base_de_datos.php?action=obtener_citas')
        const citas = await resCitas.json()
        const citasDeHoy = citas.filter(c => c.fecha === hoyStr).length
        pCitasHoy.textContent = citasDeHoy

    } catch(error){ console.error('Error cargando contadores:', error) }
} cargarContadoresInicio()