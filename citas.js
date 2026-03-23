const alerta = document.querySelector('.alerta')

// ─── Select de paciente ──────────────────────────────────────────────────────
const selectPaciente = document.querySelector('.select_paciente')
const infoPacienteP = document.querySelector('.info_paciente_select p')
const svgSelectPaciente = document.querySelector('.info_paciente_select .svg_select')
const divPacientes = document.querySelector('.div_pacientes')

// Carga pacientes desde MySQL en el select
async function poblarPacientes() {
    try {
        const res = await fetch('http://localhost/clinicadental/base_de_datos.php?action=obtener_pacientes')
        const lista = await res.json()
        divPacientes.innerHTML = '<p>Selecciona un Paciente</p>'
        lista.forEach(p => {
            const opcion = document.createElement('p')
            opcion.textContent = p.nombre
            opcion.dataset.id = p.id_paciente
            divPacientes.appendChild(opcion)
        })
    } catch(error){ console.error('Error cargando pacientes:', error) }
}

let idPacienteSeleccionado = null

selectPaciente.addEventListener('click', (e) => {
    e.stopPropagation()
    poblarPacientes()
    const isOpen = divPacientes.style.display === 'flex'
    svgSelectPaciente.classList.toggle('activo', !isOpen)
    divPacientes.style.display = isOpen ? 'none' : 'flex'
    divServicios.style.display = 'none'
    svgSelectServicio.classList.remove('activo')
})

divPacientes.addEventListener('click', (e) => {
    e.stopPropagation()
    const p = e.target.closest('p')
    if(!p) return
    const valor = p.textContent.trim()
    if(!valor || valor === 'Selecciona un Paciente') return
    infoPacienteP.textContent = valor
    infoPacienteP.style.color = '#333'
    idPacienteSeleccionado = p.dataset.id || null
    svgSelectPaciente.classList.remove('activo')
    divPacientes.style.display = 'none'
})

// ─── Select de servicio ──────────────────────────────────────────────────────
const selectServicio = document.querySelector('.servicio:not(.select_paciente)')
const infoServicio = selectServicio.querySelector('.info_servicio p')
const svgSelectServicio = selectServicio.querySelector('.svg_select')
const divServicios = selectServicio.querySelector('.div_servicios')
const opcionesServicio = divServicios.querySelectorAll('p')

selectServicio.addEventListener('click', (e) => {
    e.stopPropagation()
    const isOpen = divServicios.style.display === 'flex'
    svgSelectServicio.classList.toggle('activo', !isOpen)
    divServicios.style.display = isOpen ? 'none' : 'flex'
    divPacientes.style.display = 'none'
    svgSelectPaciente.classList.remove('activo')
})

opcionesServicio.forEach(opc => {
    opc.addEventListener('click', (e) => {
        e.stopPropagation()
        const valor = opc.textContent.trim()
        if(valor === 'Selecciona un Servicio') return
        infoServicio.textContent = valor
        infoServicio.style.color = '#333'
        svgSelectServicio.classList.remove('activo')
        divServicios.style.display = 'none'
    })
})

document.addEventListener('click', () => {
    svgSelectServicio.classList.remove('activo')
    divServicios.style.display = 'none'
    svgSelectPaciente.classList.remove('activo')
    divPacientes.style.display = 'none'
})

// ─── Contadores del panel ────────────────────────────────────────────────────
const citasDia = document.querySelector('.citas_dia span')
const citasTotales = document.querySelector('.citas_totales span')
const pacientesTotales = document.querySelector('.pacientes_totales span')

// ─── Calendario ──────────────────────────────────────────────────────────────
const tituloMes = document.querySelector('.mes')
const dias = document.querySelector('.dias')
const btnIconos = document.querySelectorAll('.icono')

const overlayNuevaCita = document.querySelector('.overlay_nueva_cita')
const btnNuevaCita = document.querySelector('.btn_nueva_cita')
const cerrarNuevaCita = document.querySelector('.cerrar_nueva_cita')
const btnConfEditar = document.querySelector('.btn_agregar_cita')

let diaObj = new Date()
let anio = diaObj.getFullYear()
let mes = diaObj.getMonth()

const diaHoy = diaObj.getDate()
const mesHoy = diaObj.getMonth() + 1
const esteAnio = diaObj.getFullYear()

const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

let citas = []

// ─── Cargar citas desde MySQL ────────────────────────────────────────────────
async function cargarCitas() {
    try {
        const res = await fetch('http://localhost/clinicadental/base_de_datos.php?action=obtener_citas')
        citas = await res.json()
        actualizarContadores()
        calendario()
    } catch(error){ console.error('Error cargando citas:', error) }
}

// ─── Actualizar contadores del panel ─────────────────────────────────────────
async function actualizarContadores() {
    const hoyStr = `${esteAnio}-${String(mesHoy).padStart(2,'0')}-${String(diaHoy).padStart(2,'0')}`
    citasDia.textContent = citas.filter(c => c.fecha === hoyStr).length
    citasTotales.textContent = citas.length
    try {
        const res = await fetch('http://localhost/clinicadental/base_de_datos.php?action=obtener_pacientes')
        const pacientes = await res.json()
        pacientesTotales.textContent = pacientes.length
    } catch(error){ pacientesTotales.textContent = 0 }
}

