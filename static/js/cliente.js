$(document).ready(function() {
    console.log("DataTables iniciado correctamente");
    $('#tabla-clientes').DataTable({
        ajax: '/api/clientes/',
        columns: [
            { data: 'idCliente' },
            { data: 'tipoDocumento' },
            { data: 'nombre' },
            { data: 'numeroDocumento' },
            { data: 'telefono' },
            { data: 'correo' },
            { data: 'ciudad' },
            { data: 'direccion' }
        ],
        responsive: true,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        }
    });
});