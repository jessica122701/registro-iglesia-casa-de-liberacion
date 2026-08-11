import { db } from "./firebase-config.js";
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ==========================================
// 1. INICIALIZACIÓN Y VERIFICACIÓN
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // Verificación de Acceso Admin
    if (localStorage.getItem("esAdmin") !== "true") {
        alert("Acceso denegado. Por favor inicia sesión como Administrador.");
        window.location.href = "index.html";
        return;
    }

    // Cargar Miembros Registrados en el selector
    cargarSelectorMiembros();

    // Renderizar Contabilidad desde Firebase
    renderizarContabilidad();

    // Event listener para cambiar categorías según tipo de movimiento
    const tipoMov = document.getElementById("tipoMovimiento");
    if (tipoMov) {
        tipoMov.addEventListener("change", actualizarCategorias);
    }
});

// Cerrar sesión
window.cerrarSesion = function() {
    localStorage.removeItem("esAdmin");
    localStorage.removeItem("adminSesion");
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "index.html";
};

// ==========================================
// 2. AUXILIARES DE FORMULARIO Y SELECTORES (CORREGIDO)
// ==========================================
async function cargarSelectorMiembros() {
    const selector = document.getElementById("miembroAsociado");
    if (!selector) return;

    try {
        // Traemos los documentos de la colección 'miembros' sin filtros que puedan fallar
        const querySnapshot = await getDocs(collection(db, "miembros"));
        selector.innerHTML = '<option value="">-- Seleccionar Miembro Registrado --</option>';

        let listaMiembros = [];

        querySnapshot.forEach((docSnap) => {
            const m = docSnap.data();
            
            // Toma el nombre tal como lo guarda tu formulario de registro (m.nombre)
            const nombreCompleto = m.nombre ? m.nombre.trim() : "";
            
            if (nombreCompleto) {
                listaMiembros.push(nombreCompleto);
            }
        });

        // Ordenar los nombres alfabéticamente de la A a la Z
        listaMiembros.sort((a, b) => a.localeCompare(b));

        // Insertar en el selector de la página de Contabilidad
        listaMiembros.forEach(nombre => {
            const option = document.createElement("option");
            option.value = nombre;
            option.textContent = nombre;
            selector.appendChild(option);
        });

        console.log(`¡Éxito! Se cargaron ${listaMiembros.length} miembros en el selector.`);

    } catch (error) {
        console.error("Error al cargar selector de miembros desde Firebase: ", error);
    }
}

window.actualizarCategorias = function() {
    const tipoElem = document.getElementById("tipoMovimiento");
    const selectConcepto = document.getElementById("concepto");
    if (!tipoElem || !selectConcepto) return;

    const tipo = tipoElem.value;
    selectConcepto.innerHTML = "";

    if (tipo === "Ingreso") {
        selectConcepto.innerHTML = `
            <option value="Ofrenda Regular del Culto">Ofrenda Regular del Culto</option>
            <option value="Diezmo">Diezmo</option>
            <option value="Pro-Templo">Ofrenda Pro-Templo</option>
            <option value="Eventos">Ofrenda para Eventos</option>
            <option value="Ministerio de Niños">Ministerio de Niños</option>
        `;
    } else {
        selectConcepto.innerHTML = `
            <option value="Gasto Servicios (Luz/Agua)">Servicios (Luz, Agua, Internet)</option>
            <option value="Gasto Pro-Templo">Construcción / Reparación Pro-Templo</option>
            <option value="Gasto Eventos">Gastos de Eventos</option>
            <option value="Gasto Ministerio Niños">Materiales Ministerio de Niños</option>
            <option value="Otro Gasto General">Otro Gasto General</option>
        `;
    }
};

