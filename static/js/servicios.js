// 1-Declaramos las variables globales que vamos a usar

let tabla;
const formulario = document.getElementById("formulario");
const btnRegistrar = document.getElementById("btnRegistrar");
const pc = document.getElementById("camposPC");
const imp = document.getElementById("camposIMP");
const ton = document.getElementById("camposTON");

// 2-Funcion para montrar la tabla de los servicios registrados de impresoras.

// - Inicializamos la tabla de servicios de impresoras cuando carga el documento.
$(document).ready(function () {
  tabla = $("#tabla-serviciosimpresoras").DataTable({
    ajax: {
      url: "/api/reparacionimpresora/",
      dataSrc: "data",
    },
    columns: [
      { data: "idservicio" },
      { data: "dia_semana" },
      { data: "fecha_ingreso" },
      { data: "dias_en_reparacion" },
      { data: "marca" },
      { data: "modelo" },
      { data: "serial" },
      { data: "cliente" },
      { data: "telefono" },
      {
        data: "estado",
        // - Mostramos el estado del servicio con un color identificativo.
        render: function (data, type, row) {
          let color = "";
          if (data === "Recibido") {
            color = "#2c7bd1"; // Azul claro
          } else if (data === "En proceso") {
            color = "#FFC107"; // Amarillo
          } else if (data === "Terminado") {
            color = "#4CAF50"; // Verde
          }
          return `<span style="background-color:${color};
                               color:white;
                               padding:4px 8px;
                               border-radius:4px;">
                    ${data}
                  </span>`;
        },
      },
      {
        data: null,
        orderable: false,
        // - Generamos las acciones disponibles para cada servicio de impresora.
        render: function (data, type, row) {
          return `

           <button class="btn btn-sm btn-primary imprimir"
              onclick="window.open('/pdf_impresora/${row.idservicio}/', '_blank')">
         <i class="fa fa-eye"></i> <i class="fa fa-print"></i> Detalles e Imprimir
      </button>

            <button class="btn btn-sm btn-primary editar" data-id="${row.id}">
              <i class="fa fa-pencil"></i> Editar
            </button>
          `;
        },
      },
    ],
    // 🔑 Pintamos la fila completa según el estado
    // - Aplicamos a cada fila el color correspondiente al estado del servicio.
    createdRow: function (row, data, dataIndex) {
      let bgColor = "";
      let textColor = "white"; // por defecto

      if (data.estado === "Recibido") {
        bgColor = "#007bff"; // Azul
      } else if (data.estado === "En proceso") {
        bgColor = "#ffc107"; // Amarillo claro
        textColor = "black"; // mejor contraste sobre amarillo
      } else if (data.estado === "Terminado") {
        bgColor = "#4CAF50"; // Verde

      } else if (data.estado === "No realizado") {
        bgColor = "#dc3545"; // Verde
      }
        else if (data.estado === "Garantía") {
          bgColor = "#290b83"; // Azul turquesa (confianza/seguridad)
          textColor = "white"; // contraste sobre fondo turquesa
}

      // Aplica el color de fondo y texto a TODAS las celdas de la fila
      $("td", row).css({
        "background-color": bgColor,
        "color": textColor
      });
    },
    responsive: true,
    language: {
      url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json",
    },
  });
});

// 3- Funcion para mostrar la tabla de servicios registrados de computadores.

