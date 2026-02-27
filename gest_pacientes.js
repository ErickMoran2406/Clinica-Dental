// Botón de agrear paciente.
const overlayNuevoPaciente = document.querySelector('.overlay_nuevo_paciente')
const btnNuevoPaciente = document.querySelector('.btn_nuevo_paciente')
const cerrarNuevoPaciente = document.querySelector('.cerrar_nuevo_paciente')
const btnAgregarPaciente = document.querySelector('.btn_agregar')

const todosLosSexos = document.querySelectorAll('.overlay_nuevo_paciente .sexo')

const selectSexos = todosLosSexos[0]
const divSexoOpcion = todosLosSexos[0].querySelector('.div_sexos')
const svgSelectSexo = todosLosSexos[0].querySelector('.svg_select')
const sexoOpcion = todosLosSexos[0].querySelectorAll('.div_sexos p')
const infoSexo = todosLosSexos[0].querySelector('.info_sexo p')
const flechas = document.querySelectorAll('.flecha')

const selectSangre = todosLosSexos[1]
const divSangreOpcion = todosLosSexos[1].querySelector('.div_sexos')
const svgSelectSangre = todosLosSexos[1].querySelector('.svg_select')
const sangreOpcion = todosLosSexos[1].querySelectorAll('.div_sexos p')
const infoSangre = todosLosSexos[1].querySelector('.info_sexo p')

// Opción de editar paciente
const overlayEditar = document.querySelector('.overlay_editar')
const editar = document.querySelector('.div_opc_tabla .editar')
const btnCerrarEditar = document.querySelector('.cerrar_editar')
const divestadosOpcion = document.querySelector('.div_estados')
const svgSelect = document.querySelector('.svg_select')
const selectEstados = document.querySelector('.estado')
const estadoOpcion = document.querySelectorAll('.div_estados p')
const infoEstado = document.querySelector('.info_estado p');
const btnEditar = document.querySelector('.btn_editar')

const todosLosSexosEditar = document.querySelectorAll('.overlay_editar .sexo')

const selectSexosEditar = todosLosSexosEditar[0]
const divSexoOpcionEditar = todosLosSexosEditar[0].querySelector('.div_sexos')
const svgSelectSexoEditar = todosLosSexosEditar[0].querySelector('.svg_select')
const sexoOpcionEditar = todosLosSexosEditar[0].querySelectorAll('.div_sexos p')
const infoSexoEditar = todosLosSexosEditar[0].querySelector('.info_sexo p')
const flechasEditar = document.querySelectorAll('.flecha')

const selectSangreEditar = todosLosSexosEditar[1]
const divSangreOpcionEditar = todosLosSexosEditar[1].querySelector('.div_sexos')
const svgSelectSangreEditar = todosLosSexosEditar[1].querySelector('.svg_select')
const sangreOpcionEditar = todosLosSexosEditar[1].querySelectorAll('.div_sexos p')
const infoSangreEditar = todosLosSexosEditar[1].querySelector('.info_sexo p')

// Opción de eliminar paciente
const overlayEliminar = document.querySelector('.overlay_eliminar_paciente')
const eliminar = document.querySelector('.div_opc_tabla .eliminar')
const btnCerrarEliminar = document.querySelector('.cerrar_eliminar_paciente')
const btnCancelarEliminar = document.querySelector('.btn_eliminar_cancelar')
const btnEnviarEliminar = document.querySelector('.btn_eliminar_enviar')

// Opción de ver expediente
const verExp = document.querySelector('.div_opc_tabla .ver_exp')

// Tablas
const lupa = document.querySelector('.lupa');
const search = document.querySelector('.input_busqueda');
const tablaCuerpo = document.querySelector('.tabla_cuerpo');
const filas = document.querySelectorAll('.tabla_filas');
const totalPacientes = document.querySelector('.numero_total_pacientes');
const checkbox = document.querySelectorAll('input[type="checkbox"]');
const opcs = document.querySelectorAll('.opcs');
const infoTablas = document.querySelectorAll('.tabla_filas td')
let filaSeleccionada = null;

