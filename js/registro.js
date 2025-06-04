// Esperamos a que toda la página se cargue para ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
  // Seleccionamos el formulario de registro y la tabla donde mostraremos los usuarios
  const formulario = document.querySelector(".formulario-registro");
  const tablaUsuarios = document.querySelector("#tabla-usuarios tbody");

  // Obtenemos los usuarios guardados en el navegador (localStorage), si no hay, dejamos un arreglo vacío
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  // Variable para saber si estamos editando algún usuario y cuál es su posición en el arreglo
  let editandoIndex = null;

  // Botones y campos que usaremos para cambiar el tipo de usuario y enviar el formulario
  const botonEnviar = document.getElementById("boton-enviar");
  const btnUsuario = document.getElementById("btn-usuario");
  const btnEmprendedor = document.getElementById("btn-emprendedor");
  const camposEmprendedor = document.getElementById("campos-emprendedor");

  // Función para guardar la lista de usuarios en localStorage y también en formato XML
  function guardarEnLocalStorageYXML() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios)); // Guardamos en JSON
    guardarUsuariosEnXML(); // Guardamos en XML
  }

  // Esta función crea un archivo XML con los usuarios y lo guarda en localStorage
  function guardarUsuariosEnXML() {
    const xmlDoc = document.implementation.createDocument(null, "usuarios"); // Creamos el documento XML

    // Por cada usuario, creamos un elemento <usuario> con sus datos
    usuarios.forEach((usuario) => {
      const usuarioElem = xmlDoc.createElement("usuario");

      for (let key in usuario) {
        const elem = xmlDoc.createElement(key);  // Creamos una etiqueta para cada propiedad (name, email, etc)
        elem.textContent = usuario[key];          // Le ponemos el valor del usuario
        usuarioElem.appendChild(elem);             // Lo agregamos al elemento usuario
      }

      xmlDoc.documentElement.appendChild(usuarioElem); // Agregamos el usuario al documento XML
    });

    const xmlSerializer = new XMLSerializer();
    const xmlString = xmlSerializer.serializeToString(xmlDoc);  // Convertimos el XML a texto
    localStorage.setItem("usuariosXML", xmlString);            // Guardamos ese texto en localStorage
  }

  // Función para mostrar los usuarios en la tabla HTML
  function cargarUsuarios() {
    tablaUsuarios.innerHTML = "";  // Limpiamos la tabla antes de cargarla de nuevo

    usuarios.forEach((usuario, index) => {
      const fila = document.createElement("tr");  // Creamos una fila para cada usuario

      // Llenamos la fila con los datos del usuario y botones para editar o eliminar
      fila.innerHTML = `
        <td>${usuario.name}</td>
        <td>${usuario.email}</td>
        <td>${usuario.tipo}</td>
        <td>
          <button class="btn-editar" data-index="${index}">Editar</button>
          <button class="btn-eliminar" data-index="${index}">Eliminar</button>
        </td>
      `;
      tablaUsuarios.appendChild(fila);  // Agregamos la fila a la tabla
    });
  }

  // Función para limpiar el formulario y dejarlo listo para un nuevo registro
  function resetFormulario() {
    formulario.reset();                // Limpia los campos del formulario
    editandoIndex = null;             // No estamos editando a nadie
    botonEnviar.textContent = "Registrarse como Usuario"; // Cambia el texto del botón
    btnUsuario.classList.add("activo");   // Marca "Usuario" como activo
    btnEmprendedor.classList.remove("activo");  // Quita activo de "Emprendedor"
    camposEmprendedor.style.display = "none";   // Esconde campos especiales para emprendedor
  }

  // Función para cargar los datos de un usuario en el formulario cuando queremos editarlo
  function cargarFormulario(usuario) {
    const partesNombre = usuario.name.split(" ");  // Separamos nombre y apellidos

    formulario.name.value = partesNombre[0] || "";                  // Nombre
    formulario.lastname.value = partesNombre.slice(1).join(" ") || "";  // Apellidos
    formulario.email.value = usuario.email;                         // Email
    formulario.password.value = "";                                 // Limpiamos el password

    if (usuario.tipo === "Emprendedor") {    // Si es emprendedor
      btnEmprendedor.classList.add("activo");
      btnUsuario.classList.remove("activo");
      camposEmprendedor.style.display = "block";  // Mostramos campos para emprendedor
    } else {
      btnUsuario.classList.add("activo");
      btnEmprendedor.classList.remove("activo");
      camposEmprendedor.style.display = "none";   // Ocultamos campos para emprendedor
    }

    botonEnviar.textContent = "Guardar Cambios";  // Cambiamos el texto del botón
  }

  // Evento que ocurre cuando enviamos el formulario (registrar o editar usuario)
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();  // Evitamos que se recargue la página

    // Tomamos los valores que escribió el usuario en el formulario
    const name = formulario.name.value.trim();
    const lastname = formulario.lastname.value.trim();
    const email = formulario.email.value.trim();
    const password = formulario.password.value.trim();
    const tipo = btnEmprendedor.classList.contains("activo") ? "Emprendedor" : "Usuario";

    // Validamos que los campos obligatorios no estén vacíos
    if (!name || !lastname || !email) {
      alert("Por favor llena todos los campos obligatorios.");
      return;  // Salimos si falta algo
    }

    if (editandoIndex === null) {  // Si no estamos editando, registramos nuevo usuario
      // Verificamos que no exista otro usuario con ese correo
      if (usuarios.some(u => u.email === email)) {
        alert("Ya existe un usuario con ese correo.");
        return;
      }
      // Creamos el nuevo usuario con los datos del formulario
      const nuevoUsuario = {
        name: name + " " + lastname,
        email,
        password,
        tipo
      };
      usuarios.push(nuevoUsuario);  // Lo agregamos a la lista
    } else {  // Si estamos editando un usuario existente
      // Verificamos que no haya otro usuario con ese correo (excepto el que editamos)
      if (usuarios.some((u, i) => u.email === email && i != editandoIndex)) {
        alert("Ya existe otro usuario con ese correo.");
        return;
      }
      // Actualizamos los datos del usuario que editamos
      usuarios[editandoIndex].name = name + " " + lastname;
      usuarios[editandoIndex].email = email;
      if (password) {  // Solo cambiamos la contraseña si escribieron algo
        usuarios[editandoIndex].password = password;
      }
      usuarios[editandoIndex].tipo = tipo;
    }

    guardarEnLocalStorageYXML();  // Guardamos los cambios en localStorage y XML
    cargarUsuarios();             // Actualizamos la tabla para mostrar cambios
    resetFormulario();           // Limpiamos el formulario para un nuevo registro
  });

  // Evento para detectar cuando se hace clic en los botones de la tabla (editar o eliminar)
  tablaUsuarios.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar")) {  // Si clic en botón eliminar
      const index = parseInt(e.target.dataset.index);
      if (confirm("¿Seguro que quieres eliminar este usuario?")) {
        usuarios.splice(index, 1);      // Quitamos el usuario del arreglo
        guardarEnLocalStorageYXML();    // Guardamos cambios
        cargarUsuarios();               // Actualizamos tabla
        if (editandoIndex === index) {  // Si estabas editando a ese usuario, limpiamos formulario
          resetFormulario();
        }
      }
    } else if (e.target.classList.contains("btn-editar")) {  // Si clic en botón editar
      const index = parseInt(e.target.dataset.index);
      editandoIndex = index;            // Guardamos el índice que vamos a editar
      cargarFormulario(usuarios[index]);  // Cargamos datos en el formulario
    }
  });

  // Función para actualizar la interfaz según el tipo de cuenta seleccionado
  function actualizarTipoCuenta() {
    if (btnEmprendedor.classList.contains("activo")) {
      camposEmprendedor.style.display = "block";  // Mostrar campos de emprendedor
      botonEnviar.textContent = editandoIndex === null ? "Registrarse como Emprendedor" : "Guardar Cambios";
    } else {
      camposEmprendedor.style.display = "none";   // Ocultar campos de emprendedor
      botonEnviar.textContent = editandoIndex === null ? "Registrarse como Usuario" : "Guardar Cambios";
    }
  }

  // Cuando se hace clic en botón "Usuario"
  btnUsuario.addEventListener("click", (e) => {
    e.preventDefault();
    btnUsuario.classList.add("activo");
    btnEmprendedor.classList.remove("activo");
    actualizarTipoCuenta();
  });

  // Cuando se hace clic en botón "Emprendedor"
  btnEmprendedor.addEventListener("click", (e) => {
    e.preventDefault();
    btnEmprendedor.classList.add("activo");
    btnUsuario.classList.remove("activo");
    actualizarTipoCuenta();
  });

  // Cargamos la tabla con los usuarios guardados al iniciar la página
  cargarUsuarios();
  actualizarTipoCuenta();  // Actualizamos la interfaz para el tipo de usuario
});
