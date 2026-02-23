// Botón de agrear paciente.
const overlayNuevoPaciente = document.querySelector('.overlay_nuevo_paciente')
const btnNuevoPaciente = document.querySelector('.btn_nuevo_paciente')
const cerrarNuevoPaciente = document.querySelector('.cerrar_nuevo_paciente')
const btnAgregarPaciente = document.querySelector('.btn_agregar')

// Opción de editar paciente
const overlayEditar = document.querySelector('.overlay_editar')
const editar = document.querySelector('.div_opc_tabla .editar')
const btnCerrarEditar = document.querySelector('.cerrar_editar')
const selectEstados = document.querySelector('.estado')
const divestadosOpcion = document.querySelector('.div_estados')
const estadoOpcion = document.querySelectorAll('.div_estados p')
const infoEstado = document.querySelector('.info_estado p');
const btnEditar = document.querySelector('.btn_editar')
const svgSelect = document.querySelector('.svg_select')

// Opción de eliminar paciente
const overlayEliminar = document.querySelector('.overlay_eliminar_paciente')
const eliminar = document.querySelector('.div_opc_tabla .eliminar')
const btnCerrarEliminar = document.querySelector('.cerrar_eliminar_paciente')
const btnCancelarEliminar = document.querySelector('.btn_eliminar_cancelar')
const btnEnviarEliminar = document.querySelector('.btn_eliminar_enviar')

// Tablas
const lupa = document.querySelector('.lupa');
const search = document.querySelector('.input_busqueda');
const tablaCuerpo = document.querySelector('.tabla_cuerpo');
const filas = document.querySelectorAll('.tabla_filas');
const totalPacientes = document.querySelector('.numero_total_pacientes');
const checkbox = document.querySelectorAll('input[type="checkbox"]');
const opcs = document.querySelectorAll('.opcs');
const infoTablas = document.querySelectorAll('.tabla_filas td')

// Alerta de llenado de campos.
const alerta = document.querySelector('.alerta');

btnNuevoPaciente.addEventListener('click', () => { overlayNuevoPaciente.style.display = 'flex' })
cerrarNuevoPaciente.addEventListener('click', () => { overlayNuevoPaciente.style.display = 'none' })

btnAgregarPaciente.addEventListener('click', () => {
    const hoy = new Date();

    const nombre = document.querySelector('input[name="nombreAgregar"]').value.trim();
    const edad = document.querySelector('input[name="edadAgregar"]').value.trim();
    const telefono = document.querySelector('input[name="telefonoAgregar"]').value.trim();
    const correo = document.querySelector('input[name="correoAgregar"]').value.trim();
    const fechaRegistro = hoy.toISOString().split("T")[0];
    const cita = 'Ninguna'
    const estado = 'Activo'

    if(nombre === "" || edad === "" || telefono === "" || correo === ""){ 
        mostrarAlerta();
        // alerta.style.visibility = 'hidden'
        return;
    }

    const filasActuales = tablaCuerpo.querySelectorAll('.tabla_filas');
    const numero = String(filasActuales.length + 1).padStart(2, '0');

    const nuevaFila = document.createElement('tr');
    nuevaFila.classList.add('tabla_filas');
    nuevaFila.innerHTML = `
        <td class="eliminar_paciente"><input type="checkbox" name="eliminar_paciente"></td>
        <td><span>${numero}</span></td>
        <td>${nombre}</td>
        <td>${edad}</td>
        <td>${telefono}</td>
        <td>${correo}</td>
        <td>${fechaRegistro}</td>
        <td>Ninguna</td>
        <td>Activo</td>
    `;

    tablaCuerpo.appendChild(nuevaFila);
    totalPacientes.textContent = tablaCuerpo.querySelectorAll('.tabla_filas').length;

    document.querySelector('input[name="nombreAgregar"]').value = '';
    document.querySelector('input[name="edadAgregar"]').value = '';
    document.querySelector('input[name="telefonoAgregar"]').value = '';
    document.querySelector('input[name="correoAgregar"]').value = '';
    overlayNuevoPaciente.style.display = 'none';

    console.log({ nombre, edad, telefono, correo, fechaRegistro, cita, estado });
})

selectEstados.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = divestadosOpcion.style.display === 'flex';
    svgSelect.classList.add('activo')
    divestadosOpcion.style.display = isOpen ? 'none' : 'flex';
});

estadoOpcion.forEach(opc => {
    opc.addEventListener('click', (e) => {
        e.stopPropagation();

        const opcion = opc.textContent;

        if (opcion === 'Selecciona un Estado') return;

        infoEstado.textContent = opcion;
        infoEstado.style.color = '#333';
        svgSelect.classList.remove('activo') 
        divestadosOpcion.style.display = 'none';
    });
});

document.addEventListener('click', (e) => {
    if(!selectEstados.contains(e.target)){
        svgSelect.classList.remove('activo') 
        divestadosOpcion.style.display = 'none';
    }
});

btnEditar.addEventListener('click', () => {
    const nombre = document.querySelector('input[name="nombre"]').value;
    const edad = document.querySelector('input[name="edad"]').value;
    const telefono = document.querySelector('input[name="telefono"]').value;
    const correo = document.querySelector('input[name="correo"]').value;
    const cita = document.querySelector('input[name="cita"]').value;
    const estado = infoEstado.textContent;

    if(nombre === "" || edad === "" || telefono === "" || correo === "" || cita === "" || estado === "Selecciona un estado"){ mostrarAlerta(); return; }

    console.log({ nombre, edad, telefono, correo, cita, estado });
});

