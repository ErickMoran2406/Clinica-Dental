const overlayNuevoPaciente = document.querySelector('.overlay_nuevo_paciente')
const inputsNuevoPaciente = document.querySelectorAll('.overlay_nuevo_paciente input')
const btnNuevoPaciente = document.querySelector('.btn_nuevo_paciente')
const btnAgregarPaciente = document.querySelector('.btn_agregar')

const selectSexoAgregar = document.querySelector('.overlay_nuevo_paciente .carrusel_forms .div_form:nth-child(1) .selects_sexo_sangre .sexo')
const divSexoOpcionAgregar = selectSexoAgregar.querySelector('.div_sexos')
const svgSelectSexoAgregar = selectSexoAgregar.querySelector('.svg_select')
const sexoOpcionAgregar = selectSexoAgregar.querySelectorAll('.div_sexos p')
const infoSexoAgregar = selectSexoAgregar.querySelector('.info_sexo p')

const selectMesAgregar = document.querySelector('.select_mes_agregar')
const infoMesAgregar = document.querySelector('.info_mes_agregar p')
const svgMesAgregar = document.querySelector('.select_mes_agregar .svg_select')
const divMesAgregar = document.querySelector('.div_mes_agregar')

const selectDiaAgregar = document.querySelector('.select_dia_agregar')
const infoDiaAgregar = document.querySelector('.info_dia_agregar p')
const svgDiaAgregar = document.querySelector('.select_dia_agregar .svg_select')
const divDiaAgregar = document.querySelector('.div_dia_agregar')

const selectSangreAgregar = document.querySelector('.overlay_nuevo_paciente .carrusel_forms .div_form:nth-child(1) .selects_sexo_sangre .sangre')
const divSangreOpcionAgregar = selectSangreAgregar.querySelector('.div_sangres')
const svgSelectSangreAgregar = selectSangreAgregar.querySelector('.svg_select')
const sangreOpcionAgregar = selectSangreAgregar.querySelectorAll('.div_sangres p')
const infoSangreAgregar = selectSangreAgregar.querySelector('.info_sangre p')

const overlayEditar = document.querySelector('.overlay_editar')
const inputsEditar = document.querySelectorAll('.overlay_editar input')
const editar = document.querySelector('.div_opc_tabla .editar')
const btnCerrarEditar = document.querySelector('.cerrar_editar')
const btnEditar = document.querySelector('.btn_editar')

const overlayEliminar = document.querySelector('.overlay_eliminar_paciente')
const eliminar = document.querySelector('.div_opc_tabla .eliminar')
const btnCerrarEliminar = document.querySelector('.cerrar_eliminar_paciente')
const btnCancelarEliminar = document.querySelector('.btn_eliminar_cancelar')
const btnEnviarEliminar = document.querySelector('.btn_eliminar_enviar')
const verExp = document.querySelector('.div_opc_tabla .ver_exp')

const search = document.querySelector('.input_busqueda')
const tablaCuerpo = document.querySelector('.tabla_cuerpo')
const totalPacientes = document.querySelector('.numero_total_pacientes')
const opcs = document.querySelectorAll('.opcs')
const alerta = document.querySelector('.alerta')
let filaSeleccionada = null
let modoEditar = false

const mesesNombres = ['Mes','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function generarDias(divDia, infoDia, mesVal, anioVal){
    const diaActual = infoDia.textContent.trim()
    const totalDias = (mesVal && anioVal) ? new Date(Number(anioVal), Number(mesVal), 0).getDate() : 31

    divDia.innerHTML = '<p>Día</p>'
    for (let d = 1; d <= totalDias; d++) {
        const p = document.createElement('p')
        p.dataset.val = String(d).padStart(2, '0')
        p.textContent = d
        divDia.appendChild(p)
    }
    divDia.querySelectorAll('p[data-val]').forEach(opc => {
        opc.addEventListener('click', (e) => {
            e.stopPropagation()
            infoDia.textContent = opc.dataset.val
            infoDia.style.color = '#333'
            divDia.style.display = 'none'
            divDia.parentElement.querySelector('.svg_select').classList.remove('activo')
        })
    })
    const diasDisponibles = Array.from(divDia.querySelectorAll('p[data-val]')).map(p => p.dataset.val)
    if (!diasDisponibles.includes(diaActual)) {
        infoDia.textContent = 'Día'
        infoDia.style.color = ''
    }
}

