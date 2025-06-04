// Espera a que el contenido del DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {

  // Selecciona el formulario que tiene la clase "formulario-inicio"
  const formulario = document.querySelector(".formulario-inicio");

  // Selecciona los botones para elegir si se va a iniciar sesión como Usuario o como Emprendedor
  const btnUsuario = document.getElementById("btn-usuario");
  const btnEmprendedor = document.getElementById("btn-emprendedor");

  // Cuando se envíe el formulario (cuando den clic en "Iniciar sesión")
  formulario.addEventListener("submit", (e) => {
    // Evita que la página se recargue (esto pasa por defecto con los formularios)
    e.preventDefault();

    // Obtenemos los valores que el usuario escribió en los campos email y password
    const email = formulario.email.value.trim();       // .trim() elimina espacios en blanco
    const password = formulario.password.value.trim();

    // Verificamos si el botón de Emprendedor está activo. Si sí, el tipo será "Emprendedor", si no, será "Usuario"
    const tipoSeleccionado = btnEmprendedor.classList.contains("activo") ? "Emprendedor" : "Usuario";

    // Obtenemos del localStorage la lista de usuarios registrados, si no hay nada, usamos un arreglo vacío []
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Buscamos dentro del arreglo un usuario que tenga el mismo correo, contraseña y tipo de cuenta
    const usuario = usuarios.find(
      (u) => u.email === email && u.password === password && u.tipo === tipoSeleccionado
    );

    // Si encontramos un usuario que cumple con los datos ingresados
    if (usuario) {
      // Guardamos al usuario que inició sesión en localStorage, para recordar su sesión
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

      // Si el tipo de usuario es "Usuario", lo mandamos a la página emprendedores.html
      if (usuario.tipo === "Usuario") {
        window.location.href = "emprendedores.html";
      } 
      // Si es "Emprendedor", lo mandamos a la página subirproducto.html
      else if (usuario.tipo === "Emprendedor") {
        window.location.href = "subirproducto.html";
      }

    } else {
      // Si no encontramos un usuario que coincida, mostramos un mensaje de error
      alert("Correo, contraseña o tipo de cuenta incorrectos.");
    }
  });
});
