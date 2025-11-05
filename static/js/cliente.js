let tabla;



$(document).ready(function() {
    console.log("DataTables iniciado correctamente");
    tabla = $('#tabla-clientes').DataTable({
        ajax: '/api/clientes/',
         dataSrc: 'data' ,
        columns: [
            { data: 'idCliente' },
            { data: 'tipoDocumento' },
            { data: 'nombre' },
            { data: 'numeroDocumento' },
            { data: 'telefono' },
            { data: 'correo' },
            { data: 'ciudad' },
            { data: 'direccion' },

            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-primary editar" data-id="${row.idCliente}">
                            <i class="fa fa-pencil"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-danger eliminar" data-id="${row.idCliente}">
                            <i class="fa fa-trash"></i> Eliminar
                        </button>
                    `;
                }
            }
        ],
        responsive: true,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        }
    });
});



$('#tabla-clientes').on('click', '.editar', function() {
    const id = $(this).data('id');

    // Hacer fetch a la vista de Django para obtener los datos del cliente
    fetch(`/clientes/${id}/`, {  // Asegúrate que la URL coincida con tu urls.py
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Llenar los campos del modal con los datos del cliente
            $('#edit-id').val(data.cliente.idCliente);
            $('#edit-tipoDocumento').val(data.cliente.tipoDocumento);
            $('#edit-nombre').val(data.cliente.nombre);
            $('#edit-numeroDocumento').val(data.cliente.numeroDocumento);
            $('#edit-telefono').val(data.cliente.telefono);
            $('#edit-correo').val(data.cliente.correo);
            $('#edit-ciudad').val(data.cliente.ciudad);
            $('#edit-direccion').val(data.cliente.direccion);

            // Mostrar modal
            $('#modalEditarCliente').modal('show');
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error al obtener cliente:', error);
        Swal.fire('Error', 'No se pudo cargar la información del cliente', 'error');
    });
});



$('#tabla-clientes').on('click', '.eliminar', function () {
    const id = $(this).data('id');
    if (!id) {
        console.error('No se encontró el id para eliminar');
        return;
    }
    Swal.fire({
        title: '¿Eliminar cliente?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `/api/clientes/${id}/`,  // Ajústalo a tu URL real
                type: 'DELETE',
                success: function (response) {
                    Swal.fire('Eliminado', 'Cliente eliminado correctamente', 'success');
                    $('#tabla-clientes').DataTable().ajax.reload();
                },
                error: function (xhr, status, error) {
                    Swal.fire('Error', 'No se pudo eliminar el cliente', 'error');
                }
            });
        }
    });
});