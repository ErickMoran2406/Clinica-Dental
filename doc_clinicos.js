const search = document.querySelector('.input_busqueda')
const tablaCuerpo = document.querySelector('.tabla_cuerpo')
const inputBusqueda = document.querySelector('.input_busqueda')
const archivoVista = document.querySelector('.archivo')
const docAgrandar = document.querySelector('.agrandar_doc')
const overlay = document.querySelector('.overlay')
const cerrarDoc = document.querySelector('.cerrar_doc')
const tituloArchivo = document.querySelector('.titulo_archivo')
const embed = document.querySelector('embed')
const textoSinDocs = document.querySelector('.sin_docs')
const linkDescarga = document.querySelector('.btn_fullscreen a')
const overlayNuevoDoc = document.querySelector('.overlay_nuevo_doc')
const btnNuevoDoc = document.querySelector('.btn_nuevo_doc')
const btnAgregarDoc = document.querySelector('.btn_agregar_doc')
const cerrarNuevoDoc = document.querySelector('.cerrar_nuevo_doc')
const inputSubirArchivo = document.querySelector('.subirArchivo')
const eliminarDocOverlay = document.querySelector('.eliminar_doc')

let filaSeleccionada = null
let docActivo = null
let pacienteIDSeleccionado = null

async function guardarDocumento(pacienteID, archivo){
    const formData = new FormData()
    formData.append('id_paciente', pacienteID)
    formData.append('id_usuario', 1)
    formData.append('archivo', archivo)

    const res = await fetch('http://localhost/clinicadental/base_de_datos.php?action=subir_documento', {
        method: 'POST',
        body: formData
    }); return await res.json()
}

async function obtenerDocumentos(pacienteID){
    const res = await fetch(`http://localhost/clinicadental/base_de_datos.php?action=obtener_documentos&id=${pacienteID}`)
    return await res.json()
}

async function eliminarDocumentoDePaciente(id_doc){
    const res = await fetch('http://localhost/clinicadental/base_de_datos.php?action=eliminar_documento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_doc })
    }); return await res.json()
}

async function cargarPacientes(){
    try{
        const response = await fetch('http://localhost/clinicadental/base_de_datos.php?action=obtener_pacientes')
        const pacientes = await response.json()

        tablaCuerpo.innerHTML = ''

        if(!pacientes || pacientes.length === 0){
            tablaCuerpo.innerHTML = `<tr><td colspan="9" style="color:#888; padding:1rem; text-align:center;">No hay pacientes registrados.</td></tr>`
            return
        }

        pacientes.forEach(p => {
            const img = p.estado === 'Inactivo' ? 'img/inactivo.png' : 'img/activo.png'
            const numero = String(p.id_paciente).padStart(2, '0')
            const fila = document.createElement('tr')
            fila.classList.add('tabla_filas')
            fila.dataset.idPaciente = p.id_paciente
            fila.dataset.nombre = p.nombre
            fila.innerHTML = `
                <td><input type="checkbox" class="check_paciente"></td>
                <td><span>${numero}</span></td>
                <td>${p.nombre}</td>
                <td>${p.fecha_nac}</td>
                <td>${p.telefono}</td>
                <td>${p.correo}</td>
                <td>${p.sexo || ''}</td>
                <td>${p.tipo_sangre}</td>
                <td class="estado"><img src="${img}" alt=""></td>
            `; tablaCuerpo.appendChild(fila)
        })

    } catch(error){ console.error('Error cargando pacientes:', error) }
}; cargarPacientes()

function limpiarDocs(){
    const divDocsContenedor = document.querySelector('.div_docs')
    divDocsContenedor.querySelectorAll('p').forEach(p => p.remove())
    textoSinDocs.style.display = 'none'
}