// Motivo del paciente
const overlayMotivo = document.querySelector('.overlay_motivo')
const cerrarMotivo = document.querySelector('.cerrar_motivo')
const nombreMotivo = document.querySelector('.nombre_motivo')
const textoMotivo = document.querySelector('.texto_motivo')
const textoFechaRegistro = document.querySelector('.texto_fecha_registro')

// Alerta de llenado de campos.
const alerta = document.querySelector('.alerta');

editar.addEventListener('click', abrirEditar)
eliminar.addEventListener('click', abrirEliminar)
verExp.addEventListener('click', verExpediente)
btnCerrarEditar.addEventListener('click', () => { 
    overlayEditar.style.display = 'none'
    tablaCuerpo.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false)
    opcs.forEach(opc => { opc.style.pointerEvents = 'none'; opc.style.cursor = 'no-drop'; opc.style.opacity = '0.5'; })
})
btnCerrarEliminar.addEventListener('click', () => {
    overlayEliminar.style.display = 'none'
    tablaCuerpo.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false)
    opcs.forEach(opc => { opc.style.pointerEvents = 'none'; opc.style.cursor = 'no-drop'; opc.style.opacity = '0.5'; })
})
btnCancelarEliminar.addEventListener('click', () => {
    overlayEliminar.style.display = 'none'
    tablaCuerpo.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false)
    opcs.forEach(opc => { opc.style.pointerEvents = 'none'; opc.style.cursor = 'no-drop'; opc.style.opacity = '0.5'; })
})
overlayEditar.addEventListener('click', (e) => { if(e.target === overlayEditar) overlayEditar.style.display = 'none'; });
overlayEliminar.addEventListener('click', (e) => { if(e.target === overlayEliminar) overlayEliminar.style.display = 'none'; });

btnNuevoPaciente.addEventListener('click', () => { overlayNuevoPaciente.style.display = 'flex' })
cerrarNuevoPaciente.addEventListener('click', () => { overlayNuevoPaciente.style.display = 'none' })

btnAgregarPaciente.addEventListener('click', () => {
    const hoy = new Date();

    const nombre = document.querySelector('input[name="nombreAgregar"]').value.trim();
    const edad = document.querySelector('input[name="edadAgregar"]').value.trim();
    let telefono = document.querySelector('input[name="telefonoAgregar"]').value.trim();
    const correo = document.querySelector('input[name="correoAgregar"]').value.trim();
    let sexo = infoSexo.textContent.trim()
    const tipoSangre = infoSangre.textContent.trim()
    const motivo = document.querySelector('input[name="motivoAgregar"]').value.trim()
    const fechaRegistro = hoy.toISOString().split("T")[0];
    sexo = sexo[0]

    telefono = telefono.replace(/-/g, '');
    telRegion = telefono.slice(0, 2); tel1 = telefono.slice(2, 6); tel2 = telefono.slice(6, 10);
    telefono = `${telRegion}-${tel1}-${tel2}`


    if(nombre === "" || edad === "" || telefono === "" || correo === "" || sexo === "Selecciona un sexo" || tipoSangre === "Selecciona un tipo de sangre" || motivo === ""){ 
        mostrarAlerta(); return
    }

    const filasActuales = tablaCuerpo.querySelectorAll('.tabla_filas');
    const numero = String(filasActuales.length + 1).padStart(2, '0');

    const nuevaFila = document.createElement('tr');
    nuevaFila.classList.add('tabla_filas');
    nuevaFila.dataset.motivo = motivo || 'Sin motivo registrado.'
    nuevaFila.dataset.fechaRegistro = fechaRegistro || 'Sin fecha de registro registrada.'
    nuevaFila.dataset.estado = 'Activo';
    nuevaFila.innerHTML = `
        <td class="eliminar_paciente"><input type="checkbox" name="eliminar_paciente"></td>
        <td><span>${numero}</span></td>
        <td>${nombre}</td>
        <td>${edad}</td>
        <td>${telefono}</td>
        <td>${correo}</td>
        <td>${sexo}</td>
        <td>${tipoSangre}</td>
        <td><button class="motivo">Ver motivo</button></td>
        <td class="estado"><img src="img/activo.png" alt=""></td>
    `;

    tablaCuerpo.appendChild(nuevaFila);
    totalPacientes.textContent = tablaCuerpo.querySelectorAll('.tabla_filas').length;

    document.querySelector('input[name="nombreAgregar"]').value = '';
    document.querySelector('input[name="edadAgregar"]').value = '';
    document.querySelector('input[name="telefonoAgregar"]').value = '';
    document.querySelector('input[name="correoAgregar"]').value = '';
    infoSexo.textContent = 'Selecciona un sexo';
    infoSangre.textContent = 'Selecciona un tipo de sangre';
    document.querySelector('input[name="motivoAgregar"]').value = '';
    overlayNuevoPaciente.style.display = 'none';
})