generarDias(divDiaAgregar, infoDiaAgregar, null, null)

function toggleSelect(divOpcion, svg) {
    const isOpen = divOpcion.style.display === 'flex'
    svg.classList.toggle('activo', !isOpen)
    divOpcion.style.display = isOpen ? 'none' : 'flex'
}

function cerrarTodo(...grupos) {
    grupos.forEach(([svg, div]) => {
        svg.classList.remove('activo')
        div.style.display = 'none'
    })
}

function cerrarSiClickFuera(contenedor, e, svg, divOpcion) {
    if (!contenedor.contains(e.target)) {
        svg.classList.remove('activo')
        divOpcion.style.display = 'none'
    }
}

selectSexoAgregar.addEventListener('click', (e) => {
    e.stopPropagation()
    cerrarTodo([svgMesAgregar, divMesAgregar], [svgDiaAgregar, divDiaAgregar], [svgSelectSangreAgregar, divSangreOpcionAgregar])
    toggleSelect(divSexoOpcionAgregar, svgSelectSexoAgregar)
})
sexoOpcionAgregar.forEach(opc => {
    opc.addEventListener('click', (e) => {
        e.stopPropagation()
        const opcion = opc.textContent.trim()
        if (opcion === 'Selecciona un sexo') return
        infoSexoAgregar.textContent = opcion
        infoSexoAgregar.style.color = '#333'
        svgSelectSexoAgregar.classList.remove('activo')
        divSexoOpcionAgregar.style.display = 'none'
    })
})

selectMesAgregar.addEventListener('click', (e) => {
    e.stopPropagation()
    cerrarTodo([svgSelectSexoAgregar, divSexoOpcionAgregar], [svgDiaAgregar, divDiaAgregar], [svgSelectSangreAgregar, divSangreOpcionAgregar])
    toggleSelect(divMesAgregar, svgMesAgregar)
})
divMesAgregar.querySelectorAll('p[data-val]').forEach(opc => {
    opc.addEventListener('click', (e) => {
        e.stopPropagation()
        const val = opc.dataset.val
        infoMesAgregar.textContent = mesesNombres[Number(val)]
        infoMesAgregar.style.color = '#333'
        svgMesAgregar.classList.remove('activo')
        divMesAgregar.style.display = 'none'
        const anio = document.querySelector('input[name="anioAgregar"]').value.trim()
        generarDias(divDiaAgregar, infoDiaAgregar, val, anio)
    })
})

selectDiaAgregar.addEventListener('click', (e) => {
    e.stopPropagation()
    cerrarTodo([svgSelectSexoAgregar, divSexoOpcionAgregar], [svgMesAgregar, divMesAgregar], [svgSelectSangreAgregar, divSangreOpcionAgregar])
    toggleSelect(divDiaAgregar, svgDiaAgregar)
})

selectSangreAgregar.addEventListener('click', (e) => {
    e.stopPropagation()
    cerrarTodo([svgSelectSexoAgregar, divSexoOpcionAgregar], [svgMesAgregar, divMesAgregar], [svgDiaAgregar, divDiaAgregar])
    toggleSelect(divSangreOpcionAgregar, svgSelectSangreAgregar)
})
sangreOpcionAgregar.forEach(opc => {
    opc.addEventListener('click', (e) => {
        e.stopPropagation()
        const opcion = opc.textContent.trim()
        if (opcion === 'Selecciona un tipo de sangre') return
        infoSangreAgregar.textContent = opcion
        infoSangreAgregar.style.color = '#333'
        svgSelectSangreAgregar.classList.remove('activo')
        divSangreOpcionAgregar.style.display = 'none'
    })
})

document.addEventListener('click', (e) => {
    cerrarSiClickFuera(selectSexoAgregar, e, svgSelectSexoAgregar, divSexoOpcionAgregar)
    cerrarSiClickFuera(selectMesAgregar, e, svgMesAgregar, divMesAgregar)
    cerrarSiClickFuera(selectDiaAgregar, e, svgDiaAgregar, divDiaAgregar)
    cerrarSiClickFuera(selectSangreAgregar, e, svgSelectSangreAgregar, divSangreOpcionAgregar)
})

