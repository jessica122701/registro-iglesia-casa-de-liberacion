const URL_SCRIPT = 'https://script.google.com/macros/s/AKfycby1Wc34JMSLlkxLZfFMjPZG3aEA3tWz51l-SdHnjnKTBHJs1Bg02kdK2PNL55NKlpGlyg/exec';

document.addEventListener('DOMContentLoaded', function() {
    const totalElem = document.getElementById('totalMiembros');
    const ultimoElem = document.getElementById('ultimoMiembro');

    fetch(URL_SCRIPT)
        .then(res => res.json())
        .then(miembros => {
            if (Array.isArray(miembros) && miembros.length > 0) {
                // Actualizar total
                totalElem.innerText = miembros.length;

                // Obtener el último registrado
                const ultimo = miembros[miembros.length - 1];
                const nombreUltimo = ultimo.Nombre || ultimo.nombre || 'Sin nombre';
                ultimoElem.innerText = nombreUltimo;
            } else {
                totalElem.innerText = '0';
                ultimoElem.innerText = 'Ninguno';
            }
        })
        .catch(err => {
            console.error(err);
            totalElem.innerText = '!';
            ultimoElem.innerText = 'Error al cargar';
        });
});