selectSexos.addEventListener('click', (e) => {
    e.stopPropagation();
    selectSexoSangre(divSexoOpcion, svgSelectSexo)
})
selectSangre.addEventListener('click', (e) => {
    e.stopPropagation();
    selectSexoSangre(divSangreOpcion, svgSelectSangre)
});
selectSexosEditar.addEventListener('click', (e) => {
    e.stopPropagation();
    selectSexoSangre(divSexoOpcionEditar, svgSelectSexoEditar)
});
selectSangreEditar.addEventListener('click', (e) => {
    e.stopPropagation();
    selectSexoSangre(divSangreOpcionEditar, svgSelectSangreEditar)
});
function selectSexoSangre(opcion, svg){
    const isOpen = opcion.style.display === 'flex';
    svg.classList.toggle('activo', !isOpen)
    opcion.style.display = isOpen ? 'none' : 'flex';
}

sexoOpcion.forEach(opc => {
    opc.addEventListener('click', (e) => {
        e.stopPropagation();
        const opcion = opc.textContent.trim();
        opcionSexoSangre(opcion, infoSexo, svgSelectSexo, divSexoOpcion)
    });
});
sangreOpcion.forEach(opc => {
    opc.addEventListener('click', (e) => {
        e.stopPropagation();
        const opcion = opc.textContent.trim();
        opcionSexoSangre(opcion, infoSangre, svgSelectSangre, divSangreOpcion)
    });
});
sexoOpcionEditar.forEach(opc => {
    opc.addEventListener('click', (e) => {
        e.stopPropagation();
        const opcion = opc.textContent.trim();
        opcionSexoSangre(opcion, infoSexoEditar, svgSelectSexoEditar, divSexoOpcionEditar)
    });
});
sangreOpcionEditar.forEach(opc => {
    opc.addEventListener('click', (e) => {
        e.stopPropagation();
        const opcion = opc.textContent.trim();
        opcionSexoSangre(opcion, infoSangreEditar, svgSelectSangreEditar, divSangreOpcionEditar)
    });
});
function opcionSexoSangre(opcion, info, svg, divOpcion){
    if(opcion === 'Selecciona un tipo de sangre' || opcion === 'Selecciona un sexo') return;
    info.textContent = opcion;
    info.style.color = '#333';
    svg.classList.remove('activo')
    divOpcion.style.display = 'none';
}

document.addEventListener('click', (e) => {
    cerrarClickDocumento(selectSexos, e, svgSelectSexo, divSexoOpcion)
    cerrarClickDocumento(selectSangre, e, svgSelectSangre, divSangreOpcion)
    cerrarClickDocumento(selectSexosEditar, e, svgSelectSexoEditar, divSexoOpcionEditar)
    cerrarClickDocumento(selectSangreEditar, e, svgSelectSangreEditar, divSangreOpcionEditar)
});
function cerrarClickDocumento(select, e, svg, divOpcion){
    if(!select.contains(e.target)){
        svg.classList.remove('activo')
        divOpcion.style.display = 'none';
    }
}



