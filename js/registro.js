document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector(".formulario-registro");
  const tablaUsuarios = document.querySelector("#tabla-usuarios tbody");

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  let editandoIndex = null;

  const botonEnviar = document.getElementById("boton-enviar");
  const btnUsuario = document.getElementById("btn-usuario");
  const btnEmprendedor = document.getElementById("btn-emprendedor");
  const camposEmprendedor = document.getElementById("campos-emprendedor");

  function guardarEnLocalStorageYXML() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    guardarUsuariosEnXML();
  }

  function guardarUsuariosEnXML() {
    const xmlDoc = document.implementation.createDocument(null, "usuarios");
    usuarios.forEach((usuario) => {
      const usuarioElem = xmlDoc.createElement("usuario");

      for (let key in usuario) {
        const elem = xmlDoc.createElement(key);
        elem.textContent = usuario[key];
        usuarioElem.appendChild(elem);
      }

      xmlDoc.documentElement.appendChild(usuarioElem);
    });

    const xmlSerializer = new XMLSerializer();
    const xmlString = xmlSerializer.serializeToString(xmlDoc);
    localStorage.setItem("usuariosXML", xmlString);
  }

  function cargarUsuarios() {
    tablaUsuarios.innerHTML = "";
    usuarios.forEach((usuario, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${usuario.name}</td>
        <td>${usuario.email}</td>
        <td>${usuario.tipo}</td>
        <td>
          <button class="btn-editar" data-index="${index}">Editar</button>
          <button class="btn-eliminar" data-index="${index}">Eliminar</button>
        </td>
      `;
      tablaUsuarios.appendChild(fila);
    });
  }

  function resetFormulario() {
    formulario.reset();
    editandoIndex = null;
    botonEnviar.textContent = "Registrarse como Usuario";
    btnUsuario.classList.add("activo");
    btnEmprendedor.classList.remove("activo");
    camposEmprendedor.style.display = "none";
  }

  function cargarFormulario(usuario) {
    const partesNombre = usuario.name.split(" ");
    formulario.name.value = partesNombre[0] || "";
    formulario.lastname.value = partesNombre.slice(1).join(" ") || "";
    formulario.email.value = usuario.email;
    formulario.password.value = "";

    if (usuario.tipo === "Emprendedor") {
      btnEmprendedor.classList.add("activo");
      btnUsuario.classList.remove("activo");
      camposEmprendedor.style.display = "block";
    } else {
      btnUsuario.classList.add("activo");
      btnEmprendedor.classList.remove("activo");
      camposEmprendedor.style.display = "none";
    }

    botonEnviar.textContent = "Guardar Cambios";
  }

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = formulario.name.value.trim();
    const lastname = formulario.lastname.value.trim();
    const email = formulario.email.value.trim();
    const password = formulario.password.value.trim();
    const tipo = btnEmprendedor.classList.contains("activo") ? "Emprendedor" : "Usuario";

    if (!name || !lastname || !email) {
      alert("Por favor llena todos los campos obligatorios.");
      return;
    }

    if (editandoIndex === null) {
      if (usuarios.some(u => u.email === email)) {
        alert("Ya existe un usuario con ese correo.");
        return;
      }
      const nuevoUsuario = {
        name: name + " " + lastname,
        email,
        password,
        tipo
      };
      usuarios.push(nuevoUsuario);
    } else {
      if (usuarios.some((u, i) => u.email === email && i != editandoIndex)) {
        alert("Ya existe otro usuario con ese correo.");
        return;
      }
      usuarios[editandoIndex].name = name + " " + lastname;
      usuarios[editandoIndex].email = email;
      if (password) {
        usuarios[editandoIndex].password = password;
      }
      usuarios[editandoIndex].tipo = tipo;
    }

    guardarEnLocalStorageYXML();
    cargarUsuarios();
    resetFormulario();
  });

  tablaUsuarios.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar")) {
      const index = parseInt(e.target.dataset.index);
      if (confirm("¿Seguro que quieres eliminar este usuario?")) {
        usuarios.splice(index, 1);
        guardarEnLocalStorageYXML();
        cargarUsuarios();
        if (editandoIndex === index) {
          resetFormulario();
        }
      }
    } else if (e.target.classList.contains("btn-editar")) {
      const index = parseInt(e.target.dataset.index);
      editandoIndex = index;
      cargarFormulario(usuarios[index]);
    }
  });

  function actualizarTipoCuenta() {
    if (btnEmprendedor.classList.contains("activo")) {
      camposEmprendedor.style.display = "block";
      botonEnviar.textContent = editandoIndex === null ? "Registrarse como Emprendedor" : "Guardar Cambios";
    } else {
      camposEmprendedor.style.display = "none";
      botonEnviar.textContent = editandoIndex === null ? "Registrarse como Usuario" : "Guardar Cambios";
    }
  }

  btnUsuario.addEventListener("click", (e) => {
    e.preventDefault();
    btnUsuario.classList.add("activo");
    btnEmprendedor.classList.remove("activo");
    actualizarTipoCuenta();
  });

  btnEmprendedor.addEventListener("click", (e) => {
    e.preventDefault();
    btnEmprendedor.classList.add("activo");
    btnUsuario.classList.remove("activo");
    actualizarTipoCuenta();
  });

  cargarUsuarios();
  actualizarTipoCuenta();
});
