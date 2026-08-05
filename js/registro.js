document.getElementById('formRegistro').addEventListener('submit', function(e) {
    e.preventDefault();

    // Campos principales
    const tipoPersona = document.getElementById('tipoPersona').value;
    const nombre = document.getElementById('nombre').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const direccion = document.getElementById('direccion').value;

    // Obtener ministerios seleccionados si aplica
    let ministeriosSeleccionados = [];
    document.querySelectorAll('input[name="ministerio"]:checked').forEach(checkbox => {
        ministeriosSeleccionados.push(checkbox.value);
    });

    // Funciones auxiliares para obtener valor seguro
    const getVal = (id, def = 'N/A') => {
        const el = document.getElementById(id);
        return (el && el.value.trim() !== '') ? el.value : def;
    };

    // Construir el objeto de datos dinámico sin errores de tipo null
    const nuevoRegistro = {
        id: Date.now(),
        tipoPersona: tipoPersona,
        nombre: nombre,
        fechaNacimiento: fechaNacimiento,
        direccion: direccion,
        telefono: getVal('telefono'),
        correo: getVal('correo'),
        tutor: getVal('tutor'),
        telefonoTutor: getVal('telefonoTutor'),
        bautizado: getVal('bautizado', 'No'),
        clase: getVal('clase', 'Ninguna'),
        ministerios: ministeriosSeleccionados.length > 0 ? ministeriosSeleccionados.join(', ') : 'Ninguno',
        talentos: getVal('gustos'),
        fechaRegistro: new Date().toLocaleDateString()
    };

    // Obtener lista actual de registros en LocalStorage
    let listaRegistros = JSON.parse(localStorage.getItem('registrosIglesia')) || [];
    
    // Guardar el nuevo registro
    listaRegistros.push(nuevoRegistro);
    localStorage.setItem('registrosIglesia', JSON.stringify(listaRegistros));

    // Confirmación al usuario
    alert('✅ ¡Ficha de ' + nombre + ' guardada exitosamente!');
    
    // Redirigir al dashboard / menú principal
    window.location.href = 'dashboard.html';
});
