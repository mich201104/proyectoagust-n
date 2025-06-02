// Espera a que todo el contenido de la página esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {

    // Recupera al usuario que está actualmente logueado (guardado en localStorage)
    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

    // Si no hay un usuario logueado, redirige a la página para crear cuenta
    if (!usuario) {
        window.location.href = "crearcuenta.html";
        return; // Detiene el resto del código
    }

    // Recupera la lista completa de todos los usuarios registrados
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Selecciona los elementos del formulario del perfil
    const formulario = document.getElementById("formularioPerfil");
    const fotoPerfil = document.getElementById("fotoPerfil");           // Imagen de perfil mostrada
    const subirFoto = document.getElementById("subirFoto");             // Input para subir nueva foto
    const botonCambiarFoto = document.getElementById("botonCambiarFoto"); // Botón para cambiar la foto
    const botonSalir = document.getElementById("botonSalir");           // Botón para cerrar sesión

    // Muestra los datos del usuario logueado en el formulario
    formulario.nombre.value = usuario.nombre || "";
    formulario.apellidos.value = usuario.apellidos || "";
    formulario.telefono.value = usuario.telefono || "";
    formulario.correo.value = usuario.correo || "";

    // Si el usuario ya tiene una foto guardada, la mostramos en la imagen del perfil
    if (usuario.fotoBase64) {
        fotoPerfil.src = usuario.fotoBase64;
    }

    // Cuando se da clic en el botón "Cambiar foto", se activa el input para subir archivo
    botonCambiarFoto.addEventListener("click", () => {
        subirFoto.click(); // Simula el clic para seleccionar imagen
    });

    // Cuando el usuario selecciona una imagen nueva
    subirFoto.addEventListener("change", () => {
        const file = subirFoto.files[0]; // Toma el primer archivo seleccionado
        if (!file) return;

        const reader = new FileReader(); // Herramienta para leer archivos como texto o imagen

        // Cuando la imagen haya sido leída correctamente
        reader.onload = function (e) {
            const base64 = e.target.result;       // Imagen convertida a base64 (texto)
            fotoPerfil.src = base64;              // Muestra la nueva imagen
            usuario.fotoBase64 = base64;          // Actualiza la imagen del usuario logueado

            // Busca al usuario en la lista completa de usuarios y actualiza su foto
            const index = usuarios.findIndex(u => u.correo === usuario.correo);
            if (index !== -1) {
                usuarios[index].fotoBase64 = base64;
                localStorage.setItem("usuarios", JSON.stringify(usuarios)); // Guarda los cambios
            }

            // También actualiza al usuario logueado en localStorage
            localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
        };

        reader.readAsDataURL(file); // Convierte el archivo en texto base64
    });

    // Prevenimos el envío del formulario (no queremos que recargue la página)
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
    });

    // Cada vez que se cambie un dato del formulario (nombre, apellidos, etc.)
    formulario.addEventListener("change", () => {
        // Obtenemos los nuevos valores
        const nombre = formulario.nombre.value.trim();
        const apellidos = formulario.apellidos.value.trim();
        const telefono = formulario.telefono.value.trim();
        const correo = formulario.correo.value.trim();
        const nuevaContrasena = formulario.contrasena.value.trim();

        // Buscamos al usuario en la lista completa
        const index = usuarios.findIndex(u => u.correo === usuario.correo);
        if (index !== -1) {
            // Actualizamos sus datos
            usuarios[index].nombre = nombre;
            usuarios[index].apellidos = apellidos;
            usuarios[index].telefono = telefono;
            usuarios[index].correo = correo;

            // Si se escribió una nueva contraseña, también la actualizamos
            if (nuevaContrasena) {
                usuarios[index].password = nuevaContrasena;
            }

            // Actualizamos también el objeto que representa al usuario logueado
            Object.assign(usuario, usuarios[index]);

            // Guardamos todo en localStorage
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
            alert("Perfil actualizado correctamente.");
        }
    });

    // Si se hace clic en "Salir", cerramos sesión
    botonSalir.addEventListener("click", () => {
        localStorage.removeItem("usuarioLogueado"); // Quitamos la sesión del usuario
        window.location.href = "crearcuenta.html";  // Redirigimos al login
    });
});