async function cargarPacientes(){
    try{
        const response = await fetch('http://localhost/clinicadental/base_de_datos.php?action=obtener_pacientes')
        const pacientes = await response.json()
        tablaCuerpo.innerHTML = ''
        if(!pacientes || pacientes.length === 0){ totalPacientes.textContent = 0; return }
        pacientes.forEach(p => {
            const img = p.estado === 'Inactivo' ? 'img/inactivo.png' : 'img/activo.png'
            const numero = String(p.id_paciente).padStart(2, '0')
            const fila = document.createElement('tr')
            fila.classList.add('tabla_filas')
            fila.dataset.idPaciente = p.id_paciente
            fila.dataset.estado = p.estado || 'Activo'
            fila.dataset.fechaRegistro = p.fecha || ''
            fila.dataset.direccion = p.direccion || ''
            fila.dataset.emergencia = p.tel_emergencia || ''
            fila.innerHTML = `
                <td class="eliminar_paciente"><input type="checkbox" name="eliminar_paciente"></td>
                <td><span>${numero}</span></td>
                <td>${p.nombre}</td>
                <td>${p.fecha_nac}</td>
                <td>${p.telefono}</td>
                <td>${p.correo}</td>
                <td>${p.sexo || ''}</td>
                <td>${p.tipo_sangre}</td>
                <td class="estado"><img src="${img}" alt=""></td>
            `; tablaCuerpo.appendChild(fila)
        }); totalPacientes.textContent = tablaCuerpo.querySelectorAll('.tabla_filas').length
        localStorage.setItem('totalPacientes', totalPacientes.textContent)
    } catch(error){ console.error('Error cargando pacientes:', error) }
} cargarPacientes()

