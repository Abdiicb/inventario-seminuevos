const contenedor = document.getElementById('inventario-container');
const buscador = document.getElementById('buscador');

// Guardamos los datos globalmente para poder filtrarlos más adelante sin tener que volver a descargarlos
let inventarioGlobal = []; 

// 1. Función para cargar el JSON
async function cargarInventario() {
    try {
        const respuesta = await fetch('autos.json');
        inventarioGlobal = await respuesta.json();
        
        // Mostramos todos los autos al cargar la página
        mostrarAutos(inventarioGlobal);
    } catch (error) {
        console.error('Error al cargar el inventario:', error);
        contenedor.innerHTML = '<p>Error al cargar el inventario.</p>';
    }
}

// 2. Función para dibujar las tarjetas en el HTML
function mostrarAutos(autos) {
    contenedor.innerHTML = ''; // Limpiamos el contenedor antes de dibujar

    // Si la búsqueda no coincide con nada
    if (autos.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron autos con esa búsqueda.</p>';
        return;
    }

    autos.forEach(auto => {
        const tarjetaHTML = `
            <div class="tarjeta-auto">
                <img src="${auto.imagen}" alt="${auto.marca} ${auto.modelo}">
                <div class="info-auto">
                    <h2>${auto.marca} ${auto.modelo} (${auto.año})</h2>
                    <p class="precio">$${auto.precio.toLocaleString('es-MX')}</p>
                    <p><strong>Kilometraje:</strong> ${auto.kilometraje.toLocaleString('es-MX')} km</p>
                </div>
            </div>
        `;
        contenedor.innerHTML += tarjetaHTML;
    });
}

// 3. Evento para escuchar cuando el usuario escribe en el buscador
buscador.addEventListener('input', (evento) => {
    // Convertimos lo que escribe a minúsculas para que sea más fácil buscar
    const textoBusqueda = evento.target.value.toLowerCase();
    
    // Filtramos el arreglo global
    const autosFiltrados = inventarioGlobal.filter(auto => {
        const marca = auto.marca.toLowerCase();
        const modelo = auto.modelo.toLowerCase();
        
        // Retorna "true" si la marca o el modelo incluyen el texto escrito
        return marca.includes(textoBusqueda) || modelo.includes(textoBusqueda);
    });

    // Volvemos a dibujar las tarjetas, pero esta vez solo con los que pasaron el filtro
    mostrarAutos(autosFiltrados);
});

// Arrancar la aplicación
cargarInventario();