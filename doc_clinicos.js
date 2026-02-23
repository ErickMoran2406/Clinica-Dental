const search = document.querySelector('.input_busqueda');
const tablaCuerpo = document.querySelector('.tabla_cuerpo');
const filas = document.querySelectorAll('.tabla_filas');
const archivoVista = document.querySelector('.archivo')
const docAgrandar = document.querySelector('.agrandar_doc');
const divDocs = document.querySelectorAll('.div_docs p')
const overlay = document.querySelector('.overlay')
const cerrarDoc = document.querySelector('.cerrar_doc')
const tituloArchivo = document.querySelector('.titulo_archivo')

const embed = document.querySelector('embed')
let linkPDF = embed.getAttribute("src")
let tituloPDF = linkPDF.split("/").pop()

const overlayNuevoDoc = document.querySelector('.overlay_nuevo_doc')
const btnNuevoDoc = document.querySelector('.btn_nuevo_doc')
const cerrarNuevoDoc = document.querySelector('.cerrar_nuevo_doc')
const inputSubirArchivo = document.querySelector('.subirArchivo')

inputSubirArchivo.addEventListener('change', () => {
    const archivo = inputSubirArchivo.files[0]

    if(archivo){
        const nombreArchivo = archivo.name
        console.log(nombreArchivo)
    }
})

btnNuevoDoc.addEventListener('click', () => { overlayNuevoDoc.style.display = 'flex' })
cerrarNuevoDoc.addEventListener('click', () => { overlayNuevoDoc.style.display = 'none' })

docAgrandar.addEventListener('click', () => {
    if(docAgrandar.requestFullscreen){
        archivoVista.requestFullscreen();
    }
});

divDocs.forEach(p => {
    p.addEventListener('click', () => {
        overlay.style.display = 'flex';
    });
    tituloArchivo.textContent = tituloPDF
});

cerrarDoc.addEventListener('click', () => {
    overlay.style.display = 'none';
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.style.display = 'none';
});

filas.forEach(fila => fila.style.display = 'none');

search.addEventListener('input', () => {
    const termino = search.value.toLowerCase().trim();
    
    filas.forEach(fila => {
        if(termino === ''){ 
            fila.style.display = 'none';
            divDocs.forEach(link => { link.style.display = 'none'; btnNuevoDoc.classList.remove('activo') });
            return; 
        }
        
        const ID = fila.cells[0].textContent.toLowerCase();
        const nombre = fila.cells[1].textContent.toLowerCase();
        const edad = fila.cells[2].textContent.toLowerCase();
        const fecha_nac = fila.cells[3].textContent.toLowerCase();
        const sexo = fila.cells[4].textContent.toLowerCase();
        const tipo_sangre = fila.cells[5].textContent.toLowerCase();
        // const telefono = fila.cells[6].textContent.toLowerCase();
        const estado = fila.cells[7].textContent.toLowerCase();
        
        if (nombre.includes(termino) || ID.includes(termino) || edad.includes(termino) || fecha_nac.includes(termino) || sexo.includes(termino) || tipo_sangre.includes(termino) || estado.includes(termino)){
            fila.style.display = ''; console.log('uwu')
        } else{ fila.style.display = 'none'; console.log('jijija') }

        fila.addEventListener('click', () => { 
            divDocs.forEach(link => {  
                link.style.display = 'block';
                btnNuevoDoc.classList.add('activo') 
            }); 
        })
    });
});