async function agregarNuevoPaciente(){
    const hoy = new Date()
    const nombre = document.querySelector('input[name="nombreAgregar"]').value.trim()
    const anio = document.querySelector('input[name="anioAgregar"]').value.trim()
    const mesVal = Array.from(divMesAgregar.querySelectorAll('p[data-val]'))
        .find(p => mesesNombres[Number(p.dataset.val)] === infoMesAgregar.textContent.trim()) ?.dataset.val || ''
    const diaVal = infoDiaAgregar.textContent.trim()
    const fechaNac = (anio && mesVal && diaVal && diaVal !== 'Día') ? `${anio}-${mesVal}-${diaVal}` : ''

    let telefono = document.querySelector('input[name="telefonoAgregar"]').value.trim()
    const correo = document.querySelector('input[name="correoAgregar"]').value.trim()
    let sexo = infoSexoAgregar.textContent.trim()
    sexo = sexo === 'M' ? 'Masculino' : sexo === 'F' ? 'Femenino' : sexo
    const tipoSan = infoSangreAgregar.textContent.trim()
    const fechaRegistro = hoy.toISOString().split('T')[0]

    let emergencia = document.querySelector('input[name="emergenciaAgregar"]').value.trim()
    emergencia = emergencia.replace(/-/g, '')
    emergencia = `${emergencia.slice(0, 2)}-${emergencia.slice(2, 6)}-${emergencia.slice(6, 10)}`
    
    const direccion = document.querySelector('input[name="direccionAgregar"]').value.trim()
    const alergias = document.querySelector('input[name="alergiasAgregar"]').value.trim()
    const medicamentos = document.querySelector('input[name="medActAgregar"]').value.trim()
    const cirugias = document.querySelector('input[name="cirugiasAgregar"]').value.trim()
    const enfermedades = document.querySelector('input[name="enfAgregar"]').value.trim()

    const checkboxes = document.querySelectorAll('.overlay_nuevo_paciente .habitos_grid input[type="checkbox"]')
    const habitos = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => {
            if(cb.name === 'habitoOtro'){
                const otro = document.querySelector('input[name="habitoOtroTexto"]').value.trim()
                return otro ? `Otro: ${otro}` : null
            }
            const span = cb.closest('label')?.querySelector('.habito_label')
            return span ? span.textContent.trim().replace(/^[^\w\s]+/, '').replace(/:$/, '').trim() : cb.name
        }).filter(Boolean)

    telefono = telefono.replace(/-/g, '')
    telefono = `${telefono.slice(0, 2)}-${telefono.slice(2, 6)}-${telefono.slice(6, 10)}`

    if(!nombre || !fechaNac || telefono === '--' || !correo || sexo === 'Selecciona un sexo' ||
        tipoSan === 'Selecciona un tipo de sangre' || tipoSan === 'Selecciona un tipo de sangre:'
    ){ mostrarAlerta(); return }

    const datosPaciente = {
        nombre, fecha_nac: fechaNac, telefono, correo, sexo, 
        tipo_sangre: tipoSan, direccion, emergencia, alergias, 
        med_act: medicamentos, cir_prev: cirugias, enfermedades, habitos,
        id_usuario: Number(localStorage.getItem('id_usuario') || 1)
    }

    try{
        const response = await fetch('http://localhost/clinicadental/base_de_datos.php?action=agregar_paciente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosPaciente)
        })

        const resultado = await response.json()

        if(resultado.success){
            const numero = String(resultado.id_paciente).padStart(2, '0')
            const nuevaFila = document.createElement('tr')
            nuevaFila.classList.add('tabla_filas')
            nuevaFila.dataset.idPaciente = resultado.id_paciente
            nuevaFila.dataset.estado = 'Activo'
            nuevaFila.dataset.fechaRegistro = fechaRegistro
            nuevaFila.dataset.direccion = direccion
            nuevaFila.dataset.emergencia = emergencia
            nuevaFila.innerHTML = `
                <td class="eliminar_paciente"><input type="checkbox" name="eliminar_paciente"></td>
                <td><span>${numero}</span></td>
                <td>${nombre}</td>
                <td>${fechaNac}</td>
                <td>${telefono}</td>
                <td>${correo}</td>
                <td>${sexo}</td>
                <td>${tipoSan}</td>
                <td class="estado"><img src="img/activo.png" alt=""></td>
            `
            tablaCuerpo.appendChild(nuevaFila)
            totalPacientes.textContent = tablaCuerpo.querySelectorAll('.tabla_filas').length
            localStorage.setItem('totalPacientes', totalPacientes.textContent)
            overlayNuevoPaciente.style.display = 'none'

        } else{
            if(resultado.error === 'duplicado'){
                document.querySelector('.info_alerta h3').textContent = 'Paciente duplicado'
                document.querySelector('.info_alerta p').textContent = resultado.mensaje
                mostrarAlerta()
                setTimeout(() => {
                    document.querySelector('.info_alerta h3').textContent = 'Campos incompletos'
                    document.querySelector('.info_alerta p').textContent = 'Es necesario llenar todos los campos'
                }, 3000)
            } else{ console.error('Error:', resultado.error); mostrarAlerta() }
        }
    } catch(error){ console.error('Error de conexión:', error) }
}

