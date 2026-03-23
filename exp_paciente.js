const hoy = new Date()
const diaHoy = hoy.getDate()
const mesHoy = hoy.getMonth() + 1
const anioHoy = hoy.getFullYear()

const inputBusqueda = document.querySelector('.input_busqueda')
const alerta = document.querySelector('.alerta')

const overlayEditarExp = document.querySelector('.overlay_editar_exp')
const btnEditarExp = document.querySelector('.editar_exp')
const btnConfEditar = document.querySelector('.btn_editar')
const cerrarPopups = document.querySelectorAll('.cerrar')

const IDPaciente = document.querySelector('.expediente .ID')
const nombrePaciente = document.querySelector('.expediente .nombre')
const fechaNacPaciente = document.querySelector('.expediente .fechaNac')
const sexoPaciente = document.querySelector('.expediente .sexo')
const telefonoPaciente = document.querySelector('.expediente .tel')
const correoPaciente = document.querySelector('.expediente .correo')
const dirPaciente = document.querySelector('.expediente .dir')
const contactoPaciente = document.querySelector('.expediente .contacto')

const tipoSangrePaciente = document.querySelector('.expediente .tipo_sangre')
const alergiasPaciente = document.querySelector('.expediente .alergias')
const medicamentosPaciente = document.querySelector('.expediente .med_act')
const cirugPrevPaciente = document.querySelector('.expediente .cir_prev')
const enfSistemPaciente = document.querySelector('.expediente .enf_sistem')

const cerrarForm = document.querySelectorAll('.cerrar_nuevo_paciente')
const carruselForm = document.querySelector('.carrusel_forms')
const seccionesForm = document.querySelectorAll('.secciones_form .seccion')
const btnPrevForm = document.querySelector('.btn_prev_form')
const btnNextForm = document.querySelector('.btn_next_form')
let i = 200
const inputsEditar = document.querySelectorAll('.overlay_editar_exp input')

const selectSexo = document.querySelector('.overlay_editar_exp .nombre_edad .sexo')
const divSexoOpc = selectSexo.querySelector('.div_sexos')
const svgSexo = selectSexo.querySelector('.svg_select')
const infoSexoP = selectSexo.querySelector('.info_sexo p')
const sexoOpciones = divSexoOpc.querySelectorAll('p')

selectSexo.addEventListener('click', (e) => {
    e.stopPropagation()
    const isOpen = divSexoOpc.style.display === 'flex'
    svgSexo.classList.toggle('activo', !isOpen)
    divSexoOpc.style.display = isOpen ? 'none' : 'flex'
})
sexoOpciones.forEach(opc => {
    opc.addEventListener('click', (e) => {
        e.stopPropagation()
        const val = opc.textContent.trim()
        if (val === 'Selecciona un sexo') return
        infoSexoP.textContent = val[0]
        infoSexoP.style.color = '#333'
        svgSexo.classList.remove('activo')
        divSexoOpc.style.display = 'none'
    })
})

const selectSangre = document.querySelector('.overlay_editar_exp .sangre')
const divSangreOpc = selectSangre.querySelector('.div_sangres')
const svgSangre = selectSangre.querySelector('.svg_select')
const infoSangreP = selectSangre.querySelector('.info_sangre p')
const sangreOpciones = divSangreOpc.querySelectorAll('p')

selectSangre.addEventListener('click', (e) => {
    e.stopPropagation()
    const isOpen = divSangreOpc.style.display === 'flex'
    svgSangre.classList.toggle('activo', !isOpen)
    divSangreOpc.style.display = isOpen ? 'none' : 'flex'
})
sangreOpciones.forEach(opc => {
    opc.addEventListener('click', (e) => {
        e.stopPropagation()
        const val = opc.textContent.trim()
        if (val === 'Selecciona un tipo de sangre') return
        infoSangreP.textContent = val
        infoSangreP.style.color = '#333'
        svgSangre.classList.remove('activo')
        divSangreOpc.style.display = 'none'
    })
})

