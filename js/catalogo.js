// catalogo.js - Adaptado para tu estructura

document.addEventListener('DOMContentLoaded', function () {
    // Manejar botones de cantidad
    document.querySelectorAll('.quantity-minus').forEach(button => {
        button.addEventListener('click', disminuirCantidad);
    });

    document.querySelectorAll('.quantity-plus').forEach(button => {
        button.addEventListener('click', aumentarCantidad);
    });

    // Manejar botones de añadir al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', agregarAlCarrito);
    });

    // Actualizar contador al cargar
    actualizarContadorCarrito();
});

function disminuirCantidad(event) {
    const input = event.target.nextElementSibling;
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function aumentarCantidad(event) {
    const input = event.target.previousElementSibling;
    input.value = parseInt(input.value) + 1;
}

function agregarAlCarrito(event) {
    const productCard = event.target.closest('.product-card');
    const cantidad = parseInt(productCard.querySelector('.quantity-input').value);
    const precioTexto = productCard.querySelector('.product-price').textContent;
    const precio = parseFloat(precioTexto.replace(/[^0-9.]/g, ''));

    const producto = {
        id: productCard.dataset.id,
        nombre: productCard.dataset.nombre,
        precio: precio,
        emprendedor: productCard.dataset.emprendedor,
        cantidad: cantidad,
        imagen: productCard.querySelector('.product-image').src
    };

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Verificar si el producto ya está en el carrito
    const index = carrito.findIndex(item => item.id === producto.id);

    if (index !== -1) {
        // Actualizar cantidad si ya existe
        carrito[index].cantidad += producto.cantidad;
    } else {
        // Agregar nuevo producto
        carrito.push(producto);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Feedback visual
    mostrarFeedbackAgregado(productCard);
    actualizarContadorCarrito();
}

function mostrarFeedbackAgregado(element) {
    const feedback = document.createElement('div');
    feedback.className = 'add-to-cart-feedback';
    feedback.textContent = '¡Añadido!';
    element.appendChild(feedback);

    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

    document.querySelectorAll('.cart-count').forEach(span => {
        span.textContent = totalItems;
    });
}

// Hacer funciones disponibles globalmente
window.agregarAlCarrito = agregarAlCarrito;
window.actualizarContadorCarrito = actualizarContadorCarrito;