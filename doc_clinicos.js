const search = document.querySelector('.input_busqueda');
const tablaCuerpo = document.querySelector('.tabla_cuerpo');
const filas = document.querySelectorAll('.tabla_filas');
const archivoVista = document.querySelector('.archivo')
const docAgrandar = document.querySelector('.agrandar_doc');
const divDocs = document.querySelectorAll('.div_docs')
const divDocsP = document.querySelectorAll('.div_docs p')
const overlay = document.querySelector('.overlay')
const cerrarDoc = document.querySelector('.cerrar_doc')
const tituloArchivo = document.querySelector('.titulo_archivo')
let filaSeleccionada = null;

const embed = document.querySelector('embed')
const textoSinDocs = document.querySelector('.sin_docs')
const linkDescarga = document.querySelector('.btn_fullscreen a');
let linkPDF = embed.getAttribute("src")
let tituloPDF = linkPDF.split("/").pop()
let tieneDocs = false, docActivo = null;

const overlayNuevoDoc = document.querySelector('.overlay_nuevo_doc')
const btnNuevoDoc = document.querySelector('.btn_nuevo_doc')
const btnAgregarDoc = document.querySelector('.btn_agregar_doc')
const btnEliminarDoc = document.querySelector('.eliminar_doc')
const cerrarNuevoDoc = document.querySelector('.cerrar_nuevo_doc')
const inputSubirArchivo = document.querySelector('.subirArchivo')

inputSubirArchivo.addEventListener('change', () => {
    const archivo = inputSubirArchivo.files[0]

    if(archivo){
        const nombreArchivo = archivo.name
        console.log(nombreArchivo)
    }
})

btnNuevoDoc.addEventListener('click', () => { 
    const checkboxMarcado = tablaCuerpo.querySelector('input[type="checkbox"]:checked');
    if (!checkboxMarcado) return;

    filaSeleccionada = checkboxMarcado.closest('.tabla_filas');

    document.querySelector('input[name="nCita"]').value = filaSeleccionada.cells[1].textContent.trim();
    document.querySelector('input[name="nombreCita"]').value = filaSeleccionada.cells[2].textContent.trim();
    document.querySelector('input[name="edadCita"]').value = filaSeleccionada.cells[3].textContent.trim();
    overlayNuevoDoc.style.display = 'flex' 
})
btnAgregarDoc.addEventListener('click', () => {
    const archivo = inputSubirArchivo.files[0];
    if (!archivo) return;

    const urlArchivo = URL.createObjectURL(archivo);
    const nombreArchivo = archivo.name;

    const divDocsContenedor = document.querySelector('.div_docs');
    const nuevoDoc = document.createElement('p');
    nuevoDoc.textContent = nombreArchivo;
    nuevoDoc.dataset.src = urlArchivo;
    nuevoDoc.style.display = 'block';
    divDocsContenedor.appendChild(nuevoDoc);

    nuevoDoc.addEventListener('click', () => {
        embed.setAttribute('src', urlArchivo);
        tituloArchivo.textContent = nombreArchivo;
        linkDescarga.setAttribute('href', urlArchivo);     
        linkDescarga.setAttribute('download', nombreArchivo);
        docActivo = nuevoDoc;
        overlay.style.display = 'flex';
    });

    inputSubirArchivo.value = '';
    textoSinDocs.style.display = 'none'; tieneDocs = true; 
    overlayNuevoDoc.style.display = 'none';
});
cerrarNuevoDoc.addEventListener('click', () => { overlayNuevoDoc.style.display = 'none' })

const eliminarDocOverlay = document.querySelector('.eliminar_doc');

eliminarDocOverlay.addEventListener('click', () => {
    if (!docActivo) return;

    URL.revokeObjectURL(docActivo.dataset.src);

    docActivo.remove();
    docActivo = null;

    embed.setAttribute('src', '');
    overlay.style.display = 'none';

    const docsRestantes = document.querySelectorAll('.div_docs p');
    if(docsRestantes.length === 0){
        textoSinDocs.style.display = 'block';
        tieneDocs = false;
    }
});

docAgrandar.addEventListener('click', () => {
    if(docAgrandar.requestFullscreen){
        archivoVista.requestFullscreen();
    }
});

divDocs.forEach(p => {
    if(tieneDocs){
        p.addEventListener('click', () => { overlay.style.display = 'flex'; });
        tituloArchivo.textContent = tituloPDF
    }
});

cerrarDoc.addEventListener('click', () => {
    overlay.style.display = 'none';
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.style.display = 'none';
});

filas.forEach(fila => {
    fila.addEventListener('click', (e) => {
        if(!tieneDocs){ textoSinDocs.style.display = 'block'; }
        if(e.target.type === 'checkbox') return;

        if(fila.classList.contains('seleccionada')){
            fila.classList.remove('seleccionada');
            filas.forEach(f => f.style.display = '');
            divDocsP.forEach(link => link.style.display = 'none');
            btnNuevoDoc.classList.remove('activo'); return;
        }

        filas.forEach(f => {
            f.classList.remove('seleccionada');
            f.style.display = 'none';
        });
        fila.style.display = '';
        fila.classList.add('seleccionada');

        divDocsP.forEach(link => link.style.display = 'block');
        btnNuevoDoc.classList.add('activo');
    });
});

search.addEventListener('input', () => {
    const termino = search.value.toLowerCase().trim();

    filas.forEach(f => f.classList.remove('seleccionada'));
    divDocsP.forEach(link => link.style.display = 'none');
    btnNuevoDoc.classList.remove('activo');

    filas.forEach(fila => {
        if(termino === ''){ fila.style.display = 'none'; return; }

        const ID = fila.cells[1].textContent.toLowerCase();
        const nombre = fila.cells[2].textContent.toLowerCase();
        const edad = fila.cells[3].textContent.toLowerCase();
        const telefono = fila.cells[4].textContent.toLowerCase();
        const correo = fila.cells[5].textContent.toLowerCase();
        const sexo = fila.cells[6].textContent.toLowerCase();
        const sangre = fila.cells[7].textContent.toLowerCase();
        const estado = (fila.dataset.estado || '').toLowerCase();

        const coincide = [ID, nombre, edad, telefono, correo, sexo, sangre, estado].some(campo => campo.includes(termino));
        fila.style.display = coincide ? '' : 'none';
    });
});

tablaCuerpo.addEventListener('click', (e) => {
    if(e.target.type === 'checkbox' || e.target.closest('.motivo')) return;

    const fila = e.target.closest('.tabla_filas');
    if(!fila) return;

    const checkbox = fila.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;

    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
});