const mesesNombres = ['Mes','Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const selectMes = document.querySelector('.select_mes_Editar')
const divMesOpc = selectMes.querySelector('.div_mes_Editar')
const svgMes = selectMes.querySelector('.svg_select')
const infoMesP = selectMes.querySelector('.info_mes_Editar p')

selectMes.addEventListener('click', (e) => {
    e.stopPropagation(); cerrarTodosExcepto('mes')
    const isOpen = divMesOpc.style.display === 'flex'
    svgMes.classList.toggle('activo', !isOpen)
    divMesOpc.style.display = isOpen ? 'none' : 'flex'
})
divMesOpc.querySelectorAll('p[data-val]').forEach(opc => {
    opc.addEventListener('click', (e) => {
        e.stopPropagation()
        const val = opc.dataset.val
        infoMesP.textContent = mesesNombres[Number(val)]
        infoMesP.style.color = '#333'
        svgMes.classList.remove('activo')
        divMesOpc.style.display = 'none'
        const anio = document.querySelector('[name="anioAgregar"]').value.trim()
        generarDias(val, anio)
    })
})

const selectDia = document.querySelector('.select_dia_Editar')
const divDiaOpc = selectDia.querySelector('.div_dia_Editar')
const svgDia = selectDia.querySelector('.svg_select')
const infoDiaP = selectDia.querySelector('.info_dia_Editar p')

selectDia.addEventListener('click', (e) => {
    e.stopPropagation(); cerrarTodosExcepto('dia')
    const isOpen = divDiaOpc.style.display === 'flex'
    svgDia.classList.toggle('activo', !isOpen)
    divDiaOpc.style.display = isOpen ? 'none' : 'flex'
})

function generarDias(mesVal, anioVal){
    const diaActual = infoDiaP.textContent.trim()
    const totalDias = (mesVal && anioVal)
        ? new Date(Number(anioVal), Number(mesVal), 0).getDate() : 31

    divDiaOpc.innerHTML = '<p>Día</p>'
    for (let d = 1; d <= totalDias; d++) {
        const p = document.createElement('p')
        p.dataset.val = String(d).padStart(2, '0')
        p.textContent = d
        divDiaOpc.appendChild(p)
    }
    divDiaOpc.querySelectorAll('p[data-val]').forEach(opc => {
        opc.addEventListener('click', (e) => {
            e.stopPropagation()
            infoDiaP.textContent = opc.dataset.val
            infoDiaP.style.color = '#333'
            svgDia.classList.remove('activo')
            divDiaOpc.style.display = 'none'
        })
    })
    const diasDisponibles = Array.from(divDiaOpc.querySelectorAll('p[data-val]')).map(p => p.dataset.val)
    if(!diasDisponibles.includes(diaActual)){ infoDiaP.textContent = 'Día'; infoDiaP.style.color = '' }
}; generarDias(null, null)

function cerrarTodosExcepto(excepto){
    if(excepto !== 'sexo'){ svgSexo.classList.remove('activo'); divSexoOpc.style.display = 'none' }
    if(excepto !== 'sangre'){ svgSangre.classList.remove('activo'); divSangreOpc.style.display = 'none' }
    if(excepto !== 'mes'){ svgMes.classList.remove('activo'); divMesOpc.style.display = 'none' }
    if(excepto !== 'dia'){ svgDia.classList.remove('activo'); divDiaOpc.style.display = 'none' }
}
document.addEventListener('click', () => cerrarTodosExcepto(null))

const checkOtro = document.getElementById('checkOtro')
const inputOtro = document.querySelector('.input_habito_otro')
if(checkOtro && inputOtro){
    checkOtro.addEventListener('change', () => {
        inputOtro.disabled = !checkOtro.checked
        if (checkOtro.checked) inputOtro.focus()
        else inputOtro.value = ''
    })
}

const idPaciente = localStorage.getItem('idPaciente')

async function cargarExpediente(id) {
    try {
        const resPaciente = await fetch(`http://localhost/clinicadental/base_de_datos.php?action=obtener_paciente&id=${id}`)
        const paciente = await resPaciente.json()

        const resAnt = await fetch(`http://localhost/clinicadental/base_de_datos.php?action=obtener_antecedmed&id=${id}`)
        const ant = await resAnt.json()

        if(paciente){
            const [anio, mes, dia] = (paciente.fecha_nac || '').split('-')
            const habitos = ant?.habitos ? ant.habitos.split(', ').filter(Boolean) : []

            llenarExpediente({
                ID: String(paciente.id_paciente).padStart(2, '0'),
                nombre: paciente.nombre,
                anio, mes, dia,
                telefono: paciente.telefono,
                correo: paciente.correo,
                sexo: paciente.sexo,
                tipoSangre: paciente.tipo_sangre,
                direccion: paciente.direccion,
                emergencia: paciente.tel_emergencia,
                alergias: ant?.alergias || '',
                medicamentos: ant?.med_act || '',
                cirugias: ant?.cir_prev || '',
                enfermedades: ant?.enfermedades || '',
                habitos
            })
        } else { vaciarInformacion() }

    } catch(error){
        console.error('Error cargando expediente:', error)
        vaciarInformacion()
    }
}

if(idPaciente){ cargarExpediente(idPaciente) }
else { vaciarInformacion() }

btnEditarExp.addEventListener('click', async () => {
    const id = localStorage.getItem('idPaciente')
    if(!id){ return }

    try {
        const resPaciente = await fetch(`http://localhost/clinicadental/base_de_datos.php?action=obtener_paciente&id=${id}`)
        const paciente = await resPaciente.json()
        const resAnt = await fetch(`http://localhost/clinicadental/base_de_datos.php?action=obtener_antecedmed&id=${id}`)
        const ant = await resAnt.json()

        if(!paciente) return

        const [anio, mes, dia] = (paciente.fecha_nac || '').split('-')
        const nombreMes = mesesNombres[Number(mes)] || 'Mes'

        document.querySelector('[name="nombreEditar"]').value = paciente.nombre || ''

        const sexoVal = paciente.sexo || ''
        infoSexoP.textContent = (sexoVal === 'Masculino') ? 'M' : (sexoVal === 'Femenino') ? 'F' : (sexoVal || 'Selecciona un sexo')
        infoSexoP.style.color = sexoVal ? '#333' : ''

        document.querySelector('[name="anioAgregar"]').value = anio || ''
        infoMesP.textContent = nombreMes
        infoMesP.style.color = mes ? '#333' : ''
        infoDiaP.textContent = dia || 'Día'
        infoDiaP.style.color = dia ? '#333' : ''

        document.querySelector('[name="telefonoEditar"]').value = paciente.telefono ? paciente.telefono.replace(/-/g, '') : ''
        document.querySelector('[name="correoEditar"]').value = paciente.correo || ''
        document.querySelector('[name="direccionEditar"]').value = paciente.direccion || ''
        document.querySelector('[name="emergenciaEditar"]').value = paciente.tel_emergencia ? paciente.tel_emergencia.replace(/-/g, '') : ''

        infoSangreP.textContent = paciente.tipo_sangre || 'Selecciona un tipo de sangre:'
        infoSangreP.style.color = paciente.tipo_sangre ? '#333' : ''

        document.querySelector('[name="alergiasEditar"]').value = ant?.alergias || ''
        document.querySelector('[name="medActEditar"]').value = ant?.med_act || ''
        document.querySelector('[name="cirugiasEditar"]').value = ant?.cir_prev || ''
        document.querySelector('[name="enfEditar"]').value = ant?.enfermedades || ''

        const habitosGuardados = ant?.habitos ? ant.habitos.split(', ').filter(Boolean) : []
        const habitosMap = {
            'Fumar': 'habitoFumar',
            'Consumir refrescos frecuentemente': 'habitoRefrescos',
            'Consumir dulces frecuentemente': 'habitoDulces',
            'Bruxismo (rechinar dientes)': 'habitoBruxismo',
            'Morder uñas': 'habitoUnias',
            'Masticar hielo': 'habitoHielo',
            'Respirar por la boca': 'habitoRespiracion',
            'Apretar dientes por estrés': 'habitoEstres'
        }
        Object.values(habitosMap).forEach(name => {
            const cb = document.querySelector(`[name="${name}"]`)
            if(cb) cb.checked = false
        })
        if(checkOtro){ checkOtro.checked = false; inputOtro.disabled = true; inputOtro.value = '' }

        habitosGuardados.forEach(habito => {
            if(habitosMap[habito]){
                const cb = document.querySelector(`[name="${habitosMap[habito]}"]`)
                if(cb) cb.checked = true
            }
            if(habito.startsWith('Otro:') && checkOtro){
                checkOtro.checked = true
                inputOtro.disabled = false
                inputOtro.value = habito.replace('Otro:', '').trim()
            }
        }); generarDias(mes, anio)

        multiFormulario("200", seccionesForm[0], seccionesForm[1], seccionesForm[2])
        btnPrevForm.classList.add('desactivado')
        btnNextForm.classList.remove('desactivado')
        i = 200
        overlayEditarExp.style.display = 'flex'

    } catch(error){ console.error('Error abriendo editor:', error) }
})

btnConfEditar.addEventListener('click', async () => {
    const id = localStorage.getItem('idPaciente')
    if(!id) return

    const nuevoNombre = document.querySelector('[name="nombreEditar"]').value.trim()
    const nuevoSexoRaw = infoSexoP.textContent.trim()
    const nuevoSexo = (nuevoSexoRaw === 'M') ? 'Masculino' : (nuevoSexoRaw === 'F') ? 'Femenino' : nuevoSexoRaw
    const nuevoAnio = document.querySelector('[name="anioAgregar"]').value.trim()
    const nuevoMes = infoMesP.textContent !== 'Mes'
        ? String(mesesNombres.indexOf(infoMesP.textContent)).padStart(2,'0') : ''
    const nuevoDia = infoDiaP.textContent !== 'Día' ? infoDiaP.textContent : ''
    let nuevoTelefono = document.querySelector('[name="telefonoEditar"]').value.trim()
    const nuevoCorreo = document.querySelector('[name="correoEditar"]').value.trim()
    const nuevaDireccion = document.querySelector('[name="direccionEditar"]').value.trim()
    let nuevoEmergencia = document.querySelector('[name="emergenciaEditar"]').value.trim()
    const nuevoTipoSangre = infoSangreP.textContent.trim() === 'Selecciona un tipo de sangre:' ? '' : infoSangreP.textContent.trim()
    const nuevasAlergias = document.querySelector('[name="alergiasEditar"]').value.trim()
    const nuevosMeds = document.querySelector('[name="medActEditar"]').value.trim()
    const nuevasCirugias = document.querySelector('[name="cirugiasEditar"]').value.trim()
    const nuevasEnf = document.querySelector('[name="enfEditar"]').value.trim()

    if(!nuevoNombre || !nuevoTelefono || !nuevoCorreo){ mostrarAlerta(); return }

    nuevoTelefono = nuevoTelefono.replace(/-/g, '')
    nuevoTelefono = `${nuevoTelefono.slice(0,2)}-${nuevoTelefono.slice(2,6)}-${nuevoTelefono.slice(6,10)}`
    nuevoEmergencia = nuevoEmergencia.replace(/-/g, '')
    nuevoEmergencia = `${nuevoEmergencia.slice(0,2)}-${nuevoEmergencia.slice(2,6)}-${nuevoEmergencia.slice(6,10)}`

    const habitosMap = {
        'habitoFumar': 'Fumar',
        'habitoRefrescos': 'Consumir refrescos frecuentemente',
        'habitoDulces': 'Consumir dulces frecuentemente',
        'habitoBruxismo': 'Bruxismo (rechinar dientes)',
        'habitoUnias': 'Morder uñas',
        'habitoHielo': 'Masticar hielo',
        'habitoRespiracion': 'Respirar por la boca',
        'habitoEstres': 'Apretar dientes por estrés'
    }
    const nuevosHabitos = []
    Object.entries(habitosMap).forEach(([name, label]) => {
        const cb = document.querySelector(`[name="${name}"]`)
        if(cb?.checked) nuevosHabitos.push(label)
    })
    if(checkOtro?.checked && inputOtro.value.trim()){ nuevosHabitos.push(`Otro: ${inputOtro.value.trim()}`) }

    const fechaNac = (nuevoAnio && nuevoMes && nuevoDia) ? `${nuevoAnio}-${nuevoMes}-${nuevoDia}` : ''

    const datosEditar = {
        id_paciente: id,
        nombre: nuevoNombre,
        fecha_nac: fechaNac,
        telefono: nuevoTelefono,
        correo: nuevoCorreo,
        sexo: nuevoSexo,
        tipo_sangre: nuevoTipoSangre,
        direccion: nuevaDireccion,
        emergencia: nuevoEmergencia,
        alergias: nuevasAlergias,
        med_act: nuevosMeds,
        cir_prev: nuevasCirugias,
        enfermedades: nuevasEnf,
        habitos: nuevosHabitos
    }

    try {
        await fetch('http://localhost/clinicadental/base_de_datos.php?action=editar_paciente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosEditar)
        })
        overlayEditarExp.style.display = 'none'
        cargarExpediente(id)
    } catch(error){ console.error('Error guardando edición:', error) }
})

