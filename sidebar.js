const usuario = localStorage.getItem('usuario')
const sexoSaludo = localStorage.getItem('sexo')
const rolUsuario = localStorage.getItem('rol')

const nombreUsuario = document.querySelectorAll('.usuario')
const sexoSaludoUsuario = document.querySelectorAll('.saludo_sexo')
const usuarioPuesto = document.querySelectorAll('.usuario_puesto')

async function infoUsuario(){
    const idUsuario = localStorage.getItem('id_usuario')
    if(!idUsuario) return

    try{
        const response = await fetch(`http://localhost/clinicadental/base_de_datos.php?action=obtener_usuario&id=${idUsuario}`)
        const user = await response.json()
        if(!user) return

        localStorage.setItem('usuario', user.usuario)
        localStorage.setItem('sexo', user.sexo)
        localStorage.setItem('rol', user.rol)

        nombreUsuario.forEach(el => el.textContent = user.usuario)

        if(user.rol === 'Asistente'){
            sexoSaludoUsuario.forEach(span => span.textContent = '')
            usuarioPuesto.forEach(span => span.textContent = 'Asistente')
        } else if(user.rol === 'Doctor'){
            if(user.sexo === 'Masculino'){
                sexoSaludoUsuario.forEach(span => span.textContent = 'Dr.')
                usuarioPuesto.forEach(span => span.textContent = 'Doctor')
            } else if(user.sexo === 'Femenino'){
                sexoSaludoUsuario.forEach(span => span.textContent = 'Dra.')
                usuarioPuesto.forEach(span => span.textContent = 'Doctora')
            }
        } else{
            sexoSaludoUsuario.forEach(span => span.textContent = '')
            usuarioPuesto.forEach(span => span.textContent = user.rol || '')
        }

    } catch(error){ console.error('Error al cargar la información del usuario:', error) }
}

infoUsuario()

document.querySelectorAll('span.usuario').forEach(el => { el.textContent = usuario || 'Usuario' })

if(sexoSaludo === 'Masculino'){ 
    sexoSaludoUsuario.forEach(span => span.textContent = 'Dr.')
    usuarioPuesto.forEach(span => span.textContent = 'Doctor' )
} else if(sexoSaludo === 'Femenino'){ 
    sexoSaludoUsuario.forEach(span => span.textContent = 'Dra.') 
    usuarioPuesto.forEach(span => span.textContent = 'Doctora' )
} else{ usuarioPuesto.forEach(span => span.textContent = '' ) }

if(rolUsuario === "Asistente"){ 
    usuarioPuesto.forEach(span => span.textContent = rolUsuario)
    sexoSaludoUsuario.forEach(span => span.textContent = '')
}

// Textarea
const btnAbrirArea = document.querySelector('.div_abrir_area')
const btnBorrarArea = document.querySelector('.div_borrar_area')
const divArea = document.querySelector('.div_textarea')
const textarea = document.querySelector('.div_textarea textarea')
let abierto = false

let contenidoGuardado = localStorage.getItem('contenido')
if (contenidoGuardado) textarea.value = contenidoGuardado

btnAbrirArea.addEventListener('click', () => {
    if(abierto){
        btnAbrirArea.style.transform = 'rotate(360deg)'
        btnAbrirArea.style.left = '-15%'
        divArea.style.right = '-20%'
        abierto = false
    } else{
        btnAbrirArea.style.transform = 'rotate(180deg)'
        btnAbrirArea.style.left = '-10%'
        divArea.style.right = '0'
        abierto = true
    }
})
document.addEventListener('click', (e) => {
    if(!divArea.contains(e.target) && !btnAbrirArea.contains(e.target) && abierto){ divArea.style.right = '-20%'; abierto = false }
})
btnBorrarArea.addEventListener('click', () => {
    textarea.value = ""
    contenidoGuardado = textarea.value
    localStorage.setItem('contenido', textarea.value)
})
textarea.addEventListener('input', () => { localStorage.setItem('contenido', textarea.value) })