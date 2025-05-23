document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM
    const btnUsuario = document.getElementById('btn-user');
    const btnEmprendedor = document.getElementById('btn-entrepreneur');
    const camposEmprendedor = document.getElementById('entrepreneur-fields');
    const botonEnviar = document.getElementById('submit-btn');
    const formularioRegistro = document.querySelector('.signup-form');

    // Variable para controlar el tipo de registro
    let esEmprendedor = false;

    // Manejar el cambio entre usuario y emprendedor
    btnUsuario.addEventListener('click', function (e) {
        e.preventDefault();
        btnUsuario.classList.add('active');
        btnEmprendedor.classList.remove('active');
        camposEmprendedor.style.display = 'none';
        botonEnviar.textContent = 'Registrarse como Usuario';
        esEmprendedor = false;
    });

    btnEmprendedor.addEventListener('click', function (e) {
        e.preventDefault();
        btnEmprendedor.classList.add('active');
        btnUsuario.classList.remove('active');
        camposEmprendedor.style.display = 'block';
        botonEnviar.textContent = 'Registrarse como Emprendedor';
        esEmprendedor = true;
    });

    // Manejar el envío del formulario
    formularioRegistro.addEventListener('submit', function (e) {
        e.preventDefault();

        // Obtener valores del formulario
        const nombre = document.getElementById('name').value;
        const apellido = document.getElementById('lastname').value;
        const correo = document.getElementById('email').value;
        const contrasena = document.getElementById('password').value;

        if (esEmprendedor) {
            // Registro como emprendedor
            const telefono = document.getElementById('phone').value;

            const nuevoEmprendedor = {
                id: Date.now(),
                nombre: nombre,
                apellidos: apellido,
                telefono: telefono,
                email: correo,
                password: contrasena,
                tipo: 'emprendedor'
            };

            let emprendedores = JSON.parse(localStorage.getItem('emprendedores')) || [];
            emprendedores.push(nuevoEmprendedor);
            localStorage.setItem('emprendedores', JSON.stringify(emprendedores));

            alert('Emprendedor registrado con éxito. Ahora puedes iniciar sesión.');
            window.location.href = 'subirproducto.html'; // Redirigir a subir producto
        } else {
            // Registro como usuario normal
            const nuevoUsuario = {
                id: Date.now(),
                nombre: nombre,
                apellidos: apellido,
                email: correo,
                password: contrasena,
                tipo: 'usuario'
            };

            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            usuarios.push(nuevoUsuario);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            alert('Usuario registrado con éxito. Ahora puedes iniciar sesión.');
            window.location.href = 'index.html'; // Redirigir al inicio
        }
    });
});

// Función para mostrar emprendedores (para emprendedores.html)
function mostrarEmprendedores() {
    const emprendedores = JSON.parse(localStorage.getItem('emprendedores')) || [];
    const lista = document.getElementById('lista-emprendedores');

    lista.innerHTML = '';

    emprendedores.forEach(emprendedor => {
        lista.innerHTML += `
            <div class="emprendedor">
                <h3>${emprendedor.nombre} ${emprendedor.apellidos}</h3>
                <p>${emprendedor.email}</p>
                <p>Tel: ${emprendedor.telefono}</p>
                <a href="perfil.html?id=${emprendedor.id}&tipo=emprendedor">Ver perfil</a>
            </div>
        `;
    });
}

// Función para mostrar perfil (para perfil.html)
function mostrarPerfil() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const tipo = urlParams.get('tipo');

    let datos;

    if (tipo === 'emprendedor') {
        const emprendedores = JSON.parse(localStorage.getItem('emprendedores')) || [];
        datos = emprendedores.find(e => e.id == id);
    } else {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        datos = usuarios.find(u => u.id == id);
    }

    if (datos) {
        document.getElementById('nombre-perfil').textContent = `${datos.nombre} ${datos.apellidos}`;
        document.getElementById('email-perfil').textContent = datos.email;

        if (tipo === 'emprendedor') {
            document.getElementById('telefono-perfil').textContent = datos.telefono;
            document.getElementById('telefono-container').style.display = 'block';
        } else {
            document.getElementById('telefono-container').style.display = 'none';
        }
    } else {
        window.location.href = 'index.html';
    }
}

// Inicializar funciones según la página
if (document.getElementById('lista-emprendedores')) {
    window.addEventListener('load', mostrarEmprendedores);
}

if (document.getElementById('nombre-perfil')) {
    window.addEventListener('load', mostrarPerfil);
}