btnEditar.addEventListener('click', () => {
    const hoy = new Date();

    const nombre = document.querySelector('input[name="nombreEditar"]').value.trim();
    const edad = document.querySelector('input[name="edadEditar"]').value.trim();
    let telefono = document.querySelector('input[name="telefonoEditar"]').value.trim();
    const correo = document.querySelector('input[name="correoEditar"]').value.trim();
    let sexo = infoSexoEditar.textContent.trim();
    const tipoSangre = infoSangreEditar.textContent.trim();
    const motivo = document.querySelector('input[name="motivoEditar"]').value.trim();

    if(nombre === "" || edad === "" || telefono === "" || correo === "" || sexo === "Selecciona un sexo" || tipoSangre === "Selecciona un tipo de sangre" || motivo === ""){
        mostrarAlerta(); return;
    }

    telefono = telefono.replace(/-/g, '');
    telRegion = telefono.slice(0, 2); tel1 = telefono.slice(2, 6); tel2 = telefono.slice(6, 10);
    telefono = `${telRegion}-${tel1}-${tel2}`;
    sexo = sexo[0];

    // Actualizar la fila en la tabla
    if(filaSeleccionada){
        filaSeleccionada.cells[2].textContent = nombre;
        filaSeleccionada.cells[3].textContent = edad;
        filaSeleccionada.cells[4].textContent = telefono;
        filaSeleccionada.cells[5].textContent = correo;
        filaSeleccionada.cells[6].textContent = sexo;
        filaSeleccionada.cells[7].textContent = tipoSangre;
        filaSeleccionada.dataset.motivo = motivo;
    }

    overlayEditar.style.display = 'none';
    tablaCuerpo.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    opcs.forEach(opc => { opc.style.pointerEvents = 'none'; opc.style.cursor = 'no-drop'; opc.style.opacity = '0.5'; });
    filaSeleccionada = null;
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
        opc.style.pointerEvents = 'none'; // ← estaba faltando esto
        opc.style.cursor = 'no-drop';
        opc.style.opacity = '0.5';
    });
});

tablaCuerpo.addEventListener('change', (e) => {
    const box = e.target.closest('input[type="checkbox"]');
    if (!box) return;

    const marcado = tablaCuerpo.querySelectorAll('input[type="checkbox"]:checked').length > 0;

    if (marcado) {
        opcs.forEach(opc => {
            opc.style.pointerEvents = 'all';
            opc.style.cursor = 'pointer';
            opc.style.opacity = '1';
        });
    } else {
        opcs.forEach(opc => {
            opc.style.pointerEvents = 'none';
            opc.style.cursor = 'no-drop';
            opc.style.opacity = '0.5';
        });
    }
});

function abrirEditar(){
    const checkboxMarcado = tablaCuerpo.querySelector('input[type="checkbox"]:checked');
    if (!checkboxMarcado) return;

    filaSeleccionada = checkboxMarcado.closest('.tabla_filas');

    document.querySelector('input[name="nombreEditar"]').value = filaSeleccionada.cells[2].textContent.trim();
    document.querySelector('input[name="edadEditar"]').value = filaSeleccionada.cells[3].textContent.trim();
    document.querySelector('input[name="telefonoEditar"]').value = filaSeleccionada.cells[4].textContent.trim();
    document.querySelector('input[name="correoEditar"]').value = filaSeleccionada.cells[5].textContent.trim();
    infoSexoEditar.textContent = filaSeleccionada.cells[6].textContent.trim();
    infoSangreEditar.textContent = filaSeleccionada.cells[7].textContent.trim();
    document.querySelector('input[name="motivoEditar"]').value = filaSeleccionada.dataset.motivo || '';

    overlayEditar.style.display = 'flex';
}
function abrirEliminar(){
    overlayEliminar.style.display = 'flex';

    const checkboxesMarcados = tablaCuerpo.querySelectorAll('input[type="checkbox"]:checked');
    const cantidad = checkboxesMarcados.length;

    if(cantidad === 1){
        const fila = checkboxesMarcados[0].closest('.tabla_filas');
        const nombre = fila.cells[2].textContent;
        document.querySelectorAll('.registro_paciente').forEach(el => { el.textContent = nombre; });
    } else {
        document.querySelectorAll('.registro_paciente').forEach(el => { el.textContent = `${cantidad} pacientes`; });
    }
}

