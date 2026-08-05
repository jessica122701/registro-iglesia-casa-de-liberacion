// Verificar si el usuario ha iniciado sesión
if (sessionStorage.getItem('adminAutenticado') !== 'true') {
    alert('⚠️ Acceso protegido. Por favor inicia sesión primero.');
    window.location.href = 'index.html';
}

// Función para cerrar la sesión de administrador
function cerrarSesion() {
    sessionStorage.removeItem('adminAutenticado');
    window.location.href = 'index.html';
}
