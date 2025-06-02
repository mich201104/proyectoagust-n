// Esperamos a que se cargue toda la página antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {

    // Obtenemos los elementos del HTML que vamos a usar
    const carritoVacio = document.getElementById("carrito-vacio"); // Mensaje de carrito vacío
    const carritoConProductos = document.getElementById("carrito-con-productos"); // Sección donde van los productos
    const listaCarrito = document.getElementById("lista-carrito"); // Contenedor de los productos del carrito
    const subtotalElemento = document.getElementById("subtotal"); // Muestra el subtotal
    const envioElemento = document.getElementById("envio"); // Muestra el costo del envío
    const totalElemento = document.getElementById("total"); // Muestra el total

    // Cargamos los productos guardados en el carrito desde el localStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Esta función actualiza lo que se ve en el carrito
    function actualizarCarrito() {
        // Limpiamos el contenido del carrito antes de volver a pintarlo
        listaCarrito.innerHTML = "";

        // Si el carrito está vacío, mostramos el mensaje correspondiente
        if (carrito.length === 0) {
            carritoVacio.style.display = "block"; // Mostrar mensaje
            carritoConProductos.style.display = "none"; // Ocultar lista
            localStorage.removeItem("carrito"); // Borrar del almacenamiento
            return; // Salimos de la función
        }

        // Si hay productos, mostramos la lista y ocultamos el mensaje vacío
        carritoVacio.style.display = "none";
        carritoConProductos.style.display = "block";

        let subtotal = 0; // Aquí sumaremos el total sin envío

        // Recorremos cada producto del carrito para mostrarlo
        carrito.forEach((producto, index) => {
            // Creamos un div para cada producto
            const item = document.createElement("div");
            item.classList.add("producto-carrito"); // Le damos una clase para estilo

            // Escribimos el contenido del producto (imagen, nombre, precio, etc.)
            item.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-producto" />
                <div class="info">
                    <h3>${producto.nombre}</h3>
                    <p>Precio: $${producto.precio} c/u</p>
                    <label>
                      Cantidad: 
                      <input type="number" min="1" value="${producto.cantidad}" class="cantidad-input" data-index="${index}">
                    </label>
                    <p>Total: $${producto.precio * producto.cantidad}</p>
                    <button class="eliminar-producto" data-index="${index}">Eliminar</button>
                </div>
            `;

            // Agregamos el producto al contenedor
            listaCarrito.appendChild(item);

            // Sumamos el subtotal
            subtotal += producto.precio * producto.cantidad;
        });

        // Calculamos el envío (solo si hay productos, se cobra $50)
        const envio = subtotal > 0 ? 50 : 0;

        // Sumamos el total (subtotal + envío)
        const total = subtotal + envio;

        // Mostramos los valores en la página
        subtotalElemento.textContent = `$${subtotal}`;
        envioElemento.textContent = `$${envio}`;
        totalElemento.textContent = `$${total}`;

        // ---- Eventos para eliminar productos ----
        const botonesEliminar = document.querySelectorAll(".eliminar-producto");
        botonesEliminar.forEach(boton => {
            boton.addEventListener("click", (e) => {
                // Obtenemos el índice del producto que se quiere eliminar
                const index = e.target.getAttribute("data-index");
                carrito.splice(index, 1); // Lo quitamos del arreglo
                localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardamos cambios
                actualizarCarrito(); // Volvemos a pintar el carrito
            });
        });

        // Eventos para cambiar la cantidad 
        const inputsCantidad = document.querySelectorAll(".cantidad-input");
        inputsCantidad.forEach(input => {
            input.addEventListener("change", (e) => {
                const index = e.target.getAttribute("data-index"); // Obtenemos el producto
                let nuevaCantidad = parseInt(e.target.value); // Leemos el nuevo valor

                // Si el valor es inválido o menor a 1, lo ponemos en 1
                if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
                    nuevaCantidad = 1;
                    e.target.value = 1;
                }

                // Actualizamos la cantidad en el carrito
                carrito[index].cantidad = nuevaCantidad;
                localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardamos cambios
                actualizarCarrito(); // Volvemos a actualizar la vista
            });
        });
    }

    // Llamamos a la función para que se vea el carrito cuando se abra la página
    actualizarCarrito();
});