cerrarForm.forEach(cerrar => {
    cerrar.addEventListener('click', () => { overlayEditarExp.style.display = 'none' })
})

seccionesForm[0].addEventListener('click', () => {
    multiFormulario("200", seccionesForm[0], seccionesForm[1], seccionesForm[2])
    btnPrevForm.classList.add('desactivado'); btnNextForm.classList.remove('desactivado'); i = 200
})
seccionesForm[1].addEventListener('click', () => {
    multiFormulario(0, seccionesForm[1], seccionesForm[0], seccionesForm[2])
    btnPrevForm.classList.remove('desactivado'); btnNextForm.classList.remove('desactivado'); i = 0
})
seccionesForm[2].addEventListener('click', () => {
    multiFormulario("-200", seccionesForm[2], seccionesForm[0], seccionesForm[1])
    btnPrevForm.classList.remove('desactivado'); btnNextForm.classList.add('desactivado'); i = -200
})
btnPrevForm.addEventListener('click', () => {
    if(i >= 200) return
    i += 200
    if(i === 200) btnPrevForm.classList.add('desactivado')
    btnNextForm.classList.remove('desactivado')
    actualizarBtns()
    carruselForm.style.marginLeft = `${i}%`
})
btnNextForm.addEventListener('click', () => {
    if(i <= -200) return
    i -= 200
    if(i === -200) btnNextForm.classList.add('desactivado')
    btnPrevForm.classList.remove('desactivado')
    actualizarBtns()
    carruselForm.style.marginLeft = `${i}%`
})