// ─── Renderizar calendario ───────────────────────────────────────────────────
function calendario() {
    let primerDiaMes = new Date(anio, mes, 1).getDay()
    let ultimaFechaMes = new Date(anio, mes + 1, 0).getDate()
    let ultimoDiaMes = new Date(anio, mes, ultimaFechaMes).getDay()
    let ultimoDiaUltimoMes = new Date(anio, mes, 0).getDate()
    let liTag = ""

    for(let i = primerDiaMes; i > 0; i--){
        liTag += `<li class="inactivo">${ultimoDiaUltimoMes - i + 1}</li>`
    }

    for(let i = 1; i <= ultimaFechaMes; i++){
        const esHoy = (i === diaHoy && mes === new Date().getMonth() && anio === new Date().getFullYear()) ? "activo" : ""
        const mesStr = String(mes + 1).padStart(2, '0')
        const diaStr = String(i).padStart(2, '0')
        const fechaStr = `${anio}-${mesStr}-${diaStr}`
        const citasDelDia = citas.filter(c => c.fecha === fechaStr)
        const tieneCita = citasDelDia.length > 0 ? "cita" : ""
        liTag += `<li class="${esHoy} ${tieneCita}" data-fecha="${fechaStr}">${i}</li>`
    }

    if(ultimoDiaMes !== 6){
        for(let i = ultimoDiaMes; i < 6; i++){
            liTag += `<li class="inactivo">${i - ultimoDiaMes + 1}</li>`
        }
    }

    tituloMes.innerHTML = `${meses[mes]} ${anio}`
    dias.innerHTML = liTag
}

// ─── Navegación del calendario ───────────────────────────────────────────────
btnIconos.forEach(btn => {
    btn.addEventListener('click', () => {
        mes = btn.id === "left" ? mes - 1 : mes + 1
        if(mes < 0 || mes > 11){
            diaObj = new Date(anio, mes)
            anio = diaObj.getFullYear()
            mes = diaObj.getMonth()
        }
        calendario()
    })
})

// ─── Abrir formulario nueva cita ─────────────────────────────────────────────
btnNuevaCita.addEventListener('click', () => {
    infoPacienteP.textContent = 'Selecciona un Paciente'
    infoPacienteP.style.color = ''
    idPacienteSeleccionado = null
    document.querySelector('input[name="motivoCita"]').value = ''
    document.querySelector('input[name="fechaCita"]').value = ''
    document.querySelector('input[name="horaCita"]').value = ''
    infoServicio.textContent = 'Selecciona un Servicio'
    infoServicio.style.color = ''
    document.querySelector('[name="notaCita"]').value = ''
    overlayNuevaCita.style.display = 'flex'
})

cerrarNuevaCita.addEventListener('click', () => { overlayNuevaCita.style.display = 'none' })

// ─── Guardar nueva cita en MySQL ─────────────────────────────────────────────
btnConfEditar.addEventListener('click', async () => {
    const nombreCita = infoPacienteP.textContent.trim()
    const motivoCita = document.querySelector('input[name="motivoCita"]').value.trim()
    const fechaCita = document.querySelector('input[name="fechaCita"]').value
    const horaCita = document.querySelector('input[name="horaCita"]').value
    const servicioCita = infoServicio.textContent.trim()
    const notasCita = document.querySelector('[name="notaCita"]').value.trim()

    if(!idPacienteSeleccionado || nombreCita === 'Selecciona un Paciente' ||
        !motivoCita || !fechaCita || !horaCita ||
        servicioCita === 'Selecciona un Servicio'
    ){ mostrarAlerta(); return }

    const datosCita = {
        id_paciente: idPacienteSeleccionado,
        id_usuario: 1,
        fecha: fechaCita,
        hora: horaCita,
        servicio_cita: servicioCita,
        motivo_cita: motivoCita,
        nota: notasCita
    }

    try {
        const res = await fetch('http://localhost/clinicadental/base_de_datos.php?action=agregar_cita', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosCita)
        })
        const resultado = await res.json()
        if(resultado.success){
            overlayNuevaCita.style.display = 'none'
            await cargarCitas()
        } else { console.error('Error guardando cita:', resultado.error) }
    } catch(error){ console.error('Error de conexión:', error) }
})

// ─── Tooltip al pasar sobre día con cita ─────────────────────────────────────
const tooltip = document.createElement('div')
tooltip.classList.add('tooltip')
document.body.appendChild(tooltip)

dias.addEventListener('mousemove', (e) => {
    const li = e.target.closest('li.cita')
    if(!li) return
    const fechaStr = li.dataset.fecha
    const citasDelDia = citas.filter(c => c.fecha === fechaStr)
    tooltip.innerHTML = citasDelDia.map(c =>
        `<div style="margin-bottom:4px;display:flex;flex-direction:column;gap:0.5rem">
            <p>👤 ${c.nombre_paciente}</p>
            <p>🕐 ${c.hora}</p>
        </div>`
    ).join('')
    tooltip.style.display = 'flex'
    tooltip.style.left = e.pageX + 10 + 'px'
    tooltip.style.top = e.pageY - 100 + 'px'
})

