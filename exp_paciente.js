const overlayNuevaCita = document.querySelector('.overlay_nueva_cita')
const btnNuevaCita = document.querySelector('.btn_edit_exp')
const cerrarNuevaCita = document.querySelector('.cerrar_nueva_cita')
const nombrePacienteExpediente = document.querySelector('.div_datos .nom_edad .dato input[type="text"]')
const edadPacienteExpediente = document.querySelector('.div_datos .nom_edad .dato input[type="number"]')

console.log(nombrePacienteExpediente, edadPacienteExpediente)

const IDPaciente = document.querySelector('.ID')
const nombrePaciente = document.querySelector('.nombre')
const edadPaciente = document.querySelector('.edad')
const fechaNacPaciente = document.querySelector('.fechaNac')
const sexoPaciente = document.querySelector('.sexo')
const telefonoPaciente = document.querySelector('.telefono')
const correoPaciente = document.querySelector('.correo')
const tipoSangrePaciente = document.querySelector('.tipo_sangre')
const motivoPaciente = document.querySelector('.motivo')

const ID = localStorage.getItem("ID")
const nombre = localStorage.getItem("nombre")
const edad = localStorage.getItem("edad")
const fechaNac = localStorage.getItem("fechaNac") 
const telefono = localStorage.getItem("telefono") 
const correo = localStorage.getItem("correo") 

IDPaciente.textContent = `#${ID}`
nombrePaciente.textContent = nombre
edadPaciente.textContent = edad
fechaNacPaciente.textContent = fechaNac
telefonoPaciente.textContent = telefono
correoPaciente.textContent = correo

btnNuevaCita.addEventListener('click', () => {
    overlayNuevaCita.style.display = "flex"
})
cerrarNuevaCita.addEventListener('click', () => {
    overlayNuevaCita.style.display = 'none'
})

nombrePacienteExpediente.value = nombrePaciente.textContent
edadPacienteExpediente.value = edadPaciente.textContent