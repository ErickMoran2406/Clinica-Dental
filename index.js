const alerta = document.querySelector('.alerta');
const tituloAlerta = document.querySelector('.info_alerta h3');
const mensajeAlerta = document.querySelector('.mensaje_alerta')

const contenedor = document.querySelector('.contenedor');
const registroBtn = document.querySelector('.btn_registro');
const loginBtn = document.querySelector('.btn_login');

let nombreUsuario = null
let passUsuario = null

function confirmarUsuario(nombre){ nombreUsuario = nombre; return nombreUsuario }
function confirmarPass(pass){ passUsuario = pass; return passUsuario }

console.log("Usuario registrado:", nombreUsuario)
console.log("Contraseña registrada:", passUsuario)

const inputUsuarioInicio = document.querySelector('.usuario_inicio')
const inputPassInicio = document.querySelector('.pass_inicio')
const btnIncioSesion = document.querySelector('.btn_inicio')

const inputUsuarioRegistro = document.querySelector('.usuario_registro')
const inputPassRegistro = document.querySelector('.pass_registro')
const btnRegistro = document.querySelector('.btn_registrarse')

btnIncioSesion.addEventListener('click', (e) => {
    e.preventDefault()
    const usuario = inputUsuarioInicio.value.trim()
    const pass = inputPassInicio.value.trim()

    const usuarioGuardado = localStorage.getItem('usuario')
    const passGuardada = localStorage.getItem('pass')

    console.log("Guardado: ", usuarioGuardado)
    console.log("Pass: ", passGuardada)

    console.log(confirmarUsuario(usuarioGuardado), confirmarPass(passGuardada))
    console.log(usuario == confirmarUsuario(usuarioGuardado))

    if(usuario === usuarioGuardado && pass === passGuardada){ e.preventDefault(); window.location.href = "inicio.html" } 
    else{ 
        tituloAlerta.textContent = "Credenciales incorrectas"
        mensajeAlerta.innerHTML = "<li>Usuario o contraseña incorrectos</li>"
        mostrarAlerta(3000) 
    }

    console.log(usuario, pass)
})

btnRegistro.addEventListener('click', (e) => {
    e.preventDefault()
    const usuario = inputUsuarioRegistro.value.trim()
    const pass = inputPassRegistro.value.trim()

    if(usuario === "" || pass === ""){ 
        tituloAlerta.textContent = "Campos faltantes"
        mensajeAlerta.innerHTML = "<li>Usuario o contraseña vacía</li>"
        mostrarAlerta(3000) 
    }

    const errores = validarPassword(pass)

    if(!usuario) return 

    if(errores.length > 0){ mostrarErrores(errores); return }

    localStorage.setItem('usuario', usuario)
    localStorage.setItem('pass', pass)
    window.location.href = "inicio.html"

    console.log("Usuario registrado:", usuario)
    console.log("Contraseña registrada:", pass)
})

inputUsuarioInicio.addEventListener('input', () => inputUsuarioInicio.style.outline = "none")
inputPassInicio.addEventListener('input', () => inputPassInicio.style.outline = "none")

registroBtn.addEventListener('click', () => contenedor.classList.add('activo'))
loginBtn.addEventListener('click', () => contenedor.classList.remove('activo'))

function validarPassword(pass){
    const reglas = [
        { regex: /.{8,}/, mensaje: "Mínimo 8 caracteres." },
        { regex: /[A-Z]/, mensaje: "Al menos una mayúscula." },
        { regex: /[a-z]/, mensaje: "Al menos una minúscula." },
        { regex: /[0-9]/, mensaje: "Al menos un número." },
        { regex: /[^A-Za-z0-9]/, mensaje: "Al menos un carácter especial." },
    ]

    const errores = reglas.filter(regla => !regla.regex.test(pass)).map(regla => regla.mensaje)
    return errores
}

function mostrarErrores(errores){
    tituloAlerta.textContent = "Contraseña inválida"
    
    mensajeAlerta.innerHTML = ""
    errores.forEach(err => {
        const li = document.createElement('li')
        li.textContent = err
        mensajeAlerta.appendChild(li)
    })

    mostrarAlerta(5000)

    inputPassRegistro.addEventListener('input', () => {
        inputPassRegistro.style.outline = "none"
    }, { once: true })
}

document.querySelectorAll('.dato').forEach(dato => {
    const input = dato.querySelector('input[type="password"]')
    const svg = dato.querySelector('svg')
    if (!input || !svg) return

    svg.style.cursor = 'pointer'
    svg.addEventListener('click', () => {
        const visible = input.type === 'text'
        input.type = visible ? 'password' : 'text'
        // Cambia opacidad para indicar estado
        svg.style.opacity = visible ? '1' : '0.5'
    })
})

function mostrarAlerta(tiempo){
    alerta.style.top = "15%"
    setTimeout(() => { alerta.style.top = "-30%" }, tiempo)
}