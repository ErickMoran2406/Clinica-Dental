const overlayNuevaCita = document.querySelector('.overlay_nueva_cita')
const btnNuevaCita = document.querySelector('.btn_edit_exp')
const nombrePacienteExpediente = document.querySelector('.overlay_nueva_cita .nom_edad .dato input[type="text"]')
const edadPacienteExpediente = document.querySelector('.overlay_nueva_cita .nom_edad .dato input[type="number"]')
const cerrarPopups = document.querySelectorAll('.cerrar')

const overlayEditarExp = document.querySelector('.overlay_editar_exp')
const btnEditarExp = document.querySelector('.editar_exp')

// Select de Sexo
const divSexoOpcion = document.querySelector('.overlay_editar_exp .fecha_sexo_tel .div_sexos')
const svgSelectSexo = document.querySelector('.overlay_editar_exp .fecha_sexo_tel .svg_select')
const selectSexos = document.querySelector('.overlay_editar_exp .fecha_sexo_tel .sexo')
const sexoOpcion = document.querySelectorAll('.overlay_editar_exp .fecha_sexo_tel .div_sexos p')
const infoSexo = document.querySelector('.overlay_editar_exp .fecha_sexo_tel .info_sexo p')

// Select de Tipo de sangre
const divSangreOpcion = document.querySelector('.overlay_editar_exp .correo_sangre .div_sexos')
const svgSelectSangre = document.querySelector('.overlay_editar_exp .correo_sangre .svg_select')
const selectSangre = document.querySelector('.overlay_editar_exp .correo_sangre .sexo')
const sangreOpcion = document.querySelectorAll('.overlay_editar_exp .correo_sangre .div_sexos p')
const infoSangre = document.querySelector('.overlay_editar_exp .correo_sangre .info_sexo p')

// Select de Especialidad
const divEspOpcion = document.querySelector('.overlay_nueva_cita .div_esp')
const svgSelectEsp = document.querySelector('.overlay_nueva_cita .svg_select')
const selectEsp = document.querySelector('.overlay_nueva_cita .estado')
const espOpcion = document.querySelectorAll('.overlay_nueva_cita .div_esp p')
const infoEsp = document.querySelector('.overlay_nueva_cita .info_esp p')

// --- Lógica Select Sexo ---
selectSexos.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = divSexoOpcion.style.display === 'flex';
    svgSelectSexo.classList.toggle('activo', !isOpen)
    divSexoOpcion.style.display = isOpen ? 'none' : 'flex';
});

sexoOpcion.forEach(opc => {
    opc.addEventListener('click', (e) => {
        e.stopPropagation();
        const opcion = opc.textContent.trim();
        if (opcion === 'Selecciona un sexo') return;
        infoSexo.textContent = opcion[0];
        infoSexo.style.color = '#333';
        svgSelectSexo.classList.remove('activo')
        divSexoOpcion.style.display = 'none';
    });
});

// --- Lógica Select Tipo de Sangre ---
selectSangre.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = divSangreOpcion.style.display === 'flex';
    svgSelectSangre.classList.toggle('activo', !isOpen)
    divSangreOpcion.style.display = isOpen ? 'none' : 'flex';
});

sangreOpcion.forEach(opc => {
    opc.addEventListener('click', (e) => {
        e.stopPropagation();
        const opcion = opc.textContent.trim();
        if (opcion === 'Selecciona un tipo de sangre') return;
        infoSangre.textContent = opcion;
        infoSangre.style.color = '#333';
        svgSelectSangre.classList.remove('activo')
        divSangreOpcion.style.display = 'none';
    });
});

// --- Lógica Select Especialidad ---
selectEsp.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = divEspOpcion.style.display === 'flex';
    svgSelectEsp.classList.toggle('activo', !isOpen)
    divEspOpcion.style.display = isOpen ? 'none' : 'flex';
});

espOpcion.forEach(opc => {
    opc.addEventListener('click', (e) => {
        e.stopPropagation();
        const opcion = opc.textContent.trim();
        if (opcion === 'Selecciona una especialidad') return;
        infoEsp.textContent = opcion;
        infoEsp.style.color = '#333';
        svgSelectEsp.classList.remove('activo')
        divEspOpcion.style.display = 'none';
    });
});

// --- Cerrar todos los selects al hacer click fuera ---
document.addEventListener('click', (e) => {
    if (!selectSexos.contains(e.target)) {
        svgSelectSexo.classList.remove('activo')
        divSexoOpcion.style.display = 'none';
    }
    if (!selectSangre.contains(e.target)) {
        svgSelectSangre.classList.remove('activo')
        divSangreOpcion.style.display = 'none';
    }
    if (!selectEsp.contains(e.target)) {
        svgSelectEsp.classList.remove('activo')
        divEspOpcion.style.display = 'none';
    }
});

btnEditarExp.addEventListener('click', () => { overlayEditarExp.style.display = 'flex' })
btnNuevaCita.addEventListener('click', () => { overlayNuevaCita.style.display = 'flex' })

const ID = localStorage.getItem('ID')
const nombre = localStorage.getItem('nombre')
const edad = localStorage.getItem('edad')
const fechaNac = localStorage.getItem('fechaNac')
const telefono = localStorage.getItem('telefono')
const correo = localStorage.getItem('correo')
const sexo = localStorage.getItem('sexo')
const tipoSangre = localStorage.getItem('tipoSangre')
const motivo = localStorage.getItem('motivo')

const IDPaciente = document.querySelector('.ID')
const nombrePaciente = document.querySelector('.nombre')
const edadPaciente = document.querySelector('.edad')
const fechaNacPaciente = document.querySelector('.fechaNac')
const telefonoPaciente = document.querySelector('.telefono')
const correoPaciente = document.querySelector('.correo')
const sexoPaciente = document.querySelector('.sexo')
const tipoSangrePaciente = document.querySelector('.tipo_sangre')
const motivoPaciente = document.querySelector('.motivo')

if(nombre){
    IDPaciente.textContent = `#${ID}`
    nombrePaciente.textContent = nombre
    edadPaciente.textContent = edad
    telefonoPaciente.textContent = telefono
    correoPaciente.textContent = correo
    if(sexo === "M"){ sexoPaciente.textContent = "Masculino" }
    else if(sexo === "F"){ sexoPaciente.textContent = "Femenino" }
    tipoSangrePaciente.textContent = tipoSangre
    motivoPaciente.textContent = motivo
}

cerrarPopups.forEach(btnCerrar => {
    btnCerrar.addEventListener('click', () => {
        overlayEditarExp.style.display = 'none'
        overlayNuevaCita.style.display = 'none'
    })
});