const alerta = document.querySelector('.alerta')
const tituloAlerta = document.querySelector('.info_alerta h3')
const mensajeAlerta = document.querySelector('.mensaje_alerta')

const contenedor = document.querySelector('.contenedor')
const registroBtn = document.querySelector('.btn_registro')
const loginBtn = document.querySelector('.btn_login')

const inputUsuarioInicio = document.querySelector('.usuario_inicio')
const inputPassInicio = document.querySelector('.pass_inicio')
const btnInicioSesion = document.querySelector('.btn_inicio')

const inputUsuarioRegistro = document.querySelector('.usuario_registro')
const inputPassRegistro = document.querySelector('.pass_registro')
const btnRegistro = document.querySelector('.btn_registrarse')

registroBtn.addEventListener('click', () => contenedor.classList.add('activo'))
loginBtn.addEventListener('click', () => contenedor.classList.remove('activo'))

document.querySelectorAll('.dato').forEach(dato => {
    const input = dato.querySelector('input[type="password"]')
    const svg = dato.querySelector('svg')
    if (!input || !svg) return

    svg.style.cursor = 'pointer'
    svg.addEventListener('click', () => {
        const visible = input.type === 'text'
        input.type = visible ? 'password' : 'text'
        svg.style.opacity = visible ? '1' : '0.5'
    })
})

function crearSelectPersonalizado(claseContenedor) {
    document.querySelectorAll(claseContenedor).forEach(contenedor => {
        const infoSelect  = contenedor.querySelector('.info_sexo, .info_rol')
        const svgSelect   = contenedor.querySelector('.svg_select')
        const divOpciones = contenedor.querySelector('.div_sexos, .div_roles')
        const opciones    = divOpciones.querySelectorAll('p:not(:first-child)')

        infoSelect.addEventListener('click', (e) => {
            e.stopPropagation()

            document.querySelectorAll('.div_sexos, .div_roles').forEach(d => d.style.display = 'none')
            document.querySelectorAll('.svg_select').forEach(s => s.classList.remove('activo'))

            const estaAbierto = divOpciones.style.display === 'flex'
            divOpciones.style.display = estaAbierto ? 'none' : 'flex'
            svgSelect.classList.toggle('activo', !estaAbierto)
        })

        opciones.forEach(opcion => {
            opcion.addEventListener('click', (e) => {
                e.stopPropagation()
                const texto = opcion.textContent.trim()

                infoSelect.querySelector('p').textContent = texto
                infoSelect.style.color = '#333'

                contenedor.dataset.valor = texto

                divOpciones.style.display = 'none'
                svgSelect.classList.remove('activo')
            })
        })
    })
}

crearSelectPersonalizado('.sexo')
crearSelectPersonalizado('.rol')

document.addEventListener('click', () => {
    document.querySelectorAll('.div_sexos, .div_roles').forEach(div => { div.style.display = 'none' })
    document.querySelectorAll('.svg_select').forEach(svg => { svg.classList.remove('activo') })
})

function validarPassword(pass){
    const reglas = [
        { regex: /.{8,}/, mensaje: "Mínimo 8 caracteres." },
        { regex: /[A-Z]/, mensaje: "Al menos una mayúscula." },
        { regex: /[a-z]/, mensaje: "Al menos una minúscula." },
        { regex: /[0-9]/, mensaje: "Al menos un número." },
        { regex: /[^A-Za-z0-9]/, mensaje: "Al menos un carácter especial." },
    ]; return reglas.filter(r => !r.regex.test(pass)).map(r => r.mensaje)
}

function mostrarErrores(titulo, errores){
    tituloAlerta.textContent = titulo
    mensajeAlerta.innerHTML = ''
    errores.forEach(err => {
        const li = document.createElement('li')
        li.textContent = err
        mensajeAlerta.appendChild(li)
    }); mostrarAlerta(5000)
}

function mostrarAlerta(tiempo){
    alerta.style.top = '15%'
    setTimeout(() => { alerta.style.top = '-30%' }, tiempo)
}


btnRegistro.addEventListener('click', async (e) => {
    e.preventDefault()

    const usuario = inputUsuarioRegistro.value.trim()
    const pass = inputPassRegistro.value.trim()
    const sexo = document.querySelector('.sexo').dataset.valor || ''
    const rol = document.querySelector('.rol').dataset.valor  || ''

    if(!usuario || !pass || !sexo || !rol){ mostrarErrores('Campos faltantes', ['Todos los campos son obligatorios']); return }

    const errores = validarPassword(pass)
    if(errores.length > 0){ mostrarErrores('Contraseña inválida', errores); return }

    try{
        const res = await fetch('http://localhost/clinicadental/base_de_datos.php?action=registrar_usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, contra: pass, sexo, rol })
        })

        const resultado = await res.json()

        if(resultado.success){
            localStorage.setItem('usuario', resultado.usuario)
            localStorage.setItem('sexo', resultado.sexo)
            localStorage.setItem('rol', resultado.rol)
            window.location.href = 'inicio.html'
        } 
        else if(resultado.error === 'duplicado'){ mostrarErrores('Usuario no disponible', [resultado.mensaje]) } 
        else{ mostrarErrores('Error', ['No se pudo registrar el usuario']) }
    } catch(error){ mostrarErrores('Error de conexión', ['No se pudo conectar con el servidor']) }
})

btnInicioSesion.addEventListener('click', async (e) => {
    e.preventDefault()

    const usuario = inputUsuarioInicio.value.trim()
    const pass = inputPassInicio.value.trim()
    if(!usuario || !pass){ mostrarErrores('Campos faltantes', ['Usuario y contraseña son obligatorios']); return }

    try{
        const res = await fetch('http://localhost/clinicadental/base_de_datos.php?action=login_usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, contra: pass })
        })
        const resultado = await res.json()

        if(resultado.success){
            localStorage.setItem('usuario', resultado.usuario)
            localStorage.setItem('rol', resultado.rol)
            localStorage.setItem('id_usuario', resultado.id)
            window.location.href = 'inicio.html'
        } else{ mostrarErrores('Credenciales incorrectas', [resultado.mensaje || 'Usuario o contraseña incorrectos']) }
    } catch(error){ mostrarErrores('Error de conexión', ['No se pudo conectar con el servidor']) }
})