async function confirmarEdicionPaciente(){
    const nombre = document.querySelector('input[name="nombreAgregar"]').value.trim()
    const anio = document.querySelector('input[name="anioAgregar"]').value.trim()
    const mesVal = Array.from(divMesAgregar.querySelectorAll('p[data-val]'))
        .find(p => mesesNombres[Number(p.dataset.val)] === infoMesAgregar.textContent.trim())
        ?.dataset.val || ''
    const diaVal = infoDiaAgregar.textContent.trim()
    const fechaNac = (anio && mesVal && diaVal && diaVal !== 'Día') ? `${anio}-${mesVal}-${diaVal}` : ''

    let telefono = document.querySelector('input[name="telefonoAgregar"]').value.trim()
    let emergencia = document.querySelector('input[name="emergenciaAgregar"]').value.trim()
    const correo = document.querySelector('input[name="correoAgregar"]').value.trim()
    let sexo = infoSexoAgregar.textContent.trim()
    const tipoSangre = infoSangreAgregar.textContent.trim()

    if(!nombre || !fechaNac || !telefono || !correo ||
        sexo === 'Selecciona un sexo' ||
        tipoSangre === 'Selecciona un tipo de sangre' ||
        tipoSangre === 'Selecciona un tipo de sangre:' 
    ){ mostrarAlerta(); return }

    telefono = telefono.replace(/-/g, '')
    telefono = `${telefono.slice(0, 2)}-${telefono.slice(2, 6)}-${telefono.slice(6, 10)}`

    emergencia = emergencia.replace(/-/g, '')
    emergencia = `${emergencia.slice(0, 2)}-${emergencia.slice(2, 6)}-${emergencia.slice(6, 10)}`

    sexo = sexo.startsWith('M') ? 'Masculino' : sexo.startsWith('F') ? 'Femenino' : sexo

    const alergias = document.querySelector('input[name="alergiasAgregar"]').value.trim()
    const medicamentos = document.querySelector('input[name="medActAgregar"]').value.trim()
    const cirugias = document.querySelector('input[name="cirugiasAgregar"]').value.trim()
    const enfermedades = document.querySelector('input[name="enfAgregar"]').value.trim()
    const direccion = document.querySelector('input[name="direccionAgregar"]').value.trim()

    const checkboxesEditar = document.querySelectorAll('.overlay_nuevo_paciente .habitos_grid input[type="checkbox"]')
    const habitos = Array.from(checkboxesEditar)
        .filter(cb => cb.checked)
        .map(cb => {
            if (cb.name === 'habitoOtro') {
                const otro = document.querySelector('input[name="habitoOtroTexto"]').value.trim()
                return otro ? `Otro: ${otro}` : null
            }
            const span = cb.closest('label')?.querySelector('.habito_label')
            return span ? span.textContent.trim().replace(/^[^\w\s]+/, '').replace(/:$/, '').trim() : cb.name
        })
        .filter(Boolean)

    const idPaciente = filaSeleccionada.dataset.idPaciente

    if(filaSeleccionada){
        filaSeleccionada.cells[2].textContent = nombre
        filaSeleccionada.cells[3].textContent = fechaNac
        filaSeleccionada.cells[4].textContent = telefono
        filaSeleccionada.cells[5].textContent = correo
        filaSeleccionada.cells[6].textContent = sexo
        filaSeleccionada.cells[7].textContent = tipoSangre
        filaSeleccionada.dataset.direccion = direccion
        filaSeleccionada.dataset.emergencia = emergencia
    }

    document.querySelector('.overlay_nuevo_paciente .carrusel_forms .div_form:nth-child(1) h3').textContent = 'Información Básica:'
    document.querySelector('.btn_agregar').textContent = 'Agregar paciente'
    modoEditar = false
    overlayNuevoPaciente.style.display = 'none'
    resetCheckboxes()
    filaSeleccionada = null

    const datosEditar = {
        id_paciente: idPaciente, nombre, fecha_nac: fechaNac, telefono, correo,
        sexo, tipo_sangre: tipoSangre, direccion, emergencia, alergias,
        med_act: medicamentos, cir_prev: cirugias, enfermedades, habitos
    }

    try{
        await fetch('http://localhost/clinicadental/base_de_datos.php?action=editar_paciente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosEditar)
        })
    } catch(error){ console.error('Error editando:', error) }
}

editar.addEventListener('click', abrirEditar)
eliminar.addEventListener('click', abrirEliminar)
verExp.addEventListener('click', verExpediente)

btnCerrarEliminar.addEventListener('click', () => { overlayEliminar.style.display = 'none'; resetCheckboxes() })
btnCancelarEliminar.addEventListener('click', () => { overlayEliminar.style.display = 'none'; resetCheckboxes() })
overlayEliminar.addEventListener('click', (e) => { if (e.target === overlayEliminar) overlayEliminar.style.display = 'none' })

function resetCheckboxes() {
    tablaCuerpo.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false)
    opcs.forEach(opc => { opc.style.pointerEvents = 'none'; opc.style.cursor = 'no-drop'; opc.style.opacity = '0.5' })
}

