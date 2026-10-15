$(document).ready(function () {

    console.log("Cargando tabla de servicios de toner...");

    tabla = $("#tabla-historial-serviciosToner").DataTable({
        ajax: {
            url: "/api/historialtoners/",
            dataSrc: "data",
        },

        columns: [
            { data: "idservicio" },
            { data: "fecha_ingreso" },
            { data: "fecha_entrega" },
            { data: "dias_en_reparacion" },
            { data: "modelo_toner" },
            { data: "cliente" },
            { data: "telefono" },

            {
                data: "estado",

            },

            {
                data: null,
                orderable: false,

                render: function (data, type, row) {

                    return `
                        <button class="btn btn-sm btn-primary imprimir"
                            onclick="window.open('/pdf_toner/${row.idservicio}/', '_blank')">
                            <i class="fa fa-eye"></i>
                            <i class="fa fa-print"></i>
                            Detalles e Imprimir
                        </button>


                    `;
                },
            },
        ],

        order: [[2, "desc"]],
        responsive: true,

        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json",
        },
    });
});