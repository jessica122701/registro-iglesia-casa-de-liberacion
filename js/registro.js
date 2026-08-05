document.getElementById('formRegistro').addEventListener('submit', function(e) {
    e.preventDefault();

    // Comprobar si estamos editando un registro existente
    const idExistente = document.getElementById('registroId') ? document.getElementById('registroId').value : null;

    const tipoPersona = document.getElementById('tipoPersona').value;
    const nombre = document.getElementById('nombre').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const direccion = document.getElementById('direccion').value;

    // Recolectar ministerios seleccionados
    let ministeriosSeleccionados = [];
    document.querySelectorAll('input[name="ministerio"]:checked').forEach(checkbox => {
        ministeriosSeleccionados.push(checkbox.value);
    });

    const getVal = (id, def = 'N/A') => {
        const el = document.getElementById(id);
        return (el && el.value.trim() !== '') ? el.value : def;
    };

    let listaRegistros = JSON.parse(localStorage.getItem('registrosIglesia')) || [];

    if (idExistente) {
        // --- MODO ACTUALIZACIÓN / AVANCE ---
        const index = listaRegistros.findIndex(r => r.id == idExistente);
        if (index !== -1) {
            listaRegistros[index].tipoPersona = tipoPersona;
            listaRegistros[index].nombre = nombre;
            listaRegistros[index].fechaNacimiento = fechaNacimiento;
            listaRegistros[index].direccion = direccion;
            listaRegistros[index].telefono = getVal('telefono');
            listaRegistros[index].correo = getVal('correo');
            listaRegistros[index].tutor = getVal('tutor');
            listaRegistros[index].telefonoTutor = getVal('telefonoTutor');
            listaRegistros[index].bautizado = getVal('bautizado', 'No');
            listaRegistros[index].clase = getVal('clase', 'Ninguna');
            listaRegistros[index].ministerios = ministeriosSeleccionados.length > 0 ? ministeriosSeleccionados.join(', ') : 'Ninguno';
            listaRegistros[index].talentos = getVal('gustos');
            listaRegistros[index].ultimaActualizacion = new Date().toLocaleDateString();

            localStorage.setItem('registrosIglesia', JSON.stringify(listaRegistros));
            alert('🎉 ¡Ficha actualizada exitosamente! El avance de ' + nombre + ' ha sido guardado.');
            window.location.href = 'miembros.html';
            return;
        }
    }

    // --- MODO NUEVO REGISTRO ---
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
        fechaRegistro: new Date().toLocaleDateString(), // Fecha automática de alta
        ultimaActualizacion: new Date().toLocaleDateString()
    };

    listaRegistros.push(nuevoRegistro);
    localStorage.setItem('registrosIglesia', JSON.stringify(listaRegistros));

    alert('✅ ¡Ficha de ' + nombre + ' guardada exitosamente!');
    
    // Si lo llena el público vuelve al registro, si es admin vuelve a miembros
    if (localStorage.getItem('sesionIniciada') === 'true') {
        window.location.href = 'miembros.html';
    } else {
        document.getElementById('formRegistro').reset();
        if (typeof cambiarTipoPersona === "function") cambiarTipoPersona();
    }
});
