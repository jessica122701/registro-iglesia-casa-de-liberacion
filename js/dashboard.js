import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

async function cargarEstadisticasMiembrosContabilidad() {
    try {
        // 1. Obtener la lista de miembros registrados
        const snapMiembros = await getDocs(collection(db, "miembros"));
        let tablaMiembrosContable = {};

        snapMiembros.forEach(doc => {
            const m = doc.data();
            
            // Evaluamos si el nombre viene en 'nombre', 'nombreCompleto' o separado con 'apellido'
            let nombre = m.nombre || m.nombreCompleto || "";
            if (m.apellido) {
                nombre += ` ${m.apellido}`;
            }
            nombre = nombre.trim();

            if (nombre) {
                // Guardamos la clave original para mostrar y una versión minúscula para comparar
                tablaMiembrosContable[nombre] = {
                    nombreOriginal: nombre,
                    nombreLower: nombre.toLowerCase(),
                    totalDiezmos: 0,
                    totalOfrendas: 0,
                    totalAportado: 0
                };
            }
        });

        // 2. Obtener los movimientos de contabilidad
        const snapContabilidad = await getDocs(collection(db, "contabilidad"));

        snapContabilidad.forEach(doc => {
            const mov = doc.data();
            
            // Solo procesamos Ingresos
            if (mov.tipo === "Ingreso") {
                // Texto donde buscaremos al miembro (mira en mov.miembro y mov.nota)
                const textoMiembro = (mov.miembro || "").toLowerCase();
                const textoNota = (mov.nota || "").toLowerCase();
                const monto = parseFloat(mov.monto) || 0;
                const concepto = (mov.concepto || "").toLowerCase();

                Object.keys(tablaMiembrosContable).forEach(key => {
                    const miembro = tablaMiembrosContable[key];
                    
                    // Comprobamos si el nombre del miembro coincide en el campo 'miembro' o dentro de 'nota'
                    if (
                        (textoMiembro && textoMiembro.includes(miembro.nombreLower)) ||
                        (textoNota && textoNota.includes(miembro.nombreLower))
                    ) {
                        if (concepto.includes("diezmo")) {
                            miembro.totalDiezmos += monto;
                        } else {
                            miembro.totalOfrendas += monto;
                        }
                        
                        miembro.totalAportado += monto;
                    }
                });
            }
        });

        console.log("Estadísticas Contables Calculadas:", tablaMiembrosContable);
        
        // 3. Renderizar en el HTML
        renderizarTablaEstadisticas(tablaMiembrosContable);

    } catch (error) {
        console.error("Error al generar estadísticas contables: ", error);
    }
}

function renderizarTablaEstadisticas(datos) {
    const contenedor = document.getElementById("tablaEstadisticasMiembros");
    if (!contenedor) return;

    contenedor.innerHTML = "";
    
    const claves = Object.keys(datos);
    if (claves.length === 0) {
        contenedor.innerHTML = `<tr><td colspan="4" style="text-align:center;">No hay datos de miembros para mostrar.</td></tr>`;
        return;
    }

    claves.forEach(key => {
        const info = datos[key];
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td><strong>${info.nombreOriginal}</strong></td>
            <td>RD$ ${info.totalDiezmos.toLocaleString('es-DO', {minimumFractionDigits: 2})}</td>
            <td>RD$ ${info.totalOfrendas.toLocaleString('es-DO', {minimumFractionDigits: 2})}</td>
            <td style="color:#10b981; font-weight:bold;">RD$ ${info.totalAportado.toLocaleString('es-DO', {minimumFractionDigits: 2})}</td>
        `;
        contenedor.appendChild(fila);
    });
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarEstadisticasMiembrosContabilidad();
});