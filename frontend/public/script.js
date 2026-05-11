// ==========================================
// 1. LÓGICA DE NAVEGACIÓN Y LOGIN
// ==========================================

function abrirLogin() {
    document.getElementById('modal-login').classList.remove('hidden');
}

function cerrarLogin() {
    document.getElementById('modal-login').classList.add('hidden');
}

function mostrarSeccion(seccion) {
    if(seccion === 'admin') {
        document.getElementById('sec-inicio').classList.add('hidden');
        document.getElementById('sec-admin').classList.remove('hidden');
    } else {
        document.getElementById('sec-inicio').classList.remove('hidden');
        document.getElementById('sec-admin').classList.add('hidden');
    }
}

function logout() {
    location.reload(); // Recarga la página para cerrar sesión
}

// Evento de Login
document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;

    // Simulación de validación (El usuario es 'admin', clave 'cruzazul2026')
    if(user === 'admin' && pass === 'cruzazul2026') {
        cerrarLogin();
        document.getElementById('btn-admin').classList.add('hidden');
        document.getElementById('btn-logout').classList.remove('hidden');
        mostrarSeccion('admin');
        cargarProductos(); // Cargamos la tabla al entrar
    } else {
        alert('Credenciales incorrectas');
    }
});


// ==========================================
// 2. LÓGICA DE CREACIÓN DE PRODUCTOS (POST)
// ==========================================

function abrirModalAgregar() {
    document.getElementById('modal-agregar').classList.remove('hidden');
}

function cerrarModalAgregar() {
    document.getElementById('modal-agregar').classList.add('hidden');
    document.getElementById('form-agregar').reset(); // Limpia los campos
}

// Evento para enviar nuevo producto al Backend
document.getElementById('form-agregar').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Capturar los datos del formulario
    const nombre = document.getElementById('nuevo-nombre').value;
    const precio = document.getElementById('nuevo-precio').value;
    const stock = document.getElementById('nuevo-stock').value;

    try {
        // Enviar datos por POST al backend Node.js
        const response = await fetch('/api/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, precio, stock })
        });

        if (response.ok) {
            cerrarModalAgregar();
            cargarProductos(); // Refrescar las vistas inmediatamente
            alert('¡Producto guardado exitosamente en la base de datos!');
        } else {
            alert('Hubo un problema al guardar el producto.');
        }
    } catch (error) {
        alert('Error de conexión con el servidor PostgreSQL.');
        console.error(error);
    }
});


// ==========================================
// 3. LÓGICA DE VISUALIZACIÓN MULTI-VISTA (GET)
// ==========================================

async function cargarProductos() {
    const listaAdmin = document.getElementById('lista-productos');
    const catalogoPublico = document.getElementById('catalogo-publico');
    
    // Estados de carga
    if (listaAdmin) listaAdmin.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-slate-400 italic">Cargando base de datos...</td></tr>';
    if (catalogoPublico) catalogoPublico.innerHTML = '<p class="text-center col-span-full text-slate-500">Cargando catálogo desde la base de datos...</p>';
    
    try {
        // Solicitar datos al backend
        const response = await fetch('/api/productos');
        const productos = await response.json();
        
        // Limpiar contenedores
        if (listaAdmin) listaAdmin.innerHTML = '';
        if (catalogoPublico) catalogoPublico.innerHTML = '';

        // Si no hay productos, mostrar mensaje
        if (productos.length === 0) {
            if (catalogoPublico) catalogoPublico.innerHTML = '<p class="text-center col-span-full text-slate-500 italic">No hay medicamentos registrados en el sistema aún.</p>';
            if (listaAdmin) listaAdmin.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-slate-400 italic">Inventario vacío. Usa el botón verde para agregar productos.</td></tr>';
            return;
        }

        // Inyectar la data iterando sobre el JSON
        productos.forEach(p => {
            
            // Renderizado: Vista de Administrador (Tabla)
            if (listaAdmin) {
                listaAdmin.innerHTML += `
                    <tr class="border-b hover:bg-slate-50 transition">
                        <td class="p-4 font-medium">${p.nombre}</td>
                        <td class="p-4 text-blue-600 font-bold">$${p.precio}</td>
                        <td class="p-4"><span class="px-2 py-1 ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} rounded-md text-xs font-bold">${p.stock} uds</span></td>
                        <td class="p-4 text-right"><button class="text-slate-400 hover:text-blue-600">Editar</button></td>
                    </tr>
                `;
            }

            // Renderizado: Vista Pública de Clientes (Tarjetas Grid)
            if (catalogoPublico) {
                catalogoPublico.innerHTML += `
                    <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition">
                        <div>
                            <h3 class="font-bold text-lg text-slate-800 mb-1">${p.nombre}</h3>
                            <p class="text-sm ${p.stock > 0 ? 'text-green-600' : 'text-red-500'} mb-4 font-medium">
                                ${p.stock > 0 ? '✓ Disponible' : '✗ Sin stock'}
                            </p>
                        </div>
                        <div class="flex justify-between items-center border-t border-slate-100 pt-4">
                            <span class="text-2xl font-black text-blue-700">$${p.precio}</span>
                            <button class="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-100 transition">Comprar</button>
                        </div>
                    </div>
                `;
            }
        });
    } catch (error) {
        if (listaAdmin) listaAdmin.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-red-500 font-bold">Error al conectar con la base de datos PostgreSQL.</td></tr>';
        if (catalogoPublico) catalogoPublico.innerHTML = '<p class="text-red-500 text-center col-span-full font-bold">Servicio temporalmente no disponible.</p>';
        console.error("Error obteniendo productos:", error);
    }
}

// Ejecutar cargarProductos() apenas el cliente entra a la página web
window.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
});