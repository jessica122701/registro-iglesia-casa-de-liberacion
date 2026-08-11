import { auth } from "./firebase-config.js";
import { 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ==========================================
// 1. ESCUCHAR ESTADO DE SESIÓN (FIREBASE)
// ==========================================
onAuthStateChanged(auth, (user) => {
    const vistaPublica = document.getElementById('vistaPublica');
    const panelAdminPrivado = document.getElementById('panelAdminPrivado');

    if (user) {
        console.log("Sesión activa para:", user.email);
        localStorage.setItem("esAdmin", "true");
        localStorage.setItem("usuarioLogueado", user.email);

        if (vistaPublica) vistaPublica.style.display = 'none';
        if (panelAdminPrivado) panelAdminPrivado.style.display = 'grid';
    } else {
        console.log("Sin sesión activa.");
        localStorage.removeItem("esAdmin");
        localStorage.removeItem("usuarioLogueado");

        if (panelAdminPrivado) panelAdminPrivado.style.display = 'none';
        if (vistaPublica) vistaPublica.style.display = 'flex';
    }
});

// ==========================================
// 2. INICIALIZAR EVENTOS DE LOGIN Y LOGOUT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    const btnSubmit = document.getElementById('btnSubmitAdmin');
    const mensajeError = document.getElementById('mensajeError');

    const procesarLogin = async (e) => {
        if (e) e.preventDefault();

        const emailInput = document.getElementById('usuario');
        const passInput = document.getElementById('password');

        const email = emailInput ? emailInput.value.trim() : '';
        const pass = passInput ? passInput.value.trim() : '';

        if (!email || !pass) {
            if (mensajeError) {
                mensajeError.style.color = "#ef4444";
                mensajeError.innerText = "⚠ Completa el correo y la contraseña.";
                mensajeError.style.display = "block";
            }
            return;
        }

        if (btnSubmit) {
            btnSubmit.innerText = "Verificando... ⏳";
            btnSubmit.disabled = true;
        }

        try {
            // Intento de inicio de sesión con Firebase Auth
            await signInWithEmailAndPassword(auth, email, pass);
            if (mensajeError) mensajeError.style.display = "none";
        } catch (error) {
            console.error("Error al autenticar:", error.code, error.message);
            
            if (btnSubmit) {
                btnSubmit.innerText = "Ingresar como Admin";
                btnSubmit.disabled = false;
            }

            if (mensajeError) {
                mensajeError.style.color = "#ef4444";
                mensajeError.style.display = "block";

                if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
                    mensajeError.innerText = "⚠ Correo o contraseña incorrectos.";
                } else if (error.code === 'auth/user-not-found') {
                    mensajeError.innerText = "⚠ Usuario no registrado en Firebase Auth.";
                } else if (error.code === 'auth/invalid-email') {
                    mensajeError.innerText = "⚠ Formato de correo no válido.";
                } else if (error.code === 'auth/too-many-requests') {
                    mensajeError.innerText = "⚠ Muchos intentos fallidos. Intenta más tarde.";
                } else {
                    mensajeError.innerText = "⚠ Error: " + error.message;
                }
            }
        }
    };

    // Vincular evento al botón e ingreso con Enter
    if (btnSubmit) btnSubmit.addEventListener('click', procesarLogin);
    if (formLogin) formLogin.addEventListener('submit', procesarLogin);

    // Evento de Cierre de Sesión
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            signOut(auth).then(() => {
                localStorage.clear();
                window.location.reload();
            });
        });
    }
});