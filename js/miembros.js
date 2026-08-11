// Importar la configuración y funciones de Firebase
import { db } from "./firebase-config.js"; 
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let todosLosMiembros = []; // Guardará una copia local para la búsqueda rápida

document.addEventListener('DOMContentLoaded', () => {
    cargarMiembrosFirebase();

    // Evento de búsqueda en tiempo real
    const buscador = document.getElementById('buscador');
    if (buscador) {
        buscador.addEventListener('input', filtrarMiembros);
    }
});

// Función para leer los datos desde Firestore
async function cargarMiembrosFirebase() {
    const tbody = document.getElementById('tablaMiembros');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="8" style="padding: 15px;">⏳ Cargando miembros desde la base de datos...</td></tr>';

    try {
        const querySnapshot = await getDocs(collection(db, "miembros"));
        
        todosLosMiembros = [];

        querySnapshot.forEach((doc) => {
            todosLosMiembros.push({ id: doc.id, ...doc.data() });
        });

        renderizarTabla(todosLosMiembros);

    } catch (error) {
        console.error("Error al cargar los miembros de Firebase:", error);
        tbody.innerHTML = '<tr><td colspan="8" style="color: red; padding: 15px;">⚠️ Error al cargar los datos. Revisa la consola o los permisos de Firebase.</td></tr>';
    }
}

// Función para pintar las filas en la tabla
function renderizarTabla(lista) {
    const tbody = document.getElementById('tablaMiembros');
    tbody.innerHTML = '';

    if (lista.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="padding: 15px;">No se encontraron registros de miembros.</td></tr>';
        return;
    }

    lista.forEach(m => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>${m.nombre || m.nombreCompleto || '-'}</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${m.telefono || m.celular || '-'}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${m.tipoPersona || m.rol || 'Miembro'}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${m.bautizado || 'No'}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${m.clase || '-'}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${m.ministerios || m.ministerio || '-'}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${m.tutor || m.madre || '-'}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${m.talentos || m.gustos || m.notas || '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Función del buscador
function filtrarMiembros(e) {
    const texto = e.target.value.toLowerCase();
    const filtrados = todosLosMiembros.filter(m => {
        const nombre = (m.nombre || m.nombreCompleto || '').toLowerCase();
        const telefono = (m.telefono || '').toLowerCase();
        const rol = (m.tipoPersona || m.rol || '').toLowerCase();
        const ministerio = (m.ministerios || m.ministerio || '').toLowerCase();

        return nombre.includes(texto) || telefono.includes(texto) || rol.includes(texto) || ministerio.includes(texto);
    });

    renderizarTabla(filtrados);
}
