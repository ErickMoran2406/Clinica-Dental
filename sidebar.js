// Textarea
const btnAbrirArea = document.querySelector('.div_abrir_area')
const btnBorrarArea = document.querySelector('.div_borrar_area')
const divArea = document.querySelector('.div_textarea')
const textarea = document.querySelector('.div_textarea textarea')
let abierto = false

let contenidoGuardado = localStorage.getItem('contenido')
if (contenidoGuardado) textarea.value = contenidoGuardado

btnAbrirArea.addEventListener('click', () => {
    if (abierto) {
        divArea.style.right = '-20%'
        abierto = false
    } else {
        divArea.style.right = '0'
        abierto = true
    }
})
document.addEventListener('click', (e) => {
    if (!divArea.contains(e.target) && !btnAbrirArea.contains(e.target) && abierto){
        divArea.style.right = '-20%'; abierto = false
    }
})
btnBorrarArea.addEventListener('click', () => {
    textarea.value = ""
    contenidoGuardado = textarea.value
    localStorage.setItem('contenido', textarea.value)
})
textarea.addEventListener('input', () => {
    localStorage.setItem('contenido', textarea.value)
})