// Obtenemos el formulario de productos desde el HTML
const formulario = document.getElementById('formularioProducto');

// Este es el contenedor donde vamos a mostrar los productos
const listaProductos = document.getElementById('lista-productos');

// Cargamos los productos desde localStorage (si ya hay guardados), si no, empezamos con una lista vacía
let productos = JSON.parse(localStorage.getItem('productos')) || [];

// ELEMENTOS PARA EDITAR PRODUCTOS

// Modal es la ventana emergente para editar
const modal = document.getElementById('modalEditar');

// Botón para cerrar el modal
const cerrarModalBtn = document.getElementById('cerrarModal');

// Formulario dentro del modal
const formEditar = document.getElementById('formEditarProducto');

// Campos dentro del formulario de edición
const editarNombre = document.getElementById('editarNombre');
const editarPrecio = document.getElementById('editarPrecio');
const editarImagen = document.getElementById('editarImagen');

// Variable que guarda el índice del producto que estamos editando
let indiceEditando = null;

// FUNCIÓN PARA MOSTRAR LOS PRODUCTOS
function mostrarProductos() {
  // Limpiamos la lista para que no se repitan los productos
  listaProductos.innerHTML = '';

  // Si no hay productos, mostramos un mensaje
  if (productos.length === 0) {
    listaProductos.innerHTML = '<p>No tienes productos agregados.</p>';
    return;
  }

  // Recorremos todos los productos y los mostramos
  productos.forEach((producto, index) => {
    const div = document.createElement('div');
    div.classList.add('producto');

    // Insertamos el contenido del producto: nombre, precio, imagen y botones
    div.innerHTML = `
      <h3>${producto.nombre}</h3>
      <p><strong>Precio:</strong> $${producto.precio}</p>
      ${producto.imagen ? `<img src="${producto.imagen}" alt="${producto.nombre}" width="150" />` : ''}
      <div class="acciones">
        <button class="btn-editar" onclick="abrirEditar(${index})">Editar</button>
        <button class="btn-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
      </div>
    `;

    // Agregamos el producto al HTML
    listaProductos.appendChild(div);
  });
}

// FUNCIÓN PARA ELIMINAR UN PRODUCTO
function eliminarProducto(index) {
  // Preguntamos al usuario si está seguro
  if (confirm('¿Estás seguro que quieres eliminar este producto?')) {
    productos.splice(index, 1); // Quitamos el producto del array
    localStorage.setItem('productos', JSON.stringify(productos)); // Guardamos los cambios
    mostrarProductos(); // Actualizamos la pantalla
  }
}

// CUANDO SE ENVÍA EL FORMULARIO PARA AGREGAR UN PRODUCTO

formulario.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevenimos el recargo de la página

  const nombre = document.getElementById('nombreProducto').value.trim();
  const precio = parseFloat(document.getElementById('precioProducto').value);
  const inputImagen = document.getElementById('imagenProducto');

  // Validamos que haya nombre y precio
  if (!nombre || isNaN(precio)) {
    alert('Por favor llena correctamente el nombre y precio.');
    return;
  }

  // Si el usuario subió una imagen
  if (inputImagen.files && inputImagen.files[0]) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const imagenBase64 = event.target.result;

      const nuevoProducto = {
        nombre,
        precio: precio.toFixed(2),
        imagen: imagenBase64,
      };

      productos.push(nuevoProducto); // Agregamos el nuevo producto
      localStorage.setItem('productos', JSON.stringify(productos)); // Guardamos en localStorage
      mostrarProductos(); // Mostramos los productos
      formulario.reset(); // Limpiamos el formulario
    };
    reader.readAsDataURL(inputImagen.files[0]); // Convertimos la imagen a texto base64
  } else {
    // Si no subió imagen
    const nuevoProducto = {
      nombre,
      precio: precio.toFixed(2),
      imagen: '',
    };

    productos.push(nuevoProducto);
    localStorage.setItem('productos', JSON.stringify(productos));
    mostrarProductos();
    formulario.reset();
  }
});

// ABRIR MODAL PARA EDITAR PRODUCTO
function abrirEditar(index) {
  indiceEditando = index; // Guardamos cuál producto estamos editando
  const producto = productos[index];

  // Llenamos el formulario de edición con los datos actuales
  editarNombre.value = producto.nombre;
  editarPrecio.value = producto.precio;
  editarImagen.value = ''; // No se muestra la imagen actual, se debe volver a subir si se quiere cambiar

  modal.style.display = 'block'; // Mostramos el modal
}

// CERRAR MODAL
cerrarModalBtn.onclick = function () {
  modal.style.display = 'none';
};

// Cerrar modal si se hace clic fuera del contenido
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

// GUARDAR CAMBIOS AL EDITAR UN PRODUCTO
formEditar.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevenimos que recargue

  const nombre = editarNombre.value.trim();
  const precio = parseFloat(editarPrecio.value);

  if (!nombre || isNaN(precio)) {
    alert('Por favor llena correctamente el nombre y precio.');
    return;
  }

  // Si se subió una nueva imagen
  if (editarImagen.files && editarImagen.files[0]) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const imagenBase64 = event.target.result;
      guardarCambios(nombre, precio, imagenBase64);
    };
    reader.readAsDataURL(editarImagen.files[0]);
  } else {
    // Si no se cambió la imagen
    guardarCambios(nombre, precio, productos[indiceEditando].imagen);
  }
});

// GUARDAR LOS CAMBIOS DE LA EDICIÓN
function guardarCambios(nombre, precio, imagen) {
  productos[indiceEditando] = {
    nombre,
    precio: precio.toFixed(2),
    imagen,
  };

  localStorage.setItem('productos', JSON.stringify(productos)); // Guardamos la lista actualizada
  mostrarProductos(); // Mostramos los productos actualizados
  modal.style.display = 'none'; // Cerramos el modal
}

// AL CARGAR LA PÁGINA MOSTRAMOS LOS PRODUCTOS
mostrarProductos();

// PERMITIMOS QUE ESTAS FUNCIONES SE PUEDAN USAR EN LOS BOTONES
window.eliminarProducto = eliminarProducto;
window.abrirEditar = abrirEditar;