async function abrirEditar(){
    const checkboxMarcado = tablaCuerpo.querySelector('input[type="checkbox"]:checked')
    if (!checkboxMarcado) return
    filaSeleccionada = checkboxMarcado.closest('.tabla_filas')
    modoEditar = true

    const idPaciente = filaSeleccionada.dataset.idPaciente
    const [anio, mes, dia] = filaSeleccionada.cells[3].textContent.trim().split('-')

    document.querySelector('input[name="nombreAgregar"]').value = filaSeleccionada.cells[2].textContent.trim()
    document.querySelector('input[name="anioAgregar"]').value = anio || ''
    document.querySelector('input[name="telefonoAgregar"]').value = filaSeleccionada.cells[4].textContent.trim().replace(/-/g, '')
    document.querySelector('input[name="correoAgregar"]').value = filaSeleccionada.cells[5].textContent.trim()

    const sexoVal = filaSeleccionada.cells[6].textContent.trim()
    infoSexoAgregar.textContent = 
        (sexoVal === 'M' || sexoVal === 'Masculino') ? 'Masculino' : 
        (sexoVal === 'F' || sexoVal === 'Femenino') ? 'Femenino' : sexoVal
    infoSexoAgregar.style.color = '#333'

    infoMesAgregar.textContent = mes ? mesesNombres[Number(mes)] : 'Mes'
    infoMesAgregar.style.color = mes ? '#333' : ''
    generarDias(divDiaAgregar, infoDiaAgregar, mes, anio)
    if (dia) { infoDiaAgregar.textContent = dia; infoDiaAgregar.style.color = '#333' }

    try {
        const resPaciente = await fetch(`http://localhost/clinicadental/base_de_datos.php?action=obtener_paciente&id=${idPaciente}`)
        const paciente = await resPaciente.json()
        
        if(paciente){
            document.querySelector('input[name="direccionAgregar"]').value = paciente.direccion || ''
            document.querySelector('input[name="emergenciaAgregar"]').value = (paciente.tel_emergencia || '').replace(/-/g, '')
        }
    } catch(error){ console.error('Error cargando paciente:', error) }

    infoSangreAgregar.textContent = filaSeleccionada.cells[7].textContent.trim()
    infoSangreAgregar.style.color = '#333'

    try {
        const res = await fetch(`http://localhost/clinicadental/base_de_datos.php?action=obtener_antecedmed&id=${idPaciente}`)
        const ant = await res.json()
        if(ant){
            document.querySelector('input[name="alergiasAgregar"]').value = ant.alergias || ''
            document.querySelector('input[name="medActAgregar"]').value = ant.med_act || ''
            document.querySelector('input[name="cirugiasAgregar"]').value = ant.cir_prev || ''
            document.querySelector('input[name="enfAgregar"]').value = ant.enfermedades || ''

            const habitos = ant.habitos ? ant.habitos.split(', ').map(h => h.trim()).filter(Boolean) : []
            document.querySelectorAll('.overlay_nuevo_paciente .habitos_grid input[type="checkbox"]').forEach(cb => cb.checked = false)
            const inputOtroTexto = document.querySelector('input[name="habitoOtroTexto"]')
            habitos.forEach(h => {
                if (h.startsWith('Otro:')) {
                    const cbOtro = document.querySelector('input[name="habitoOtro"]')
                    if (cbOtro) {
                        cbOtro.checked = true
                        inputOtroTexto.disabled = false
                        inputOtroTexto.value = h.replace('Otro:', '').trim()
                    }
                } else {
                    document.querySelectorAll('.overlay_nuevo_paciente .habitos_grid input[type="checkbox"]').forEach(cb => {
                        const label = cb.closest('label')?.querySelector('.habito_label')?.textContent.trim()
                        if (label && label.replace(/^[^\w\s]+/, '').replace(/:$/, '').trim() === h) cb.checked = true
                    })
                }
            })
        }
    } catch(error){ console.error('Error cargando antecedentes:', error) }

    document.querySelector('.btn_agregar').textContent = 'Guardar cambios'
    overlayNuevoPaciente.style.display = 'flex'
    multiFormulario("200", seccionesForm[0], seccionesForm[1], seccionesForm[2])
    btnPrevForm.classList.add('desactivado')
    btnNextForm.classList.remove('desactivado')
    i = 200
}

function abrirEliminar(){
    overlayEliminar.style.display = 'flex'
    const marcados = tablaCuerpo.querySelectorAll('input[type="checkbox"]:checked')
    const texto = marcados.length === 1
        ? marcados[0].closest('.tabla_filas').cells[2].textContent
        : `${marcados.length} pacientes`
    document.querySelectorAll('.registro_paciente').forEach(el => el.textContent = texto)
}

