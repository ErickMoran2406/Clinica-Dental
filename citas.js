// 
const tituloMes = document.querySelector(".mes"); 
const dias = document.querySelector(".dias");
const btnIconos = document.querySelectorAll('.icono')

// Botón de Nueva cita
const overlayNuevaCita = document.querySelector('.overlay_nueva_cita')
const btnNuevaCita = document.querySelector('.btn_nueva_cita')
const selectEstados = document.querySelector('.estado')
const divestadosOpcion = document.querySelector('.div_esp')
const estadoOpcion = document.querySelectorAll('.div_esp p')
const infoEstadoP = document.querySelector('.info_esp p');
const svgSelect = document.querySelector('.svg_select')
const cerrarNuevaCita = document.querySelector('.cerrar_nueva_cita')
const agregarCita = document.querySelector('.agregar_cita')
const infoEspecialidad = document.querySelector('.info_esp p')
const citaCalendario = document.querySelector('.dias li.cita')

let dia = new Date(),
anio = dia.getFullYear(),
mes = dia.getMonth();
let citas = []

const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function citaAgregada(nombre, edad, dia, mes, anio, hora, estado, especialidad){
    citas.push({
        dia: Number(dia),
        mes: Number(mes),
        anio: Number(anio),
        desc: especialidad
    });
    calendario();
    console.log("Cita agregada:", citas);
}

const calendario = () => {
    let primerDiaMes = new Date(anio, mes, 1).getDay(),
    ultimaFechaMes = new Date(anio, mes + 1, 0).getDate(),
    ultimoDiaMes = new Date(anio, mes, ultimaFechaMes).getDay(),
    ultimoDiaUltimoMes = new Date(anio, mes, 0).getDate();
    let liTag = "";

    for(let i = primerDiaMes; i > 0; i--){
        liTag += `<li class="inactivo">${ultimoDiaUltimoMes - i + 1}</li>`
    }

    for(let i = 1; i <= ultimaFechaMes; i++){
        let hoy = i === new Date().getDate() 
            && mes === new Date().getMonth() 
            && anio === new Date().getFullYear() ? "activo" : "";

        let citaDelDia = citas.find(cita => cita.dia === i && cita.mes === mes && cita.anio === anio);
        let tieneCita = citaDelDia ? "cita" : "";

        liTag += `<li class="${hoy} ${tieneCita}" title="${citaDelDia ? citaDelDia.desc : ""}">${i}</li>`;
    }

    if(ultimoDiaMes !== 6){
        for(let i = ultimoDiaMes; i < 6; i++){
            liTag += `<li class="inactivo">${i - ultimoDiaMes + 1}</li>`
        }
    }

    tituloMes.innerHTML = `${meses[mes]} ${anio}`;
    dias.innerHTML = liTag;
}
calendario();

btnIconos.forEach(btn => {
    btn.addEventListener('click', () => {
        mes = btn.id === "left" ? mes - 1 : mes + 1;
        if(mes < 0 || mes > 11){
            dia = new Date(anio, mes);
            anio = dia.getFullYear();
            mes = dia.getMonth();
        } else{ dia = new Date() }
        calendario();
    })
});

btnNuevaCita.addEventListener('click', () => { overlayNuevaCita.style.display = 'flex' })
cerrarNuevaCita.addEventListener('click', () => {
    overlayNuevaCita.style.display = 'none';
})
selectEstados.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = divestadosOpcion.style.display === 'flex';
    svgSelect.classList.add('activo')
    divestadosOpcion.style.display = isOpen ? 'none' : 'flex';
});
estadoOpcion.forEach(opc => {
    opc.addEventListener('click', (e) => {
        e.stopPropagation();

        const opcion = opc.textContent;

        if (opcion === 'Selecciona una especialidad') return;

        infoEstadoP.textContent = opcion;
        infoEstadoP.style.color = '#333';
        svgSelect.classList.remove('activo')
        divestadosOpcion.style.display = 'none';
    });
});
document.addEventListener('click', (e) => {
    if(!selectEstados.contains(e.target)){
        svgSelect.classList.remove('activo');
        divestadosOpcion.style.display = 'none';
    }
});

agregarCita.addEventListener('click', () => {
    const fechaYHora = document.querySelector('input[name="fechaCita"]').value;
    if (!fechaYHora) return;

    const nombre = document.querySelector('input[name="nombreCita"]').value;
    const edad = document.querySelector('input[name="edadCita"]').value;
    const [fecha, hora] = fechaYHora.split("T");
    const [anioVal, mesVal, diaVal] = fecha.split("-");
    const estado = 'Activo';
    const especialidad = infoEspecialidad.textContent;

    citaAgregada(nombre, edad, Number(diaVal), Number(mesVal) - 1, Number(anioVal), hora, estado, especialidad);
    overlayNuevaCita.style.display = 'none';
});