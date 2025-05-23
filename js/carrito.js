// carrito.js - Manejo completo del carrito

document.addEventListener('DOMContentLoaded', function () {
    // Inicializar carrito si no existe
    if (!localStorage.getItem('carrito')) {
        localStorage.setItem('carrito', JSON.stringify([]));
    }

    // Mostrar carrito
    mostrarCarrito();

    // Eventos
    document.getElementById('vaciar-carrito')?.addEventListener('click', vaciarCarrito);
    document.getElementById('proceder-pago')?.addEventListener('click', procederAlPago);
});

function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const lista = document.getElementById('lista-carrito');
    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoConProductos = document.getElementById('carrito-con-productos');

    if (carrito.length === 0) {
        carritoVacio.style.display = 'block';
        carritoConProductos.style.display = 'none';
        return;
    }

    carritoVacio.style.display = 'none';
    carritoConProductos.style.display = 'block';
    lista.innerHTML = '';

    let subtotal = 0;

    carrito.forEach((producto, index) => {
        const precioTotal = producto.precio * producto.cantidad;
        subtotal += precioTotal;

        lista.innerHTML += `
            <div class="cart-item">
                <div class="item-image">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>
                <div class="item-details">
                    <h3>${producto.nombre}</h3>
                    <p>Vendedor: ${producto.emprendedor}</p>
                    <p>Precio unitario: $${producto.precio.toFixed(2)}</p>
                    <div class="item-quantity">
                        <button onclick="actualizarCantidad(${index}, -1)">-</button>
                        <span>${producto.cantidad}</span>
                        <button onclick="actualizarCantidad(${index}, 1)">+</button>
                    </div>
                    <p>Subtotal: $${precioTotal.toFixed(2)}</p>
                </div>
                <button class="item-remove" onclick="eliminarProducto(${index})">
                    <img src="../images/eliminar.png" alt="Eliminar">
                </button>
            </div>
        `;
    });

    // Calcular totales
    const envio = subtotal > 1000 ? 0 : 50; // Ejemplo: envío gratis sobre $1000
    const total = subtotal + envio;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('envio').textContent = `$${envio.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;

    actualizarContadorCarrito();
}

function actualizarCantidad(index, cambio) {
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    carrito[index].cantidad += cambio;

    // Eliminar si la cantidad es 0 o menos
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

function eliminarProducto(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

function vaciarCarrito() {
    if (confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
        localStorage.setItem('carrito', JSON.stringify([]));
        mostrarCarrito();
    }
}

function procederAlPago() {
    const carrito = JSON.parse(localStorage.getItem('carrito'));
    if (carrito && carrito.length > 0) {
        window.location.href = 'pago.html';
    } else {
        alert('Tu carrito está vacío');
    }
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        contador.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);
    }
}

// Hacer funciones disponibles globalmente
window.actualizarCantidad = actualizarCantidad;
window.eliminarProducto = eliminarProducto;
window.actualizarContadorCarrito = actualizarContadorCarrito;