btnEnviarEliminar.addEventListener('click', async () => {
    const marcados = tablaCuerpo.querySelectorAll('input[type="checkbox"]:checked')
    const ids = Array.from(marcados).map(cb => Number(cb.closest('.tabla_filas').dataset.idPaciente))

    try{
        await fetch('http://localhost/clinicadental/base_de_datos.php?action=eliminar_paciente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids })
        })
    } catch(error){ console.error('Error eliminando:', error) }

    marcados.forEach(cb => cb.closest('.tabla_filas')?.remove())
    overlayEliminar.style.display = 'none'
    resetCheckboxes()
    totalPacientes.textContent = tablaCuerpo.querySelectorAll('.tabla_filas').length
    localStorage.setItem('totalPacientes', totalPacientes.textContent)
})

tablaCuerpo.addEventListener('change', (e) => {
    if (!e.target.closest('input[type="checkbox"]')) return
    const marcado = tablaCuerpo.querySelectorAll('input[type="checkbox"]:checked').length > 0
    opcs.forEach(opc => {
        opc.style.pointerEvents = marcado ? 'all' : 'none'
        opc.style.cursor = marcado ? 'pointer' : 'no-drop'
        opc.style.opacity = marcado ? '1' : '0.5'
    })
})

tablaCuerpo.addEventListener('click', (e) => {
    if (e.target.type === 'checkbox') return
    const fila = e.target.closest('.tabla_filas')
    if (!fila) return
    const cb = fila.querySelector('input[type="checkbox"]')
    cb.checked = !cb.checked
    cb.dispatchEvent(new Event('change', { bubbles: true }))
})

function verExpediente(){
    const checkboxMarcado = tablaCuerpo.querySelector('input[type="checkbox"]:checked')
    if (!checkboxMarcado) return
    const fila = checkboxMarcado.closest('.tabla_filas')
    const [anio, mes, dia] = fila.cells[3].textContent.trim().split('-')
    localStorage.setItem('idPaciente', fila.dataset.idPaciente)
    localStorage.setItem('ID', fila.cells[1].textContent.trim())
    localStorage.setItem('nombre', fila.cells[2].textContent.trim())
    localStorage.setItem('fechaNac', fila.cells[3].textContent.trim())
    localStorage.setItem('anio', anio || '')
    localStorage.setItem('mes', mes || '')
    localStorage.setItem('dia', dia || '')
    localStorage.setItem('telefono', fila.cells[4].textContent.trim())
    localStorage.setItem('correo', fila.cells[5].textContent.trim())
    localStorage.setItem('sexo', fila.cells[6].textContent.trim())
    localStorage.setItem('tipoSangre', fila.cells[7].textContent.trim())
    window.location.href = 'exp_paciente.html'
}

search.addEventListener('input', () => {
    const termino = search.value.toLowerCase().trim()
    tablaCuerpo.querySelectorAll('.tabla_filas').forEach(fila => {
        const hay = [1, 2, 3, 4, 5, 6, 7].some(i => fila.cells[i].textContent.toLowerCase().includes(termino))
        fila.style.display = hay ? '' : 'none'
    })
})

const cerrarForm = document.querySelectorAll('.cerrar_nuevo_paciente')
const carruselForm = document.querySelector('.carrusel_forms')
const seccionesForm = document.querySelectorAll('.secciones_form .seccion')
const btnPrevForm = document.querySelector('.btn_prev_form')
const btnNextForm = document.querySelector('.btn_next_form')
let i = 200

const checkOtro = document.getElementById('checkOtro')
const inputOtro = document.querySelector('.input_habito_otro')
if(checkOtro && inputOtro){
    checkOtro.addEventListener('change', () => {
        inputOtro.disabled = !checkOtro.checked
        if (checkOtro.checked) inputOtro.focus()
        else inputOtro.value = ''
    })
}

