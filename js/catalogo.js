// Esperamos a que el contenido del documento esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // Obtenemos todos los botones que tienen la clase 'agregar-carrito'
    const botonesAgregar = document.querySelectorAll('.agregar-carrito');

    // A cada botón le agregamos un evento para cuando se le haga clic
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', () => {
            // Buscamos la tarjeta del producto más cercana al botón
            const tarjeta = boton.closest('.tarjeta-producto');

            // Sacamos los datos del producto desde los atributos de la tarjeta
            const id = tarjeta.dataset.id; // ID del producto
            const nombre = tarjeta.dataset.nombre; // Nombre del producto
            const precio = parseFloat(tarjeta.dataset.precio); // Precio del producto
            const emprendedor = tarjeta.dataset.emprendedor; // Emprendedor que lo vende
            const cantidad = parseInt(tarjeta.querySelector('.entrada-cantidad').value); // Cantidad seleccionada
            const imagen = tarjeta.querySelector('img.imagen-producto').src; // URL de la imagen del producto

            // Creamos un objeto con todos los datos del producto
            const producto = {
                id,
                nombre,
                precio,
                cantidad,
                emprendedor,
                imagen
            };

            // Obtenemos el carrito desde localStorage o un arreglo vacío si no hay nada
            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

            // Verificamos si el producto ya está en el carrito
            const indexExistente = carrito.findIndex(item => item.id === id);

            if (indexExistente !== -1) {
                // Si ya está, solo aumentamos la cantidad
                carrito[indexExistente].cantidad += cantidad;
            } else {
                // Si no está, lo agregamos al carrito
                carrito.push(producto);
            }

            // Guardamos el carrito actualizado en localStorage
            localStorage.setItem('carrito', JSON.stringify(carrito));

            // Mostramos un mensaje al usuario
            alert(`"${nombre}" ha sido añadido al carrito.`);
        });
    });

    // --------- Parte para los botones de sumar y restar cantidad ---------

    // Obtenemos todos los botones de "+" para sumar cantidad
    const botonesSumar = document.querySelectorAll('.sumar-cantidad');
    // Obtenemos todos los botones de "-" para restar cantidad
    const botonesRestar = document.querySelectorAll('.restar-cantidad');

    // Agregamos el evento de clic a los botones de "+"
    botonesSumar.forEach(boton => {
        boton.addEventListener('click', () => {
            // Buscamos el input que está al lado del botón
            const input = boton.parentElement.querySelector('.entrada-cantidad');
            // Aumentamos el valor del input en 1
            input.value = parseInt(input.value) + 1;
        });
    });

    // Agregamos el evento de clic a los botones de "-"
    botonesRestar.forEach(boton => {
        boton.addEventListener('click', () => {
            // Buscamos el input que está al lado del botón
            const input = boton.parentElement.querySelector('.entrada-cantidad');
            // Disminuimos la cantidad solo si es mayor a 1
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
            }
        });
    });
});
