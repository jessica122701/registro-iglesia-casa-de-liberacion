// ==========================================
// 0. IMPORTACIONES DE FIREBASE (CRÍTICO)
// ==========================================
import { db } from "./firebase-config.js"; 
import { collection, addDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ==========================================
// 1. MÁSCARA AUTOMÁTICA DE TELÉFONO
// ==========================================
function aplicarMascaraTelefono(input) {
    if (!input) return;
    input.addEventListener("input", function (e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        if (!x[2]) {
            e.target.value = x[1];
        } else {
            e.target.value = `(${x[1]}) ${x[2]}` + (x[3] ? `-${x[3]}` : '');
        }
    });
}

// ==========================================
// 2. CONFIGURACIÓN E INICIALIZACIÓN (DOM)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // Aplicar máscara de teléfono a los campos si existen
    aplicarMascaraTelefono(document.getElementById("telefono"));
    aplicarMascaraTelefono(document.getElementById("telefonoTutor"));

    // Configuración de botones de Agradecimiento
    const btnOtro = document.getElementById("btnOtroRegistro");
    const btnSalir = document.getElementById("btnSalir");

    if (btnOtro) {
        btnOtro.addEventListener("click", function() {
            const pantalla = document.getElementById("pantallaAgradecimiento");
            const form = document.getElementById("formRegistro");

            if (pantalla) pantalla.style.display = "none";
            if (form) {
                form.reset();
                form.style.display = "block";
            }
            
            if (typeof cambiarTipoPersona === "function") cambiarTipoPersona();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (btnSalir) {
        btnSalir.addEventListener("click", function() {
            // Salida limpia reemplazando la vista en el historial
            window.location.replace("index.html");
        });
    }
});

// ==========================================
// 3. FUNCIONES DE AGRADECIMIENTO PÚBLICO
// ==========================================
function activarPantallaAgradecimiento() {
    const pantalla = document.getElementById("pantallaAgradecimiento");
    const form = document.getElementById("formRegistro");

    if (form) form.style.display = "none";

    if (pantalla) {
        pantalla.style.display = "flex"; // Se muestra sobre la pantalla como overlay modal
    } else {
        alert("¡Muchas Gracias! Tus datos han sido registrados correctamente.");
    }
}

// ==========================================
// 4. GUARDAR / EDITAR FICHA EN FIREBASE
// ==========================================
const formRegistro = document.getElementById("formRegistro");
if (formRegistro) {
    formRegistro.addEventListener("submit", async function(e) {
        e.preventDefault();

        // Deshabilitar botón para evitar envíos dobles
        const btnSubmit = formRegistro.querySelector('button[type="submit"]');
        const textoOriginalBtn = btnSubmit ? btnSubmit.innerHTML : 'Guardar';
        
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '⏳ Guardando...';
        }

        const inputId = document.getElementById('registroId');
        const tipoPersona = document.getElementById('tipoPersona') ? document.getElementById('tipoPersona').value : 'Miembro';
        const nombre = document.getElementById('nombre') ? document.getElementById('nombre').value.trim() : '';
        const direccion = document.getElementById('direccion') ? document.getElementById('direccion').value.trim() : '';
        
        const fechaNacimiento = document.getElementById('fechaNacimiento') ? document.getElementById('fechaNacimiento').value : '';
        const edadNino = document.getElementById('edadNino') ? document.getElementById('edadNino').value : '';
        const telefono = document.getElementById('telefono') ? document.getElementById('telefono').value.trim() : '';
        const correo = document.getElementById('correo') ? document.getElementById('correo').value.trim() : '';
        const tutor = document.getElementById('tutor') ? document.getElementById('tutor').value.trim() : '';
        const telefonoTutor = document.getElementById('telefonoTutor') ? document.getElementById('telefonoTutor').value.trim() : '';
        const asisteMinNinos = document.getElementById('asisteMinNinos') ? document.getElementById('asisteMinNinos').value : '';
        const bautizado = document.getElementById('bautizado') ? document.getElementById('bautizado').value : 'No';
        const clase = document.getElementById('clase') ? document.getElementById('clase').value : 'Ninguna';
        const talentos = document.getElementById('gustos') ? document.getElementById('gustos').value.trim() : '';

        let ministerios = [];
        document.querySelectorAll('input[name="ministerio"]:checked').forEach(cb => {
            ministerios.push(cb.value);
        });

        const registro = {
            tipoPersona,
            nombre,
            direccion,
            fechaNacimiento,
            edadNino,
            telefono,
            correo,
            tutor,
            telefonoTutor,
            asisteMinNinos,
            bautizado,
            clase,
            talentos,
            ministerios: ministerios.join(', '),
            fechaRegistro: new Date().toISOString()
        };

        try {
            if (inputId && inputId.value) {
                // Actualizar documento existente en la colección "miembros"
                const docRef = doc(db, "miembros", inputId.value);
                await updateDoc(docRef, registro);
            } else {
                // Agregar nuevo documento en la colección "miembros"
                await addDoc(collection(db, "miembros"), registro);
            }

            formRegistro.reset();
            if (inputId) inputId.remove();

            const esAdmin = localStorage.getItem("esAdmin") === "true";

            if (esAdmin && inputId && inputId.value) {
                alert("¡Ficha actualizada exitosamente!");
                if (typeof renderizarTablaMiembros === "function") renderizarTablaMiembros();
            } else {
                // Muestra la pantalla de agradecimiento al público o nuevo registro
                activarPantallaAgradecimiento();
                if (esAdmin && typeof renderizarTablaMiembros === "function") {
                    renderizarTablaMiembros();
                }
            }

        } catch (error) {
            console.error("Error al guardar en Firebase: ", error);
            alert("Ocurrió un error al guardar en la nube. Revisa las reglas o tu conexión.");
        } finally {
            // Reestablecer el estado original del botón
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = textoOriginalBtn;
            }
        }
    });
}