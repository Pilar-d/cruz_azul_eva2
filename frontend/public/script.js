// Variable de estado para saber si el admin está logueado
let esAdminLogueado = false;

// ==========================================
// 1. NAVEGACIÓN Y ACCESO
// ==========================================

function abrirLogin() {
    // Si ya inició sesión, lo llevamos directo al panel en lugar de pedir clave
    if (esAdminLogueado) {
        mostrarSeccion('admin');
    } else {
        document.getElementById('modal-login').classList.remove('hidden');
    }
}

function cerrarLogin() {
    document.getElementById('modal-login').classList.add('hidden');
}

function mostrarSeccion(seccion) {
    const inicio = document.getElementById('sec-inicio');
    const admin = document.getElementById('sec-admin');

    if(seccion === 'admin' && esAdminLogueado) {
        inicio.classList.add('hidden');
        admin.classList.remove('hidden');
        cargarProductos();
    } else {
        // Por defecto mostramos el inicio público
        inicio.classList.remove('hidden');
        admin.classList.add('hidden');
        // Si no es admin logueado, nos aseguramos que cargue el catálogo público
        cargarProductos(); 
    }
}

// Evento Login
document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;

    if(user === 'admin' && pass === 'cruzazul2026') {
        esAdminLogueado = true; // Guardamos el estado de la sesión
        cerrarLogin();
        document.getElementById('btn-admin').textContent = "Mi Panel Admin";
        document.getElementById('btn-logout').classList.remove('hidden');
        mostrarSeccion('admin');
    } else {
        alert('Acceso denegado: Credenciales incorrectas');
    }
});

function logout() {
    esAdminLogueado = false;
    location.reload();
}

// ==========================================
// 2. GESTIÓN DE PRODUCTOS (POST)
// ==========================================

function abrirModalAgregar() {
    document.getElementById('modal-agregar').classList.remove('hidden');
}

function cerrarModalAgregar() {
    document.getElementById('modal-agregar').classList.add('hidden');
    document.getElementById('form-agregar').reset();
}

document.getElementById('form-agregar').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nuevo-nombre').value;
    const precio = document.getElementById('nuevo-precio').value;
    const stock = document.getElementById('nuevo-stock').value;

    try {
        const response = await fetch('/api/productos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, precio, stock })
        });

        if (response.ok) {
            cerrarModalAgregar();
            cargarProductos();
            alert('Producto añadido con éxito.');
        }
    } catch (error) {
        alert('Error al conectar con el servidor.');
    }
});

// ==========================================
// 3. CARGA DINÁMICA DE DATOS (GET)
// ==========================================

async function cargarProductos() {
    const listaAdmin = document.getElementById('lista-productos');
    const catalogoPublico = document.getElementById('catalogo-publico');
    
    // Indicadores de carga
    if (listaAdmin) listaAdmin.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-slate-400">Consultando base de datos...</td></tr>';
    
    try {
        const response = await fetch('/api/productos');
        const productos = await response.json();
        
        if (listaAdmin) listaAdmin.innerHTML = '';
        if (catalogoPublico) catalogoPublico.innerHTML = '';

        productos.forEach(p => {
            // Render para Panel Admin (Tabla)
            if (listaAdmin) {
                listaAdmin.innerHTML += `
                    <tr class="border-b hover:bg-slate-50 transition">
                        <td class="p-4 font-medium text-slate-800">${p.nombre}</td>
                        <td class="p-4 text-blue-700 font-bold">$${p.precio}</td>
                        <td class="p-4">
                            <span class="px-2 py-1 ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} rounded-md text-xs font-bold">
                                ${p.stock} uds
                            </span>
                        </td>
                        <td class="p-4 text-right">
                            <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">Editar</button>
                        </td>
                    </tr>
                `;
            }

            // Render para Catálogo Público (Cards)
            if (catalogoPublico) {
                catalogoPublico.innerHTML += `
                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all transform hover:-translate-y-1">
                        <div class="h-32 bg-slate-50 rounded-xl mb-4 flex items-center justify-center text-4xl">💊</div>
                        <h3 class="font-bold text-slate-800 mb-1">${p.nombre}</h3>
                        <p class="text-xs text-slate-500 mb-4">Disponible para entrega inmediata</p>
                        <div class="flex justify-between items-center border-t pt-4">
                            <span class="text-xl font-black text-blue-700">$${p.precio}</span>
                            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition">Añadir</button>
                        </div>
                    </div>
                `;
            }
        });
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// Carga inicial
window.addEventListener('DOMContentLoaded', cargarProductos);