btnEnviarEliminar.addEventListener('click', () => {
    const checkboxesActuales = tablaCuerpo.querySelectorAll('input[type="checkbox"]:checked');
    
    checkboxesActuales.forEach(cb => {
        const fila = cb.closest('.tabla_filas');
        if (fila) fila.remove();
    });

    totalPacientes.textContent = tablaCuerpo.querySelectorAll('.tabla_filas').length;

    tablaCuerpo.querySelectorAll('.tabla_filas').forEach((fila, index) => {
        fila.cells[1].querySelector('span').textContent = String(index + 1).padStart(2, '0');
    });

    overlayEliminar.style.display = 'none';
    opcs.forEach(opc => {
        opc.style.cursor = 'no-drop';
        opc.style.opacity = '0.5';
    });
    eliminar.removeEventListener('click', abrirEliminar);
});

checkbox.forEach(box => {
    box.addEventListener('change', () =>{
        const marcado = [...checkbox].some(cb => cb.checked);

        if(marcado){
            opcs.forEach(opc => {
                opc.style.pointerEvents = 'all'
                opc.style.cursor = 'pointer';
                opc.style.opacity = '1';

                editar.addEventListener('click', abrirEditar)
                eliminar.addEventListener('click', abrirEliminar)
                btnCerrarEditar.addEventListener('click', () => {
                    overlayEditar.style.display = 'none'
                    checkbox.forEach(box => { box.checked = false }); 
                    opc.style.cursor = 'no-drop';
                    opc.style.opacity = '0.5';
                    editar.removeEventListener('click', abrirEditar)
                })
                btnCerrarEliminar.addEventListener('click', () => { cerrarEliminar(opc) })
                btnCancelarEliminar.addEventListener('click', () => { cerrarEliminar(opc) })
                overlayEditar.addEventListener('click', (e) => { if(e.target === overlayEditar) overlayEditar.style.display = 'none'; });
                overlayEliminar.addEventListener('click', (e) => { if(e.target === overlayEliminar) overlayEliminar.style.display = 'none'; });
            });
        } else{
            opcs.forEach(opc => {
                opc.style.pointerEvents = 'none'
                opc.style.cursor = 'no-drop';
                opc.style.opacity = '0.5';
            });
        }
    })
});

function abrirEditar(){
    overlayEditar.style.display = 'flex'
}
function abrirEliminar(){
    overlayEliminar.style.display = 'flex'

    const checkboxMarcado = tablaCuerpo.querySelector('input[type="checkbox"]:checked');
    if(checkboxMarcado){
        const fila = checkboxMarcado.closest('.tabla_filas');
        const nombre = fila.cells[2].textContent;
        document.querySelectorAll('.registro_paciente').forEach(el => { el.textContent = nombre; });
    }
}
function cerrarEliminar(opc){
    overlayEliminar.style.display = 'none'
    checkbox.forEach(box => { box.checked = false }); 
    opc.style.cursor = 'no-drop';
    opc.style.opacity = '0.5';
    eliminar.removeEventListener('click', abrirEliminar)
}

totalPacientes.textContent = filas.length;

search.addEventListener('input', () => {
    const termino = search.value.toLowerCase().trim();
    
    filas.forEach(fila => {
        // Obtenemos el nombre completo de la 3ra columna (índice 2)
        const ID = fila.cells[1].textContent.toLowerCase();
        const nombre = fila.cells[2].textContent.toLowerCase();
        const edad = fila.cells[3].textContent.toLowerCase();
        const telefono = fila.cells[4].textContent.toLowerCase();
        const correo = fila.cells[5].textContent.toLowerCase();
        // const registro = fila.cells[6].textContent.toLowerCase();
        // const cita = fila.cells[7].textContent.toLowerCase();
        const estado = fila.cells[8].textContent.toLowerCase();
        
        if (nombre.includes(termino) || ID.includes(termino) || edad.includes(termino) || telefono.includes(termino) || correo.includes(termino) || estado.includes(termino)){
            fila.style.display = '';
        } else{ fila.style.display = 'none'; }
    });
});


function mostrarAlerta(){
    alerta.style.zIndex = 100000
    alerta.style.opacity = 1
    setTimeout(() => {
        alerta.style.opacity = 0
        setTimeout(() => { alerta.style.zIndex = -1 }, 1000)
    }, 3000)
}

filas.forEach(fila => {
    fila.addEventListener('click', () => {
        let ID = fila.cells[1].textContent
        let nombre = fila.cells[2].textContent
        let edad = fila.cells[3].textContent
        let fechaNac = 2026 - edad
        let telefono = fila.cells[4].textContent
        let correo = fila.cells[5].textContent

        ID = 'NaN'
        nombre = 'NaN'
        edad = 'NaN'
        fechaNac = 'NaN'
        telefono = 'NaN'
        correo = 'NaN'

        localStorage.setItem('ID', ID)
        localStorage.setItem('nombre', nombre)
        localStorage.setItem('edad', edad)
        localStorage.setItem('fechaNac', fechaNac)
        localStorage.setItem('telefono', telefono)
        localStorage.setItem('correo', correo)
        // window.location.href = "exp_paciente.html"
    })
});