btnNuevoPaciente.addEventListener('click', () => {
    document.querySelector('input[name="nombreAgregar"]').value = ''
    document.querySelector('input[name="anioAgregar"]').value = ''
    document.querySelector('input[name="telefonoAgregar"]').value = ''
    document.querySelector('input[name="correoAgregar"]').value = ''
    document.querySelector('input[name="direccionAgregar"]').value = ''
    document.querySelector('input[name="emergenciaAgregar"]').value = ''
    document.querySelector('input[name="alergiasAgregar"]').value = ''
    document.querySelector('input[name="medActAgregar"]').value = ''
    document.querySelector('input[name="cirugiasAgregar"]').value = ''
    document.querySelector('input[name="enfAgregar"]').value = ''
    // document.querySelector('input[name="dolorAgregar"]').value = ''
    document.querySelector('input[name="habitoOtroTexto"]').value = ''
    document.querySelector('input[name="habitoOtroTexto"]').disabled = true

    infoSexoAgregar.textContent = 'Selecciona un sexo:'
    infoSexoAgregar.style.color = ''
    infoSangreAgregar.textContent = 'Selecciona un tipo de sangre:'
    infoSangreAgregar.style.color = ''
    infoMesAgregar.textContent = 'Mes'
    infoMesAgregar.style.color = ''
    infoDiaAgregar.textContent = 'Día'
    infoDiaAgregar.style.color = ''

    // Checkboxes de hábitos
    document.querySelectorAll('.overlay_nuevo_paciente .habitos_grid input[type="checkbox"]').forEach(cb => cb.checked = false)

    overlayNuevoPaciente.style.display = 'flex'
    multiFormulario("200", seccionesForm[0], seccionesForm[1], seccionesForm[2])
    btnPrevForm.classList.add('desactivado')
    btnNextForm.classList.remove('desactivado')
    i = 200
})

inputsNuevoPaciente.forEach(input => {
    input.addEventListener('keypress', (tecla) => { if (tecla.key === 'Enter') agregarNuevoPaciente() })
})

btnAgregarPaciente.addEventListener('click', () => {
    if (modoEditar) confirmarEdicionPaciente()
    else agregarNuevoPaciente()
})

cerrarForm.forEach(cerrar => {
    cerrar.addEventListener('click', () => {
        overlayNuevoPaciente.style.display = 'none'
        if(modoEditar){
            document.querySelector('.overlay_nuevo_paciente .carrusel_forms .div_form:nth-child(1) h3').textContent = 'Información Básica:'
            document.querySelector('.btn_agregar').textContent = 'Agregar paciente'
            modoEditar = false; resetCheckboxes(); filaSeleccionada = null
        }
    })
})

seccionesForm[0].addEventListener('click', () => {
    multiFormulario("200", seccionesForm[0], seccionesForm[1], seccionesForm[2])
    btnPrevForm.classList.add('desactivado')
    btnNextForm.classList.remove('desactivado')
    i = 200
})
seccionesForm[1].addEventListener('click', () => {
    multiFormulario(0, seccionesForm[1], seccionesForm[0], seccionesForm[2])
    btnPrevForm.classList.remove('desactivado')
    btnNextForm.classList.remove('desactivado')
    i = 0
})
seccionesForm[2].addEventListener('click', () => {
    multiFormulario("-200", seccionesForm[2], seccionesForm[0], seccionesForm[1])
    btnPrevForm.classList.remove('desactivado')
    btnNextForm.classList.add('desactivado')
    i = -200
})

btnPrevForm.addEventListener('click', () => {
    if (i >= 200) return
    i += 200
    if (i === 200) btnPrevForm.classList.add('desactivado')
    btnNextForm.classList.remove('desactivado')
    actualizarBtns()
    carruselForm.style.marginLeft = `${i}%`
})
btnNextForm.addEventListener('click', () => {
    if (i <= -200) return
    i -= 200
    if (i === -200) btnNextForm.classList.add('desactivado')
    btnPrevForm.classList.remove('desactivado')
    actualizarBtns()
    carruselForm.style.marginLeft = `${i}%`
})

function multiFormulario(marginLeft, valor0, valor1, valor2) {
    carruselForm.style.marginLeft = `${marginLeft}%`
    valor0.classList.add('activo')
    valor1.classList.remove('activo')
    valor2.classList.remove('activo')
}

function actualizarBtns(){
    if (i === -200) multiFormulario("-200", seccionesForm[2], seccionesForm[0], seccionesForm[1])
    if (i === 0) multiFormulario(0, seccionesForm[1], seccionesForm[0], seccionesForm[2])
    if (i === 200) multiFormulario("200", seccionesForm[0], seccionesForm[1], seccionesForm[2])
}

function mostrarAlerta(){
    alerta.style.top = '20%'
    setTimeout(() => { alerta.style.top = '-30%' }, 3000)
}