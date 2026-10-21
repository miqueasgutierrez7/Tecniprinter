$(document).ready(function () {
  tabla = $("#tabla-historial-computadoras").DataTable({
    ajax: {
      url: "/api/historialcomputadoras/",
      dataSrc: "data",
    },
    columns: [
      { data: "idservicio" },
      { data: "fecha_ingreso" },
      { data: "fecha_entrega" },
      { data: "dias_en_reparacion" },
      { data: "marca" },
      { data: "modelo" },
      { data: "serial" },
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
              onclick="window.open('/pdf_computador/${row.idservicio}/', '_blank')">
              <i class="fa fa-eye"></i>
              <i class="fa fa-print"></i> Detalles e Imprimir
            </button>
          `;
        },
      },
    ],

    // Fecha de entrega: más reciente a más antigua
    order: [[3, "desc"]],

    responsive: true,

    language: {
      url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json",
    },
  });
});