function multiFormulario(marginLeft, valor0, valor1, valor2){
    carruselForm.style.marginLeft = `${marginLeft}%`
    valor0.classList.add('activo')
    valor1.classList.remove('activo')
    valor2.classList.remove('activo')
}
function actualizarBtns(){
    if(i === -200) multiFormulario("-200", seccionesForm[2], seccionesForm[0], seccionesForm[1])
    if(i === 0) multiFormulario(0, seccionesForm[1], seccionesForm[0], seccionesForm[2])
    if(i === 200) multiFormulario("200", seccionesForm[0], seccionesForm[1], seccionesForm[2])
}

function llenarExpediente(p){
    calcularEdad(p.anio, p.mes, p.dia)

    IDPaciente.textContent = `#${p.ID}`
    nombrePaciente.textContent = p.nombre || 'Sin registro'
    fechaNacPaciente.textContent = (p.anio && p.mes && p.dia) ? `${p.anio}-${p.mes}-${p.dia}` : 'Sin registro'
    telefonoPaciente.textContent = p.telefono || 'Sin registro'
    correoPaciente.textContent = p.correo || 'Sin registro'
    dirPaciente.textContent = p.direccion || 'Sin registro'
    contactoPaciente.textContent = p.emergencia || 'Sin registro'
    sexoPaciente.textContent = p.sexo || 'Sin registro'

    tipoSangrePaciente.textContent = p.tipoSangre || 'Sin registro'
    alergiasPaciente.textContent = p.alergias || 'Sin registro'
    medicamentosPaciente.textContent = p.medicamentos || 'Sin registro'
    cirugPrevPaciente.textContent = p.cirugias || 'Sin registro'
    enfSistemPaciente.textContent = p.enfermedades || 'Sin registro'

    const divHabitos = document.querySelector('.div_habitos')
    divHabitos.innerHTML = ''
    const habs = Array.isArray(p.habitos) ? p.habitos : (p.habitos ? p.habitos.split(', ').filter(Boolean) : [])
    if(habs.length > 0){
        habs.forEach(h => {
            const div = document.createElement('div')
            div.classList.add('habito_item')
            div.innerHTML = `<span class="valor">${h}</span>`
            divHabitos.appendChild(div)
        })
    } else{
        const div = document.createElement('div')
        div.classList.add('habito_item')
        div.innerHTML = '<span class="valor">Sin hábitos registrados</span>'
        divHabitos.appendChild(div)
    }; cargarConsulta(p.ID)
}

