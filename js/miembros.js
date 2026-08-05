<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Miembros - Casa de Liberación</title>
    <link rel="stylesheet" href="css/estilos.css">
    <style>
        @media print {
            .no-imprimir { display: none !important; }
            .contenedor { box-shadow: none !important; border: none !important; width: 100% !important; max-width: 100% !important; padding: 0 !important; }
            body { background: white !important; }
        }
    </style>
</head>
<body>
    <div class="contenedor" style="width: 98%; max-width: 1100px; margin: 20px auto;">
        <h1>Lista de Fichas de Miembros</h1>
        <h2>Casa de Liberación y Restauración</h2>

        <div class="no-imprimir" style="display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap;">
            <input type="text" id="buscador" placeholder="🔎 Buscar por nombre, rol, teléfono o ministerio..." style="flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
            <button type="button" onclick="window.print()" style="width: auto; background-color: #6c757d; padding: 10px 20px; color: white; border: none; border-radius: 5px; cursor: pointer;">🖨️ Imprimir / PDF</button>
        </div>

        <div style="overflow-x: auto; margin-top: 15px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                    <tr style="background-color: #0b5ed7; color: white;">
                        <th style="padding: 8px; border: 1px solid #ddd;">Nombre</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Teléfono</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Rol</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Bautizado</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Clase</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Ministerio</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Tutor / Madre</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Gustos / Notas</th>
                    </tr>
                </thead>
                <tbody id="tablaMiembros" style="text-align: center;">
                </tbody>
            </table>
        </div>

        <br>
        <div class="no-imprimir" style="text-align: center;">
            <a href="dashboard.html" style="color: #0b5ed7; text-decoration: none; font-weight: bold;">← Volver al Panel</a>
        </div>
    </div>

    <script src="js/miembros.js"></script>
</body>
</html>