dias.addEventListener('mouseout', (e) => {
    if(!e.target.closest('li.cita')) tooltip.style.display = 'none'
})

// ─── Click en día con cita — mostrar info ────────────────────────────────────
const overlayInfoCitas = document.querySelector('.overlay_info_citas')
const infoCitas = document.querySelector('.div_info_citas .info_citas')
const cerrarInfoCitas = document.querySelector('.div_info_citas .cerrar_info_citas')

dias.addEventListener('click', (e) => {
    const li = e.target.closest('li.cita')
    if(!li) return

    const fechaStr = li.dataset.fecha
    const citasDelDia = citas.filter(c => c.fecha === fechaStr)

    infoCitas.innerHTML = citasDelDia.map(c => `
        <div class="info_cita" data-id="${c.id_cita}">
            <div class="info_paciente">
                <div class="nombre_hora">
                    <p>${c.nombre_paciente}</p>
                    <p>${c.hora}</p>
                </div>
                <div class="interac_info">
                    <svg class="svg_borrar" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    <svg class="svg_select" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
                </div>
            </div>
            <div class="motivo_cita">
                <span>SERVICIO:</span>
                <p style="padding-bottom:0.8rem">${c.servicio_cita}</p>
                <span>MOTIVO DE CONSULTA:</span>
                <p style="padding-bottom:0.8rem">${c.motivo_cita || 'Sin motivo'}</p>
                <span>NOTAS DE LA CITA:</span>
                <p style="padding-bottom:0.8rem">${c.nota || 'Sin notas'}</p>
                <span>ESTADO:</span>
                <div class="div_estado_cita" style="display:flex;gap:0.5rem;margin-top:0.4rem;flex-wrap:wrap">
                    <button class="btn_estado ${c.estado === 'Pendiente' ? 'activo_estado' : ''}" data-estado="Pendiente">Pendiente</button>
                    <button class="btn_estado ${c.estado === 'Completada' ? 'activo_estado' : ''}" data-estado="Completada">Completada</button>
                    <button class="btn_estado ${c.estado === 'Cancelada' ? 'activo_estado' : ''}" data-estado="Cancelada">Cancelada</button>
                </div>
            </div>
        </div>
    `).join('')

    overlayInfoCitas.style.display = 'flex'
    tooltip.style.display = 'none'
})

// ─── Borrar / desplegar / cambiar estado de cita ─────────────────────────────
infoCitas.addEventListener('click', async (e) => {

    // Borrar cita
    const btnBorrar = e.target.closest('.svg_borrar')
    if(btnBorrar){
        const infoCitaEl = btnBorrar.closest('.info_cita')
        const id_cita = Number(infoCitaEl.dataset.id)
        try {
            await fetch('http://localhost/clinicadental/base_de_datos.php?action=eliminar_cita', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_cita })
            })
            await cargarCitas()
            infoCitaEl.remove()
            if(infoCitas.querySelectorAll('.info_cita').length === 0){
                overlayInfoCitas.style.display = 'none'
            }
        } catch(error){ console.error('Error eliminando cita:', error) }
        return
    }

    // Cambiar estado
    const btnEstado = e.target.closest('.btn_estado')
    if(btnEstado){
        const infoCitaEl = btnEstado.closest('.info_cita')
        const id_cita = Number(infoCitaEl.dataset.id)
        const nuevoEstado = btnEstado.dataset.estado
        try {
            await fetch('http://localhost/clinicadental/base_de_datos.php?action=actualizar_estado_cita', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_cita, estado: nuevoEstado })
            })
            infoCitaEl.querySelectorAll('.btn_estado').forEach(b => b.classList.remove('activo_estado'))
            btnEstado.classList.add('activo_estado')
            const cita = citas.find(c => c.id_cita === id_cita)
            if(cita) cita.estado = nuevoEstado
        } catch(error){ console.error('Error actualizando estado:', error) }
        return
    }

    // Desplegar/contraer motivo
    const infoPaciente = e.target.closest('.info_paciente')
    if(!infoPaciente) return
    const infoCitaEl = infoPaciente.closest('.info_cita')
    const motivoCita = infoCitaEl.querySelector('.motivo_cita')
    const svgSelect = infoPaciente.querySelector('.svg_select')
    const estaActivo = motivoCita.classList.contains('activo')
    motivoCita.classList.toggle('activo', !estaActivo)
    infoPaciente.classList.toggle('activo', !estaActivo)
    svgSelect.style.transform = !estaActivo ? 'rotate(0deg)' : 'rotate(180deg)'
})

cerrarInfoCitas.addEventListener('click', () => { overlayInfoCitas.style.display = 'none' })

cargarCitas()

function mostrarAlerta(){
    alerta.style.top = "10%"
    setTimeout(() => { alerta.style.top = "-30%" }, 3000)
}