async function cargarDocsDelPaciente(pacienteID) {
    limpiarDocs()
    const divDocsContenedor = document.querySelector('.div_docs')
    const docs = await obtenerDocumentos(pacienteID)

    if(docs.length === 0){ textoSinDocs.style.display = 'block'; return }

    textoSinDocs.style.display = 'none'
    docs.forEach(doc => {
        const urlArchivo = `http://localhost/clinicadental/${doc.ruta_archivo}`
        const nuevoDoc = document.createElement('p')
        nuevoDoc.textContent = doc.nom_archivo
        nuevoDoc.dataset.idDoc = doc.id_docs
        nuevoDoc.dataset.nombre = doc.nom_archivo
        nuevoDoc.style.display = 'block'
        divDocsContenedor.appendChild(nuevoDoc)

        nuevoDoc.addEventListener('click', () => {
            embed.setAttribute('src', urlArchivo)
            tituloArchivo.textContent = doc.nom_archivo
            linkDescarga.setAttribute('href', urlArchivo)
            linkDescarga.setAttribute('download', doc.nom_archivo)
            docActivo = nuevoDoc
            overlay.style.display = 'flex'
        })
    })
}

tablaCuerpo.addEventListener('click', (e) => {
    if(e.target.classList.contains('check_paciente')) return

    const fila = e.target.closest('.tabla_filas')
    if(!fila) return

    const checkbox = fila.querySelector('.check_paciente')
    const yaSeleccionada = fila.classList.contains('seleccionada')
    const todasLasFilas = tablaCuerpo.querySelectorAll('.tabla_filas')

    todasLasFilas.forEach(f => {
        f.classList.remove('seleccionada')
        const cb = f.querySelector('.check_paciente')
        if(cb) cb.checked = false
    })

    if(!yaSeleccionada){
        fila.classList.add('seleccionada')
        if(checkbox) checkbox.checked = true
        filaSeleccionada = fila
        pacienteIDSeleccionado = fila.dataset.idPaciente
        btnNuevoDoc.classList.add('activo')

        todasLasFilas.forEach(f => {
            if(f !== fila) f.style.display = 'none'
        })

        cargarDocsDelPaciente(pacienteIDSeleccionado)
    } else{
        filaSeleccionada = null
        pacienteIDSeleccionado = null
        btnNuevoDoc.classList.remove('activo')
        limpiarDocs()
        textoSinDocs.style.display = 'none'
        todasLasFilas.forEach(f => { f.style.display = '' })
    }
})

inputBusqueda.addEventListener('input', () => {
    const termino = inputBusqueda.value.trim().toLowerCase()
    const filas = tablaCuerpo.querySelectorAll('.tabla_filas')
    filas.forEach(fila => {
        if(fila.classList.contains('seleccionada')) return
        const texto = fila.textContent.toLowerCase()
        fila.style.display = (termino === '' || texto.includes(termino)) ? '' : 'none'
    })
})

btnNuevoDoc.addEventListener('click', () => {
    if(!filaSeleccionada) return
    const numero = filaSeleccionada.cells[1].querySelector('span').textContent.trim()
    const nombre = filaSeleccionada.dataset.nombre
    document.querySelector('input[name="nCita"]').value = numero
    document.querySelector('input[name="nombreCita"]').value = nombre
    inputSubirArchivo.value = ''
    overlayNuevoDoc.style.display = 'flex'
})

btnAgregarDoc.addEventListener('click', async () => {
    const archivo = inputSubirArchivo.files[0]
    if(!archivo || !pacienteIDSeleccionado) return

    const resultado = await guardarDocumento(pacienteIDSeleccionado, archivo)

    if(resultado.success){
        inputSubirArchivo.value = ''
        overlayNuevoDoc.style.display = 'none'
        cargarDocsDelPaciente(pacienteIDSeleccionado)
    } else{ console.error('Error subiendo archivo:', resultado.error) }
})

cerrarNuevoDoc.addEventListener('click', () => { overlayNuevoDoc.style.display = 'none' })

eliminarDocOverlay.addEventListener('click', async () => {
    if(!docActivo || !pacienteIDSeleccionado) return

    const id_doc = docActivo.dataset.idDoc
    await eliminarDocumentoDePaciente(id_doc)

    docActivo.remove()
    docActivo = null
    embed.setAttribute('src', '')
    overlay.style.display = 'none'

    const restantes = document.querySelectorAll('.div_docs p').length
    if(restantes === 0) textoSinDocs.style.display = 'block'
})

docAgrandar.addEventListener('click', () => {
    if(archivoVista.requestFullscreen) archivoVista.requestFullscreen()
})

cerrarDoc.addEventListener('click', () => { overlay.style.display = 'none' })

overlay.addEventListener('click', (e) => { if(e.target === overlay) overlay.style.display = 'none' })