function vaciarInformacion(){
    IDPaciente.textContent = '#N'
    nombrePaciente.textContent = 'Sin registro'
    fechaNacPaciente.textContent = '-'
    telefonoPaciente.textContent = '-'
    correoPaciente.textContent = '-'
    dirPaciente.textContent = '-'
    contactoPaciente.textContent = '-'
    sexoPaciente.textContent = '-'
    tipoSangrePaciente.textContent = '-'
    alergiasPaciente.textContent = '-'
    medicamentosPaciente.textContent = '-'
    cirugPrevPaciente.textContent = '-'
    enfSistemPaciente.textContent = '-'
    const divHabitos = document.querySelector('.div_habitos')
    if(divHabitos) divHabitos.innerHTML = ''
}

inputBusqueda.addEventListener('input', async () => {
    const termino = inputBusqueda.value.trim()
    if(termino === ''){
        if(idPaciente) cargarExpediente(idPaciente)
        else vaciarInformacion()
        return
    }
    try {
        const res = await fetch(`http://localhost/clinicadental/base_de_datos.php?action=obtener_paciente&id=${termino}`)
        const paciente = await res.json()
        if(paciente){
            const resAnt = await fetch(`http://localhost/clinicadental/base_de_datos.php?action=obtener_antecedmed&id=${termino}`)
            const ant = await resAnt.json()
            const [anio, mes, dia] = (paciente.fecha_nac || '').split('-')
            const habitos = ant?.habitos ? ant.habitos.split(', ').filter(Boolean) : []
            llenarExpediente({
                ID: String(paciente.id_paciente).padStart(2, '0'),
                nombre: paciente.nombre,
                anio, mes, dia,
                telefono: paciente.telefono,
                correo: paciente.correo,
                sexo: paciente.sexo,
                tipoSangre: paciente.tipo_sangre,
                direccion: paciente.direccion,
                emergencia: paciente.tel_emergencia,
                alergias: ant?.alergias || '',
                medicamentos: ant?.med_act || '',
                cirugias: ant?.cir_prev || '',
                enfermedades: ant?.enfermedades || '',
                habitos
            })
        } else { vaciarInformacion() }
    } catch(error){ vaciarInformacion() }
})

