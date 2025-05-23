// Genera un ID único para cada producto
function generarId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Guardar producto en localStorage
function guardarProducto(producto) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.push(producto);
    localStorage.setItem("productos", JSON.stringify(productos));
}

// Cargar productos del emprendedor logueado
function cargarProductosEmprendedor(usuarioId) {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const productosFiltrados = productos.filter(p => p.emprendedorId === usuarioId);
    const contenedor = document.getElementById("productos-lista");

    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = "<p>No tienes productos aún.</p>";
        return;
    }

    productosFiltrados.forEach(producto => {
        const productoHTML = `
            <div class="producto-item" data-id="${producto.id}">
                <img src="${producto.imagen}" alt="${producto.nombre}" width="100">
                <h4>${producto.nombre}</h4>
                <p>Precio: $<span class="precio">${producto.precio}</span></p>
                
                <input type="number" class="nuevo-precio" step="0.01" value="${producto.precio}">
                <button onclick="editarPrecio('${producto.id}', this)">Guardar Precio</button>
                <button onclick="eliminarProducto('${producto.id}')">Eliminar</button>
            </div>
        `;
        contenedor.innerHTML += productoHTML;
    });
}

// Editar precio del producto
function editarPrecio(id, boton) {
    const nuevoPrecio = parseFloat(boton.previousElementSibling.value);
    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    productos = productos.map(p => {
        if (p.id === id) {
            p.precio = nuevoPrecio;
        }
        return p;
    });

    localStorage.setItem("productos", JSON.stringify(productos));
    boton.parentElement.querySelector('.precio').textContent = nuevoPrecio.toFixed(2);
    alert("Precio actualizado.");
}

function eliminarProducto(id) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos = productos.filter(p => p.id !== id);
    localStorage.setItem("productos", JSON.stringify(productos));
    refrescarProductos(); // Refresca la lista
}

// Manejo del formulario
document.addEventListener('DOMContentLoaded', function () {
    const usuario = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!usuario || usuario.tipo !== 'emprendedor') {
        window.location.href = 'index.html';
    }

    cargarProductosEmprendedor(usuario.id);

    document.getElementById("productForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const nombre = document.getElementById("productName").value.trim();
        const precio = parseFloat(document.getElementById("productPrice").value);
        const descripcion = document.getElementById("productDescription").value.trim();
        const imagenInput = document.getElementById("productImage");

        // Simular carga de imagen como base64
        const lector = new FileReader();
        lector.onload = function () {
            const producto = {
                id: generarId(),
                emprendedorId: usuario.id,
                nombre,
                precio,
                descripcion,
                imagen: lector.result
            };

            guardarProducto(producto);
            alert("Producto guardado correctamente.");

            // Recargar lista de productos
            location.reload(); // O mejor: actualizar solo la sección
        };

        if (imagenInput.files[0]) {
            lector.readAsDataURL(imagenInput.files[0]);
        } else {
            alert("Por favor selecciona una imagen.");
        }
    });
});