function verExpediente(){
    const checkboxMarcado = tablaCuerpo.querySelector('input[type="checkbox"]:checked');
    
    if(checkboxMarcado){
        const fila = checkboxMarcado.closest('.tabla_filas');
        
        const ID = fila.cells[1].textContent.trim()
        const nombre = fila.cells[2].textContent.trim()
        const edad = fila.cells[3].textContent.trim()
        const telefono = fila.cells[4].textContent.trim()
        const correo = fila.cells[5].textContent.trim()
        const sexo = fila.cells[6].textContent.trim();
        const tipoSangre = fila.cells[7].textContent.trim();
        const motivo = fila.dataset.motivo || 'Sin motivo registrado.'

        console.log(ID, nombre, edad, telefono, correo, sexo, tipoSangre, motivo)

        localStorage.setItem('ID', ID)
        localStorage.setItem('nombre', nombre)
        localStorage.setItem('edad', edad)
        localStorage.setItem('telefono', telefono)
        localStorage.setItem('correo', correo)
        localStorage.setItem('sexo', sexo)
        localStorage.setItem('tipoSangre', tipoSangre)
        localStorage.setItem('motivo', motivo)

        window.location.href = "exp_paciente.html"
    }
}
function cerrarEliminar(){
    overlayEliminar.style.display = 'none'
    tablaCuerpo.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false)
    opcs.forEach(opc => { opc.style.pointerEvents = 'none'; opc.style.cursor = 'no-drop'; opc.style.opacity = '0.5'; })
}
function cerrarEditar(){
    overlayEditar.style.display = 'none'
    tablaCuerpo.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false)
    opcs.forEach(opc => { opc.style.pointerEvents = 'none'; opc.style.cursor = 'no-drop'; opc.style.opacity = '0.5'; })
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
        const sexo = fila.cells[6].textContent.toLowerCase();
        const tipoSangre = fila.cells[7].textContent.toLowerCase();
        
        if (nombre.includes(termino) || ID.includes(termino) || edad.includes(termino) || correo.includes(termino) || sexo.includes(termino) || tipoSangre.includes(termino)){
            fila.style.display = '';
        } else{ fila.style.display = 'none'; }
    });
});

tablaCuerpo.addEventListener('click', (e) => {
    const btnMotivo = e.target.closest('.motivo')
    if (!btnMotivo) return

    const fila = btnMotivo.closest('.tabla_filas')
    const nombre = fila.cells[2].textContent.trim()
    const motivo = fila.dataset.motivo || 'Sin motivo de consulta registrado.'
    const fechaRegistro = fila.dataset.fechaRegistro || 'Sin fecha de registro registrada.'

    nombreMotivo.textContent = nombre
    textoMotivo.textContent = motivo
    textoFechaRegistro.textContent = fechaRegistro
    overlayMotivo.style.display = 'flex'
})

cerrarMotivo.addEventListener('click', () => overlayMotivo.style.display = 'none')
overlayMotivo.addEventListener('click', (e) => { 
    if (e.target === overlayMotivo) overlayMotivo.style.display = 'none' 
})

tablaCuerpo.addEventListener('click', (e) => {
    if (e.target.type === 'checkbox' || e.target.closest('.motivo')) return;

    const fila = e.target.closest('.tabla_filas');
    if (!fila) return;

    const checkbox = fila.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;

    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
});


function mostrarAlerta(){
    alerta.style.top = "10%"
    setTimeout(() => { alerta.style.top = "-10%" }, 3000)
}
