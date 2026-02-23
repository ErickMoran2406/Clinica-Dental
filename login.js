const contenedor = document.querySelector('.contenedor');
const registroBtn = document.querySelector('.btn_registro');
const loginBtn = document.querySelector('.btn_login');

registroBtn.addEventListener('click', () => {
    contenedor.classList.add('activo');
});

loginBtn.addEventListener('click', () => {
    contenedor.classList.remove('activo');
});