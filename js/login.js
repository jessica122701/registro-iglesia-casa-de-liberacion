document.getElementById('formLogin').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const clave = document.getElementById('clave').value;

    // Puedes cambiar aquí tu usuario y clave si lo deseas
    if (usuario === 'admin' && clave === '1234') {
        sessionStorage.setItem('adminAutenticado', 'true');
        window.location.href = 'dashboard.html';
    } else {
        alert('❌ Usuario o contraseña incorrectos');
    }
});
