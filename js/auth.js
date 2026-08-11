// Verificar si hay alguna sesión activa
function verificarSesion() {
    const esAdmin = localStorage.getItem("esAdmin");
    const sesion1 = localStorage.getItem("adminSesion");

    // Si no es admin, redirige al index.html
    if (esAdmin !== "true" && sesion1 !== "activa") {
        alert("Acceso denegado. Por favor inicia sesión.");
        window.location.href = "index.html";
    }
}

// Ejecutar verificación inmediatamente
verificarSesion();

// Función global para cerrar sesión en todo el sistema
window.cerrarSesion = function() {
    localStorage.removeItem("esAdmin");
    localStorage.removeItem("adminSesion");
    localStorage.removeItem("adminAutenticado");
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "index.html";
};