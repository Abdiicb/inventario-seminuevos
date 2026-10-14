const contenedor = document.getElementById('inventario-container');
const buscador = document.getElementById('buscador');

let inventarioGlobal = []; 

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
        const kmStr = auto.km_aprox ? auto.km_aprox.toLocaleString('es-MX') + ' km' : 'N/D';
        const versionStr = auto.version ? auto.version : '';
        
        let imagenesHTML = '';
        let botonesHTML = '';
        
        if (auto.imagenes && auto.imagenes.length > 0) {
            auto.imagenes.forEach(imgUrl => {
                imagenesHTML += `<img src="${imgUrl}" alt="${auto.marca} ${auto.modelo}">`;
            });
            
            // Dibuja los botones solo si hay más de 1 imagen
            if (auto.imagenes.length > 1) {
                botonesHTML = `
                    <button class="btn-carrusel izq" onclick="moverCarrusel('${auto.inv}', -1)">&#10094;</button>
                    <button class="btn-carrusel der" onclick="moverCarrusel('${auto.inv}', 1)">&#10095;</button>
                `;
            }
        } else {
            const fotoSola = auto.imagen || "https://placehold.co/600x400/1a252f/ffffff?text=FOTO+PENDIENTE";
            imagenesHTML = `<img src="${fotoSola}" alt="${auto.marca} ${auto.modelo}">`;
        }

        const tarjetaHTML = `
            <div class="tarjeta-auto">
                <div class="carrusel-contenedor">
                    ${botonesHTML}
                    <div class="carrusel" id="carrusel-${auto.inv}">
                        ${imagenesHTML}
                    </div>
                </div>
                <div class="info-auto">
                    <h2>${auto.marca} ${auto.modelo} ${versionStr} (${auto.año})</h2>
                    <p class="proveedor">📌 Proveedor: ${auto.ubicacion} | ⚙️ ${auto.transmision}</p>
                    
                    <p class="precio">Precio: $${auto.precio.toLocaleString('es-MX')}</p>
                    <p><strong>Enganche desde:</strong> $${auto.enganche.toLocaleString('es-MX')}</p>
                    <p><strong>Mensualidad:</strong> $${auto.mensual.toLocaleString('es-MX')}</p>
                    <p><strong>Kilometraje:</strong> ${kmStr}</p>
                    
                    <details class="ver-mas">
                        <summary>Ver más detalles</summary>
                        <div class="detalles-extra">
                            <p><strong># Inv:</strong> ${auto.inv}</p>
                            <p><strong>Tipo:</strong> ${auto.tipo}</p>
                            <p><strong>Color:</strong> ${auto.color}</p>
                            <p><strong>Origen:</strong> ${auto.nal_imp}</p>
                            <p><strong>Plazo:</strong> ${auto.meses} meses</p>
                            <p><strong>Pago Anual:</strong> $${auto.anual.toLocaleString('es-MX')}</p>
                            <p><strong># Anualidades:</strong> ${auto.anualidad}</p>
                        </div>
                    </details>
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


function moverCarrusel(invId, direccion) {
    const carrusel = document.getElementById(`carrusel-${invId}`);
    const anchoImagen = carrusel.clientWidth; 
    carrusel.scrollBy({
        left: anchoImagen * direccion, 
        behavior: 'smooth' 
    });
}

cargarInventario();