cerrarPopups.forEach(btnCerrar => {
    btnCerrar.addEventListener('click', () => {
        overlayEditarExp.style.display = 'none'
        overlayConsulta.style.display = 'none'
    })
})

const btnLlenarConsulta = document.querySelector('.btn_consulta')
const overlayConsulta = document.querySelector('.overlay_llenar_consulta')
const cerrarConsulta = document.querySelector('.cerrar_consulta')
const btnConfConsulta = document.querySelector('.btn_conf_consulta')

cerrarConsulta.addEventListener('click', () => { overlayConsulta.style.display = 'none' })
overlayConsulta.addEventListener('click', (e) => { if(e.target === overlayConsulta) overlayConsulta.style.display = 'none' })

btnLlenarConsulta.addEventListener('click', () => {
    const idActual = IDPaciente.textContent.replace('#', '').trim()
    if(idActual && idActual !== '-' && idActual !== 'N'){
        const consultas = JSON.parse(localStorage.getItem('consultas') || '{}')
        const consultaGuardada = consultas[idActual]
        if(consultaGuardada){
            document.querySelector('[name="diagnosticoConsulta"]').value = consultaGuardada.diagnostico || ''
            document.querySelector('[name="tratamientoConsulta"]').value = consultaGuardada.tratamiento || ''
            document.querySelector('[name="observacionesConsulta"]').value = consultaGuardada.observaciones || ''
        } else {
            document.querySelector('[name="diagnosticoConsulta"]').value = ''
            document.querySelector('[name="tratamientoConsulta"]').value = ''
            document.querySelector('[name="observacionesConsulta"]').value = ''
        }
    }
    overlayConsulta.style.display = 'flex'
})

