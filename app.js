const contenedor = document.getElementById('inventario-container');
const buscador = document.getElementById('buscador');

let inventarioGlobal = []; 

// 1. Función para cargar el JSON
async function cargarInventario() {
    try {
        const respuesta = await fetch('autos.json');
        inventarioGlobal = await respuesta.json();
        mostrarAutos(inventarioGlobal);
    } catch (error) {
        console.error('Error al cargar el inventario:', error);
        contenedor.innerHTML = '<p>Error al cargar el inventario.</p>';
    }
}


function mostrarAutos(autos) {
    contenedor.innerHTML = ''; 

    if (autos.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron autos con esa búsqueda.</p>';
        return;
    }

    autos.forEach(auto => {
        
        const kilometrajeText = auto.kilometraje > 0 ? `${auto.kilometraje.toLocaleString('es-MX')} km` : 'No especificado';
        
        
         const tarjetaHTML = `
            <div class="tarjeta-auto">
                <img src="${auto.imagen}" alt="${auto.marca} ${auto.modelo}">
                <div class="info-auto">
                    <h2>${auto.marca} ${auto.modelo} ${auto.version} (${auto.año})</h2>
                    <p style="font-size: 0.9em; color: #777;">📌 Sucursal: ${auto.ubicacion} | ⚙️ ${auto.transmision}</p>
                    <p class="precio">Precio: $${auto.precio.toLocaleString('es-MX')}</p>
                    <p><strong>Enganche desde:</strong> $${auto.enganche.toLocaleString('es-MX')}</p>
                    <p><strong>Mensualidad:</strong> $${auto.mensualidad.toLocaleString('es-MX')}</p>
                    <p><strong>Kilometraje:</strong> ${kilometrajeText}</p>
                </div>
            </div>
        `;
        contenedor.innerHTML += tarjetaHTML;
    });
}


buscador.addEventListener('input', (evento) => {
    const textoBusqueda = evento.target.value.toLowerCase();
    
    const autosFiltrados = inventarioGlobal.filter(auto => {
        const marca = auto.marca.toLowerCase();
        const modelo = auto.modelo.toLowerCase();
        return marca.includes(textoBusqueda) || modelo.includes(textoBusqueda);
    });

    mostrarAutos(autosFiltrados);
});

cargarInventario();