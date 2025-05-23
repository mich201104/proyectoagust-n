// auth.js - Manejo de autenticación

document.addEventListener('DOMContentLoaded', function () {
    const btnUsuario = document.getElementById('btn-user');
    const btnEmprendedor = document.getElementById('btn-entrepreneur');
    const formularioLogin = document.querySelector('.signup-form');
    const botonEnviar = document.getElementById('submit-btn');

    // Variable para controlar el tipo de login
    let tipoLogin = 'usuario';

    // Manejar cambio entre usuario y emprendedor
    btnUsuario.addEventListener('click', function (e) {
        e.preventDefault();
        btnUsuario.classList.add('active');
        btnEmprendedor.classList.remove('active');
        botonEnviar.textContent = 'Iniciar sesión como Usuario';
        tipoLogin = 'usuario';
    });

    btnEmprendedor.addEventListener('click', function (e) {
        e.preventDefault();
        btnEmprendedor.classList.add('active');
        btnUsuario.classList.remove('active');
        botonEnviar.textContent = 'Iniciar sesión como Emprendedor';
        tipoLogin = 'emprendedor';
    });

    // Manejar el envío del formulario de login
    if (formularioLogin) {
        formularioLogin.addEventListener('submit', function (e) {
            e.preventDefault();

            const correo = document.getElementById('email').value;
            const contrasena = document.getElementById('password').value;

            // Autenticar al usuario
            autenticarUsuario(correo, contrasena, tipoLogin);
        });
    }
});

// Función para autenticar usuarios
function autenticarUsuario(correo, contrasena, tipoLogin) {
    let usuario = null;

    if (tipoLogin === 'usuario') {
        // Buscar en usuarios normales primero
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        usuario = usuarios.find(u => u.email === correo && u.password === contrasena);

        // Si no encuentra, verificar si quizás es emprendedor
        if (!usuario) {
            const emprendedores = JSON.parse(localStorage.getItem('emprendedores')) || [];
            const emp = emprendedores.find(e => e.email === correo && e.password === contrasena);
            if (emp) {
                if (confirm("Parece que tienes una cuenta de emprendedor. ¿Quieres iniciar sesión como emprendedor?")) {
                    autenticarUsuario(correo, contrasena, 'emprendedor');
                    return;
                }
            }
        }
    } else {
        // Buscar solo en emprendedores
        const emprendedores = JSON.parse(localStorage.getItem('emprendedores')) || [];
        usuario = emprendedores.find(e => e.email === correo && e.password === contrasena);
    }

    if (usuario) {
        // Guardar sesión
        sessionStorage.setItem('currentUser', JSON.stringify({
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            tipo: usuario.tipo || tipoLogin
        }));

        // Redirigir según tipo de usuario
        redirigirDespuesDeLogin(usuario.tipo || tipoLogin);
    } else {
        alert('Información incorrecta, por favor verifica tu correo y contraseña.');
    }
}

// Función para redirigir después del login
function redirigirDespuesDeLogin(tipoUsuario) {
    switch (tipoUsuario) {
        case 'emprendedor':
            window.location.href = 'subirproducto.html'; // Cambiado a subirproducto
            break;
        case 'usuario':
        default:
            window.location.href = 'emprendedores.html'; // Cambiado a emprendedores
            break;
    }
}

// Función para verificar sesión activa (usar en otras páginas)
function verificarSesion() {
    const usuarioActual = JSON.parse(sessionStorage.getItem('currentUser'));

    if (!usuarioActual) {
        window.location.href = 'index.html';
        return false;
    }
    return usuarioActual;
}

// Función para cerrar sesión
function cerrarSesion() {
    // Eliminar datos de sesión
    sessionStorage.removeItem('currentUser');

    // Redirigir al login
    window.location.href = 'index.html';
}

// Hacer la función disponible globalmente
window.cerrarSesion = cerrarSesion;

// Verificar autenticación al cargar páginas protegidas
function esPaginaProtegida() {
    return window.location.pathname.includes('emprendedores.html') ||
           window.location.pathname.includes('subirproducto.html') ||
           window.location.pathname.includes('perfil.html');
}