btnConfConsulta.addEventListener('click', () => {
    const diag = document.querySelector('[name="diagnosticoConsulta"]').value.trim()
    const trat = document.querySelector('[name="tratamientoConsulta"]').value.trim()
    const obs  = document.querySelector('[name="observacionesConsulta"]').value.trim()

    if(diag === '' || trat === '' || obs === ''){ mostrarAlerta(); return }

    document.querySelector('.diagnostico').textContent = diag
    document.querySelector('.tratamiento').textContent = trat
    document.querySelector('.observaciones').textContent = obs

    const idActual = IDPaciente.textContent.replace('#', '').trim()
    if(idActual && idActual !== '-' && idActual !== 'N'){
        const consultas = JSON.parse(localStorage.getItem('consultas') || '{}')
        consultas[idActual] = { diagnostico: diag, tratamiento: trat, observaciones: obs }
        localStorage.setItem('consultas', JSON.stringify(consultas))
    }
    overlayConsulta.style.display = 'none'
})

function cargarConsulta(id){
    const idLimpio = String(id).trim()
    const consultas = JSON.parse(localStorage.getItem('consultas') || '{}')
    const c = consultas[idLimpio]
    document.querySelector('.diagnostico').textContent = c?.diagnostico || '-'
    document.querySelector('.tratamiento').textContent = c?.tratamiento || '-'
    document.querySelector('.observaciones').textContent = c?.observaciones || '-'
}

function calcularEdad(anioNac, mesNac, diaNac){
    const a = Number(anioNac), m = Number(mesNac), d = Number(diaNac)
    let edad = anioHoy - a
    if(mesHoy < m || (mesHoy === m && diaHoy < d)) edad--
    return edad
}

function mostrarAlerta(){
    alerta.style.top = '5%'
    setTimeout(() => { alerta.style.top = '-10%' }, 3000)
}