// - Inicializamos la tabla de servicios de computadores cuando carga el documento.
$(document).ready(function () {

  tabla = $("#tabla-serviciosComputadores").DataTable({
    ajax: {
      url: "/api/reparacioncomputadores/",
      dataSrc: "data",
    },
    columns: [
      { data: "idservicio" },
      { data: "dia_semana" },
      { data: "fecha_ingreso" },
      { data: "dias_en_reparacion" },
      { data: "marca" },
      { data: "modelo" },
      { data: "serial" },
      { data: "cliente" },
      { data: "telefono" },
      {
        data: "estado",
        // - Mostramos el estado del servicio con un color identificativo.
        render: function (data, type, row) {
          let color = "";
          if (data === "Recibido") {
            color = "#2c7bd1"; // Azul claro
          } else if (data === "En proceso") {
            color = "#FFC107"; // Amarillo
          } else if (data === "Terminado") {
            color = "#4CAF50"; // Verde
          }
          return `<span style="background-color:${color};
                               color:white;
                               padding:4px 8px;
                               border-radius:4px;">
                    ${data}
                  </span>`;
        },
      },
      {
        data: null,
        orderable: false,
        // - Generamos las acciones disponibles para cada servicio de computador.
        render: function (data, type, row) {
          return `

           <button class="btn btn-sm btn-primary imprimir"
              onclick="window.open('/pdf_computador/${row.idservicio}/', '_blank')">
         <i class="fa fa-eye"></i> <i class="fa fa-print"></i> Detalles e Imprimir
      </button>

            <button class="btn btn-sm btn-primary editar" data-id="${row.id}">
              <i class="fa fa-pencil"></i> Editar
            </button>
          `;
        },
      },
    ],
    // 🔑 Pintamos la fila completa según el estado
    // - Aplicamos a cada fila el color correspondiente al estado del servicio.
    createdRow: function (row, data, dataIndex) {
      let bgColor = "";
      let textColor = "white"; // por defecto

      if (data.estado === "Recibido") {
        bgColor = "#007bff"; // Azul
      } else if (data.estado === "En proceso") {
        bgColor = "#ffc107"; // Amarillo claro
        textColor = "black"; // mejor contraste sobre amarillo
      } else if (data.estado === "Terminado") {
        bgColor = "#4CAF50"; // Verde

      } else if (data.estado === "No realizado") {
        bgColor = "#dc3545"; // Verde
      }
        else if (data.estado === "Garantía") {
          bgColor = "#290b83"; // Azul turquesa (confianza/seguridad)
          textColor = "white"; // contraste sobre fondo turquesa
}

      // Aplica el color de fondo y texto a TODAS las celdas de la fila
      $("td", row).css({
        "background-color": bgColor,
        "color": textColor
      });
    },
    responsive: true,
    language: {
      url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json",
    },
  });
});

// 4- Funcion para mostrar el modal y editar los datos del servicio de impresora.

