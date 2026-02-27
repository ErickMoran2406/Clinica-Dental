const contenedor = document.querySelector('.contenedor');
const registroBtn = document.querySelector('.btn_registro');
const loginBtn = document.querySelector('.btn_login');

// Credenciales
let nombreUsuario = null
let passUsuario = null

function iniciarSesion(nombre, pass){ nombreUsuario = nombre; passUsuario = pass }
iniciarSesion("Erick", "123456");

const inputUsuarioInicio = document.querySelector('.usuario_inicio')
const inputPassInicio = document.querySelector('.pass_inicio')
const btnIncioSesion = document.querySelector('.btn_inicio')

const inputUsuarioRegistro = document.querySelector('.usuario_registro')
const inputPassRegistro = document.querySelector('.pass_registro')
const btnRegistro = document.querySelector('.btn_registrarse')


// Inicio de Sesión.
btnIncioSesion.addEventListener('click', (e) => {
    const usuario = inputUsuarioInicio.value.trim()
    const pass = inputPassInicio.value.trim()

    const usuarioGuardado = localStorage.getItem('usuario')
    const passGuardada = localStorage.getItem('pass')

    if(usuario === usuarioGuardado && pass === passGuardada){ e.preventDefault(); window.location.href = "index.html" } 
    else{
        inputUsuarioInicio.style.outline = "2px solid red"
        inputPassInicio.style.outline = "2px solid red"
        setTimeout(() => {
            inputUsuarioInicio.style.outline = "none"
            inputPassInicio.style.outline = "none"
        }, 2000)
    }
})

btnRegistro.addEventListener('click', (e) => {
    e.preventDefault()
    const usuario = inputUsuarioRegistro.value.trim()
    const pass = inputPassRegistro.value.trim()

    if(usuario && pass){
        localStorage.setItem('usuario', usuario)
        localStorage.setItem('pass', pass)
        window.location.href = "index.html"
    }
})

// Limpiar el borde rojo al escribir
inputUsuarioInicio.addEventListener('input', () => inputUsuarioInicio.style.outline = "none")
inputPassInicio.addEventListener('input', () => inputPassInicio.style.outline = "none")

registroBtn.addEventListener('click', () => contenedor.classList.add('activo'))
loginBtn.addEventListener('click', () => contenedor.classList.remove('activo'))