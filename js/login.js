document.addEventListener("DOMContentLoaded", function () {
    const formLogin = document.getElementById("formLogin");
    const mensajeError = document.getElementById("mensajeError");

    if (formLogin) {
        formLogin.addEventListener("submit", function (e) {
            e.preventDefault();

            const usuarioInput = document.getElementById("usuario").value.trim();
            const passwordInput = document.getElementById("password").value.trim();

            if (usuarioInput === "admin" && passwordInput === "011517") {
                // Sincronizamos todas las banderas de sesión
                localStorage.setItem("esAdmin", "true");
                localStorage.setItem("adminSesion", "activa");
                localStorage.setItem("adminAutenticado", "true");
                localStorage.setItem("usuarioLogueado", "admin");

                // Redirigir al Dashboard
                window.location.href = "dashboard.html";
            } else {
                if (mensajeError) {
                    mensajeError.style.display = "block";
                }
            }
        });
    }
});