// ==========================================
// 3. REGISTRAR MOVIMIENTO
// ==========================================
const formContabilidad = document.getElementById("formContabilidad");
if (formContabilidad) {
    formContabilidad.addEventListener("submit", async function(e) {
        e.preventDefault();

        const btnSubmit = formContabilidad.querySelector('button[type="submit"]');
        const textoOriginalBtn = btnSubmit ? btnSubmit.innerHTML : 'Guardar';
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '⏳ Registrando...';
        }

        const tipo = document.getElementById("tipoMovimiento").value;
        const culto = document.getElementById("diaCulto").value;
        const concepto = document.getElementById("concepto").value;
        const monto = parseFloat(document.getElementById("monto").value) || 0;
        
        const miembroSeleccionado = document.getElementById("miembroAsociado") ? document.getElementById("miembroAsociado").value : '';
        const notaTexto = document.getElementById("nota") ? document.getElementById("nota").value.trim() : '';

        let notaFinal = "-";
        if (miembroSeleccionado && notaTexto) {
            notaFinal = `${miembroSeleccionado} (${notaTexto})`;
        } else if (miembroSeleccionado) {
            notaFinal = miembroSeleccionado;
        } else if (notaTexto) {
            notaFinal = notaTexto;
        }

        const hoy = new Date();
        const fecha = hoy.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' });

        const nuevoMovimiento = {
            fecha: fecha,
            tipo: tipo,
            culto: culto,
            concepto: concepto,
            monto: monto,
            nota: notaFinal,
            timestamp: Date.now()
        };

        try {
            await addDoc(collection(db, "contabilidad"), nuevoMovimiento);
            formContabilidad.reset();
            if (typeof window.actualizarCategorias === "function") window.actualizarCategorias();
            await renderizarContabilidad();
            alert("¡Movimiento registrado con éxito!");
        } catch (error) {
            console.error("Error al guardar contabilidad: ", error);
            alert("Ocurrió un error al guardar el registro.");
        } finally {
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = textoOriginalBtn;
            }
        }
    });
}