// - Abrimos el modal y cargamos los datos del servicio de impresora seleccionado.
$("#tabla-serviciosimpresoras").on("click", ".editar", function () {
  $("#modalEditarServicioImpresora").modal("show");
  const id = $(this).data("id");
  console.log("ID del servicio a editar:", id);

  // Hacer fetch a la vista de Django para obtener los datos del servicio por su ID

  fetch(`/servicioimpresora/${id}/`, {
    // Asegúrate que la URL coincida con tu urls.py
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    // - Convertimos la respuesta del servidor a JSON.
    .then((response) => response.json())
    // - Rellenamos el modal con la información recibida del servicio.
    .then((data) => {
      if (data.success) {

        // Llenar los campos del modal con los datos del cliente
        $("#edit_id").val(data.servicio.id);
        $("#edit_imp_modelo").val(data.servicio.modelo);
        $("#edit_imp_serial").val(data.servicio.serial);
        $("#edit_imp_diagnostico").val(data.servicio.diagnostico);
        $("#edit_imp_solucion").val(data.servicio.solucion);
        $("#edit_observaciones").val(data.servicio.observaciones);
        $("#edit_valorServicio").val(data.servicio.valorServicio);
        $("#edit_abono").val(data.servicio.abonos);
        $("#edit_saldo").val(data.servicio.saldo);


        // Manejo especial parameñ campo ""marca de impresora"

        const inputMarcaEditar = document.getElementById('edit_impr_marca');
        const marcaImpresora = data.servicio.marca;

        if (inputMarcaEditar) {
          const opcion = Array.from(inputMarcaEditar.options).find(opt => opt.value === marcaImpresora);

          // Si existe el modelo en la lista, seleccionarla
          if (opcion) {
            inputMarcaEditar.value = marcaImpresora;
            if ($(inputMarcaEditar).hasClass('selectpicker')) {
              $(inputMarcaEditar).selectpicker('refresh');
            }
          } else {
            const nuevaOpcion = new Option(marcaImpresora, marcaImpresora, true, true);
            inputMarcaEditar.add(nuevaOpcion);
          }
        }

        // El estado del servicio

        const inputEstadoEditar = document.getElementById('edit_estado');
        const estadoServicio = data.servicio.estado;

        if (inputEstadoEditar) {
          const opcionEstado = Array.from(inputEstadoEditar.options).find(opt => opt.value === estadoServicio);

          if (opcionEstado) {
            inputEstadoEditar.value = estadoServicio;
            if ($(inputEstadoEditar).hasClass('selectpicker')) {
              $(inputEstadoEditar).selectpicker('refresh');
            }
          } else {
            const nuevaOpcionEstado = new Option(estadoServicio, estadoServicio, true, true);
            inputEstadoEditar.add(nuevaOpcionEstado);
          }
        }

        console.log("Estado del servicio:", estadoServicio);

      } else {
        Swal.fire("Error", data.message, "error");
      }
    })
    // - Mostramos un mensaje cuando no se pueden cargar los datos.
    .catch((error) => {
      console.error("Error al obtener cliente:", error);
      Swal.fire(
        "Error",
        "No se pudo cargar la información del cliente",
        "error",
      );
    });
});

// 5- Funcion para mostrar el modal y editat los datos del servicio de computadores.

// - Abrimos el modal y cargamos los datos del servicio de computador seleccionado.
$("#tabla-serviciosComputadores").on("click", ".editar", function () {
  $("#modalEditarServicioComputadora").modal("show");

  console.log("Probando modal de edicion de servicio de computador");
  const id = $(this).data("id");
  console.log("ID del servicio a editar:", id);

  // Hacer fetch a la vista de Django para obtener los datos del servicio por su ID

  fetch(`/serviciocomputadora/${id}/`, {
    // Asegúrate que la URL coincida con tu urls.py
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    // - Convertimos la respuesta del servidor a JSON.
    .then((response) => response.json())
    // - Rellenamos el modal con la información recibida del servicio.
    .then((data) => {
      if (data.success) {

        // Llenar los campos del modal con los datos del cliente
        $("#edit_id_comp").val(data.servicio.id);
        $("#edit_comp_modelo").val(data.servicio.modelo);
        $("#edit_comp_serial").val(data.servicio.serial);
        $("#edit_comp_diagnostico").val(data.servicio.diagnostico);
        $("#edit_comp_solucion").val(data.servicio.solucion);
        $("#edit_observaciones_comp").val(data.servicio.observaciones);
        $("#edit_valorServicio_comp").val(data.servicio.valorServicio);
        $("#edit_abono_comp").val(data.servicio.abonos);
        $("#edit_saldo_comp").val(data.servicio.saldo);


        // Manejo especial parameñ campo ""marca de impresora"

        const inputMarcaEditar = document.getElementById('edit_comp_marca');
        const marcaImpresora = data.servicio.marca;

        if (inputMarcaEditar) {
          const opcion = Array.from(inputMarcaEditar.options).find(opt => opt.value === marcaImpresora);

          // Si existe el modelo en la lista, seleccionarla
          if (opcion) {
            inputMarcaEditar.value = marcaImpresora;
            if ($(inputMarcaEditar).hasClass('selectpicker')) {
              $(inputMarcaEditar).selectpicker('refresh');
            }
          } else {
            const nuevaOpcion = new Option(marcaImpresora, marcaImpresora, true, true);
            inputMarcaEditar.add(nuevaOpcion);
          }
        }

        // El estado del servicio

        const inputEstadoEditar = document.getElementById('edit_estado_comp');
        const estadoServicio = data.servicio.estado;

        if (inputEstadoEditar) {
          const opcionEstado = Array.from(inputEstadoEditar.options).find(opt => opt.value === estadoServicio);

          if (opcionEstado) {
            inputEstadoEditar.value = estadoServicio;
            if ($(inputEstadoEditar).hasClass('selectpicker')) {
              $(inputEstadoEditar).selectpicker('refresh');
            }
          } else {
            const nuevaOpcionEstado = new Option(estadoServicio, estadoServicio, true, true);
            inputEstadoEditar.add(nuevaOpcionEstado);
          }
        }

        console.log("Estado del servicio:", estadoServicio);

      } else {
        Swal.fire("Error", data.message, "error");
      }
    })
    // - Mostramos un mensaje cuando no se pueden cargar los datos.
    .catch((error) => {
      console.error("Error al obtener cliente:", error);
      Swal.fire(
        "Error",
        "No se pudo cargar la información del cliente",
        "error",
      );
    });
});


// 6- Funcion para guardar los cambios realizados en el modal de ediccion del servicio de impresora.

// - Guardamos mediante una petición PUT los cambios del servicio de impresora.
document.getElementById("guardarCambiosServicioImpresora")
  .addEventListener("click", async () => {
    const id = document.getElementById("edit_id").value;
    console.log("ID del cliente a actualizar:", id);

    // Capturar datos del formulario
    const datos = {
      marca: document.getElementById("edit_impr_marca").value,
      modelo: document.getElementById("edit_imp_modelo").value,
      serial: document.getElementById("edit_imp_serial").value,
      diagnostico: document.getElementById("edit_imp_diagnostico").value,
      trabajoarealizar: document.getElementById("edit_imp_solucion").value,
      observaciones: document.getElementById("edit_observaciones").value,
      valorServicio: document.getElementById("edit_valorServicio").value,
      abonos: document.getElementById("edit_abono").value,
      saldo: document.getElementById("edit_saldo").value,
      estado: document.getElementById("edit_estado").value,
    };

   try {
      const response = await fetch(`/servicios/editar/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
        },
        body: JSON.stringify(datos),
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire("Éxito", "Servicio actualizado correctamente", "success");
        $("#tabla-servicios").DataTable().ajax.reload();


        location.reload();
        formulario.reset();

      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error("Error al actualizar servicio:", error);
      Swal.fire("Error", "No se pudo actualizar el servicio", "error");
    }


  });



// 7- Funcion para guardar los cambios realizados en el modal de ediccion del servicio de computador.

// - Guardamos mediante una petición PUT los cambios del servicio de computador.
document.getElementById("guardarCambiosServicioComputadora")
  .addEventListener("click", async () => {
    const id = document.getElementById("edit_id_comp").value;
    console.log("ID del cliente a actualizar:", id);

    // Capturar datos del formulario
    const datos = {
      marca: document.getElementById("edit_comp_marca").value,
      modelo: document.getElementById("edit_comp_modelo").value,
      serial: document.getElementById("edit_comp_serial").value,
      diagnostico: document.getElementById("edit_comp_diagnostico").value,
      trabajoarealizar: document.getElementById("edit_comp_solucion").value,
      observaciones: document.getElementById("edit_observaciones_comp").value,
      valorServicio: document.getElementById("edit_valorServicio_comp").value,
      abonos: document.getElementById("edit_abono_comp").value,
      saldo: document.getElementById("edit_saldo_comp").value,
      estado: document.getElementById("edit_estado_comp").value,
    };

   try {
      const response = await fetch(`/servicioscomputador/editar/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
        },
        body: JSON.stringify(datos),
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire("Éxito", "Servicio actualizado correctamente", "success");
        $("#tabla-servicios").DataTable().ajax.reload();


        location.reload();
        formulario.reset();

      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error("Error al actualizar servicio:", error);
      Swal.fire("Error", "No se pudo actualizar el servicio", "error");
    }


  });







const inputCedula = document.getElementById("documento");
const mensaje = document.getElementById("mensaje");
const inputNombre = document.getElementById("nombre");
const inputTelefono = document.getElementById("telefono");
const inputCorreo = document.getElementById("correo");
const inputCiudad = document.getElementById("ciudad");
const inputDireccion = document.getElementById("direccion");
const datalistClientes = document.getElementById("clientes-sugeridos");

// - Buscamos clientes por nombre y cargamos sus coincidencias en el datalist.
function buscarClientesPorNombre(nombre) {
  if (!nombre || nombre.length < 2) {
    datalistClientes.innerHTML = "";
    return;
  }

  fetch(`/api/clientes/buscar/?q=${encodeURIComponent(nombre)}`)
    // - Convertimos la respuesta de búsqueda a JSON.
    .then((response) => response.json())
    // - Construimos las opciones con los datos de cada cliente encontrado.
    .then((data) => {
      datalistClientes.innerHTML = "";
      data.clientes.forEach((cliente) => {
        const option = document.createElement("option");
        option.value = cliente.nombre;
        option.dataset.idCliente = cliente.idCliente;
        option.dataset.tipoDocumento = cliente.tipoDocumento;
        option.dataset.numeroDocumento = cliente.numeroDocumento;
        option.dataset.telefono = cliente.telefono;
        option.dataset.correo = cliente.correo;
        option.dataset.ciudad = cliente.ciudad;
        option.dataset.direccion = cliente.direccion;
        datalistClientes.appendChild(option);
      });
    })
    // - Informamos en consola si la búsqueda falla.
    .catch((err) => console.error("Error al buscar clientes:", err));
}

if (inputNombre) {
  // - Buscamos clientes mientras el usuario escribe su nombre.
  inputNombre.addEventListener("input", () => {
    buscarClientesPorNombre(inputNombre.value.trim());
  });

  // - Completamos los datos del formulario al seleccionar un cliente.
  inputNombre.addEventListener("change", () => {
    const opciones = Array.from(datalistClientes.options);
    const seleccion = opciones.find(
      (opt) => opt.value.toLowerCase() === inputNombre.value.trim().toLowerCase(),
    );

    if (seleccion) {
      document.getElementById("tipoDocumento").value = seleccion.dataset.tipoDocumento || "CC";
      document.getElementById("documento").value = seleccion.dataset.numeroDocumento || "";
      document.getElementById("telefono").value = seleccion.dataset.telefono || "";
      document.getElementById("correo").value = seleccion.dataset.correo || "";
      document.getElementById("direccion").value = seleccion.dataset.direccion || "";

      const ciudadCliente = seleccion.dataset.ciudad;
      const opcionCiudad = Array.from(inputCiudad.options).find(
        (opt) => opt.value === ciudadCliente,
      );
      if (opcionCiudad) {
        inputCiudad.value = ciudadCliente;
      } else if (ciudadCliente) {
        const nuevaOpcion = new Option(ciudadCliente, ciudadCliente, true, true);
        inputCiudad.add(nuevaOpcion);
      }
    }
  });
}

if (inputCedula) {
  // - Validamos la cédula y cargamos los datos del cliente existente.
  inputCedula.addEventListener("input", () => {
    const valor = inputCedula.value.trim();

    if (valor.length > 0) {
      fetch(`/validar-cedula/?documento=${valor}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            mensaje.textContent = data.error;
            mensaje.style.color = "orange";
            return;
          }

          if (data.existe) {
            console.log(data);

            mensaje.textContent =
              "⚠️ Este Numero de Documento ya está registrado";
            mensaje.style.color = "red";
            inputCedula.style.border = "2px solid red";

            inputNombre.value = data.cliente.nombre;
            inputTelefono.value = data.cliente.telefono;
            inputCorreo.value = data.cliente.correo;
            inputDireccion.value = data.cliente.direccion;

            // Bloqueamos los campos

            document.getElementById("nombre").disabled = true;
            document.getElementById("telefono").disabled = true;
            document.getElementById("correo").disabled = true;

            document.getElementById("direccion").disabled = true;

            const ciudadCliente = data.cliente.ciudad;
            const opcion = Array.from(inputCiudad.options).find(
              (opt) => opt.value === ciudadCliente,
            );

            if (opcion) {
              // Si existe la ciudad en la lista, seleccionarla
              inputCiudad.value = ciudadCliente;

              if ($(inputCiudad).hasClass("selectpicker")) {
                $(inputCiudad).selectpicker("refresh");
              }
            } else {
              // Si no existe, crear una nueva opción y seleccionarla
              const nuevaOpcion = new Option(
                ciudadCliente,
                ciudadCliente,
                true,
                true,
              );
              inputCiudad.add(nuevaOpcion);
            }

            x;
          } else {
            inputNombre.value = "";
            inputTelefono.value = "";
            inputCorreo.value = "";
            inputDireccion.value = "";
            document.getElementById("btnRegistrar").style.display = "";
            document.getElementById("nombre").disabled = false;
            document.getElementById("telefono").disabled = false;
            document.getElementById("correo").disabled = false;
            document.getElementById("ciudad").disabled = false;
            document.getElementById("direccion").disabled = false;

            mensaje.textContent = "";
            inputCedula.style.border = "";
          }
        })
        .catch((err) => console.error("Error al validar cédula:", err));
    } else {
      mensaje.textContent = "";
    }
  });
}

// - Configuramos la visibilidad de campos y la validación del formulario.
document.addEventListener("DOMContentLoaded", () => {
  const pc = document.getElementById("camposPC");
  const imp = document.getElementById("camposIMP");
  const ton = document.getElementById("camposTON");
  const tipoServicio = document.getElementById("tipoServicio");

  // - Ocultamos los campos específicos de cada tipo de servicio.
  function ocultarCampos() {
    pc.style.display = "none";
    imp.style.display = "none";
    ton.style.display = "none";
  }



  // - Mostramos los campos correspondientes al tipo de servicio seleccionado.
  function mostrarCampos() {
    ocultarCampos();
    if (tipoServicio.value === "PC") {

      console.log("hola");

      pc.style.display = "block";
      imp.style.display = "none";
      ton.style.display = "none";


    } else if (tipoServicio.value === "IMP") {
      imp.style.display = "block";
      ton.style.display = "none";
      pc.style.display = "none";

    } else if (tipoServicio.value === "TON") {
      ton.style.display = "block";
      imp.style.display = "none";
      pc.style.display = "none";
    }
  }

  mostrarCampos();
  tipoServicio.addEventListener("change", mostrarCampos);

  if (!formulario) return;

  // - Validamos los campos específicos antes de registrar el servicio.
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tipoServicio = document.getElementById("tipoServicio").value;

    // Campos impresora
    const impModelo = document.querySelector('input[name="imp_modelo"]');
    const impSerial = document.querySelector('input[name="imp_serial"]');

    const pcModelo = document.querySelector('input[name="pc_modelo"]');

    const tnModelo = document.querySelector('input[name="toner_modelo"]');

    // Limpiar requeridos siempre
    impModelo.removeAttribute("required");
    impSerial.removeAttribute("required");

    // Si es servicio de IMPRESORA
    switch (tipoServicio) {
      case "IMP":
        if (!impModelo.value.trim() || !impSerial.value.trim()) {
          e.preventDefault(); // Detiene el submit

          Swal.fire({
            icon: "error",
            title: "Error",
            text: "⚠️ Para registrar un servicio de impresora, el modelo y el número de serial son obligatorios.",
          });

          return false;
        }

        await enviarDatos();
        break;

      case "PC":
        if (!pcModelo.value.trim()) {
          e.preventDefault(); // Detiene el submit

          Swal.fire({
            icon: "error",
            title: "Error",
            text: "⚠️ Para registrar un servicio de computadora, el modelo es obligatorios.",
          });

          return false;
        }

        // Si pasó la validación, los marcamos como requeridos

        await enviarDatos();
        break;

      case "TON":
        if (!tnModelo.value.trim()) {
          e.preventDefault(); // Detiene el submit

          Swal.fire({
            icon: "error",
            title: "Error",
            text: "⚠️ El modelo del toner es obligatorios.",
          });

          return false;
        }

        // Si pasó la validación, los marcamos como requeridos

        await enviarDatos();
        break;

      default:
        // 👉 otros tipos de servicio
        break;
    }
  });
});


// - Abrimos el modal con los detalles del servicio seleccionado.
$("#tabla-serviciosimpresoras").on("click", ".detalles", function () {
  $("#modalDetallesServicio").modal("show");

  });

// - Enviamos al servidor los datos del formulario y gestionamos la respuesta.
async function enviarDatos() {
  mensaje.textContent = "";
  inputCedula.style.border = "";

  const formData = new FormData(formulario);

  // Obtener token del input oculto
  const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;

  try {
    const response = await fetch("registrar/", {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRFToken": csrftoken, // ✅ ahora sí correcto
      },
    });

    const data = await response.json();

    if (data.success) {
      Swal.fire({
        title: "Éxito",
        text: data.message + "\n\n¿Desea imprimir el recibo?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Sí, imprimir",
        cancelButtonText: "No",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      // - Preguntamos si el usuario desea imprimir el recibo generado.
      }).then((result) => {
        if (result.isConfirmed) {
          let url = "";

          if (data.tipo === "IMP") {
            url = `/pdf_impresora/${data.id}/`;

            formulario.reset();
          } else if (data.tipo === "PC") {
            url = `/pdf_computador/${data.id}/`;
            formulario.reset();
          } else if (data.tipo === "TON") {
            url = `/pdf_toner/${data.id}/`;
            formulario.reset();
          }

          window.open(url, "_blank");
          formulario.reset();

          location.reload();
        }

        formulario.reset();

        $("#tabla-servicios").DataTable().ajax.reload(null, false);
        $("#modalAgregarServicio").modal("hide");
      });
    } else {
      Swal.fire("Error", data.message, "error");

      formulario.reset();
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "No se pudo registrar", "error");
  } finally {
    $("#tabla-servicios").DataTable().ajax.reload(null, false);
    $("#modalAgregarServicio").modal("hide");
    formulario.reset();
  }
}

const valorServicio = document.getElementById("valorServicio");
const abono = document.getElementById("abono");
const saldo = document.getElementById("saldo");

// - Calculamos el saldo restante a partir del valor del servicio y el abono.
function calcularSaldo() {
  const valor = parseFloat(valorServicio.value) || 0;
  const pago = parseFloat(abono.value) || 0;

  const resultado = valor - pago;
  saldo.value = resultado >= 0 ? resultado : 0;
}

valorServicio.addEventListener("input", calcularSaldo);
abono.addEventListener("input", calcularSaldo);


// -8 Esta funcion permite seleccion el tipo de servicio por categoria


 $('#tablaserviciosComputadores').on('show.bs.collapse', function () {
    $('#tablaserviciosimpresoras').collapse('hide');
  });

// Cuando se abre Impresoras, cerramos Computadores

  $('#tablaserviciosimpresoras').on('show.bs.collapse', function () {
    $('#tablaserviciosComputadores').collapse('hide');
  });