// ==========================================
// 4. RENDERIZADO Y TABLAS
// ==========================================
async function renderizarContabilidad() {
    const tabla = document.getElementById("tablaContabilidad");
    if (!tabla) return;
    
    tabla.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#64748b;">Cargando registros...</td></tr>`;

    try {
        const querySnapshot = await getDocs(collection(db, "contabilidad"));
        let movimientos = [];

        querySnapshot.forEach((docSnap) => {
            movimientos.push({ id: docSnap.id, ...docSnap.data() });
        });

        movimientos.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        tabla.innerHTML = "";

        let ingresos = 0;
        let egresos = 0;
        let proTemplo = 0;
        let eventos = 0;
        let ninos = 0;
        let general = 0;

        if (movimientos.length === 0) {
            tabla.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#64748b;">No hay registros de contabilidad aún.</td></tr>`;
        } else {
            movimientos.forEach(m => {
                const esIngreso = m.tipo === "Ingreso";
                const valorMonto = esIngreso ? m.monto : -m.monto;

                if (esIngreso) ingresos += m.monto;
                else egresos += m.monto;

                if (m.concepto.includes("Pro-Templo")) proTemplo += valorMonto;
                else if (m.concepto.includes("Eventos")) eventos += valorMonto;
                else if (m.concepto.includes("Niños")) ninos += valorMonto;
                else general += valorMonto;

                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${m.fecha}</td>
                    <td><strong>${m.culto}</strong></td>
                    <td>${m.concepto}</td>
                    <td style="color:#64748b; font-size:13px;">${m.nota}</td>
                    <td class="${esIngreso ? 'ingreso' : 'egreso'}">
                        ${esIngreso ? '+' : '-'} RD$ ${m.monto.toLocaleString('es-DO', {minimumFractionDigits: 2})}
                    </td>
                    <td>
                        <button onclick="eliminarMovimiento('${m.id}')" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" title="Eliminar">🗑️</button>
                    </td>
                `;
                tabla.appendChild(fila);
            });
        }

        const balance = ingresos - egresos;

        const elemIngresos = document.getElementById("totalIngresos");
        const elemEgresos = document.getElementById("totalEgresos");
        const elemBalance = document.getElementById("balanceCaja");

        if (elemIngresos) elemIngresos.innerText = `RD$ ${ingresos.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
        if (elemEgresos) elemEgresos.innerText = `RD$ ${egresos.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
        if (elemBalance) elemBalance.innerText = `RD$ ${balance.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;

        const elemProTemplo = document.getElementById("fondoProTemplo");
        const elemEventos = document.getElementById("fondoEventos");
        const elemNinos = document.getElementById("fondoNinos");
        const elemGeneral = document.getElementById("fondoGeneral");

        if (elemProTemplo) elemProTemplo.innerText = `RD$ ${proTemplo.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
        if (elemEventos) elemEventos.innerText = `RD$ ${eventos.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
        if (elemNinos) elemNinos.innerText = `RD$ ${ninos.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
        if (elemGeneral) elemGeneral.innerText = `RD$ ${general.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;

    } catch (error) {
        console.error("Error al obtener contabilidad de Firebase: ", error);
        tabla.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#dc2626;">Error al obtener la contabilidad.</td></tr>`;
    }
}

// ==========================================
// 5. ELIMINAR REGISTRO
// ==========================================
window.eliminarMovimiento = async function(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este registro de contabilidad?")) {
        try {
            await deleteDoc(doc(db, "contabilidad", id));
            await renderizarContabilidad();
            alert("Registro eliminado exitosamente.");
        } catch (error) {
            console.error("Error al eliminar registro: ", error);
            alert("No se pudo eliminar el registro.");
        }
    }
};

// ==========================================
// 6. EXPORTAR A EXCEL / CSV
// ==========================================
window.exportarExcel = async function() {
    try {
        const querySnapshot = await getDocs(collection(db, "contabilidad"));
        let movimientos = [];
        querySnapshot.forEach(docSnap => movimientos.push(docSnap.data()));

        if (movimientos.length === 0) {
            alert("No hay registros para exportar.");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
        csvContent += "Fecha,Tipo,Culto,Fondo/Categoria,Persona/Nota,Monto (RD$)\n";

        movimientos.forEach(m => {
            csvContent += `"${m.fecha}","${m.tipo}","${m.culto}","${m.concepto}","${m.nota}",${m.monto}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        
        const hoy = new Date().toISOString().slice(0,10);
        link.setAttribute("download", `Reporte_Contabilidad_${hoy}.csv`);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        alert("Error al exportar datos.");
    }
};

// ==========================================
// 7. PREPARAR VISTA DE IMPRESIÓN OFICIAL
// ==========================================
window.addEventListener("beforeprint", () => {
    let encabezadoPrint = document.getElementById("encabezadoImprenta");
    if (!encabezadoPrint) {
        encabezadoPrint = document.createElement("div");
        encabezadoPrint.id = "encabezadoImprenta";
        encabezadoPrint.style.textAlign = "center";
        encabezadoPrint.style.marginBottom = "20px";
        encabezadoPrint.innerHTML = `
            <h2 style="margin:0; color:#0f172a;">CASA DE LIBERACIÓN Y RESTAURACIÓN</h2>
            <h4 style="margin:5px 0 0 0; color:#475569;">Reporte Oficial de Contabilidad</h4>
            <p style="font-size:12px; color:#64748b; margin-top:4px;">
                Generado el: ${new Date().toLocaleDateString('es-DO')} a las ${new Date().toLocaleTimeString('es-DO')}
            </p>
            <hr style="border: 1px solid #d4af37; margin-top: 10px;">
        `;
        const contenedor = document.querySelector(".contenedor-admin");
        if (contenedor) {
            contenedor.insertBefore(encabezadoPrint, contenedor.firstChild);
        }
    }
});

window.addEventListener("afterprint", () => {
    const encabezadoPrint = document.getElementById("encabezadoImprenta");
    if (encabezadoPrint) {
        encabezadoPrint.remove();
    }
});