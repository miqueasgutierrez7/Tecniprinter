let tabla;

$(document).ready(function () {
  console.log("DataTables iniciado correctamente");
  tabla = $("#tabla-clientes").DataTable({
    ajax: "/api/clientes/",
    dataSrc: "data",
    columns: [
      { data: "idCliente" },
      { data: "tipoDocumento" },
      { data: "nombre" },
      { data: "numeroDocumento" },
      { data: "telefono" },
      { data: "correo" },
      { data: "ciudad" },
      { data: "direccion" },

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
        },
      },
    ],
    responsive: true,
    language: {
      url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json",
    },
  });
});

$("#tabla-clientes").on("click", ".editar", function () {
  const id = $(this).data("id");

  // Hacer fetch a la vista de Django para obtener los datos del cliente
  fetch(`/clientes/${id}/`, {
    // Asegúrate que la URL coincida con tu urls.py
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Llenar los campos del modal con los datos del cliente
        $("#edit-id").val(data.cliente.idCliente);
        $("#edit-tipoDocumento").val(data.cliente.tipoDocumento);
        $("#edit-nombre").val(data.cliente.nombre);
        $("#edit-numeroDocumento").val(data.cliente.numeroDocumento);
        $("#edit-telefono").val(data.cliente.telefono);
        $("#edit-correo").val(data.cliente.correo);
        $("#edit-ciudad").val(data.cliente.ciudad);
        $("#edit-direccion").val(data.cliente.direccion);

        const inputCiudadEditar = document.getElementById("edit-ciudad");

        const ciudadCliente = data.cliente.ciudad;
        const opcion = Array.from(inputCiudad.options).find(
          (opt) => opt.value === ciudadCliente
        );

        if (opcion) {
          // Si existe la ciudad en la lista, seleccionarla
          inputCiudadEditar.value = ciudadCliente;

          if ($(inputCiudadEditar).hasClass("selectpicker")) {
            $(inputCiudadEditar).selectpicker("refresh");
          }
        } else {
          // Si no existe, crear una nueva opción y seleccionarla
          const nuevaOpcion = new Option(
            ciudadCliente,
            ciudadCliente,
            true,
            true
          );
          inputCiudadEditar.add(nuevaOpcion);
        }

        // Mostrar modal
        $("#modalEditarCliente").modal("show");
      } else {
        Swal.fire("Error", data.message, "error");
      }
    })
    .catch((error) => {
      console.error("Error al obtener cliente:", error);
      Swal.fire(
        "Error",
        "No se pudo cargar la información del cliente",
        "error"
      );
    });
});

$("#tabla-clientes").on("click", ".eliminar", function () {
  const id = $(this).data("id");
  if (!id) {
    console.error("No se encontró el id para eliminar");
    return;
  }
  Swal.fire({
    title: "¿Eliminar cliente?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `/api/clientes/${id}/`, // Ajústalo a tu URL real
        type: "DELETE",
        success: function (response) {
          Swal.fire("Eliminado", "Cliente eliminado correctamente", "success");
          $("#tabla-clientes").DataTable().ajax.reload();
        },
        error: function (xhr, status, error) {
          Swal.fire("Error", "No se pudo eliminar el cliente", "error");
        },
      });
    }
  });
});

document
  .getElementById("guardarCambiosCliente")
  .addEventListener("click", async () => {
    const id = document.getElementById("edit-id").value;

    // Capturar datos del formulario
    const datos = {
      tipoDocumento: document.getElementById("edit-tipoDocumento").value,
      numeroDocumento: document.getElementById("edit-numeroDocumento").value,
      nombre: document.getElementById("edit-nombre").value,
      telefono: document.getElementById("edit-telefono").value,
      correo: document.getElementById("edit-correo").value,
      ciudad: document.getElementById("edit-ciudad").value,
      direccion: document.getElementById("edit-direccion").value,
    };

    try {
      const response = await fetch(`/api/clientes/modificar/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]")
            .value,
        },
        body: JSON.stringify(datos),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: "Actualizado",
          text: "Cliente actualizado correctamente",
          icon: "success",
        });

        $("#modalEditarCliente").modal("hide");

        if (tabla) tabla.ajax.reload(null, false);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      Swal.fire("Error", "No se pudo actualizar el cliente", "error");
    }
  });

// --- Validación en tiempo real de la cédula --
document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario");
  const btnRegistrar = document.getElementById("btnRegistrar");

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita recargar la página

    btnRegistrar.disabled = true;
    btnRegistrar.textContent = "Enviando...";
    const formData = new FormData(formulario);

    try {
      const response = await fetch("/registrar/", {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]")
            .value,
        },
      });

      if (!response.ok) throw new Error("Error de red o servidor");

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: "¡Registro exitoso!",
          text: data.message,
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#3085d6",
          timer: 2500,
          timerProgressBar: true,
        });

        if (tabla) {
          tabla.ajax.reload(null, false); // false = mantiene la página actual
        }

        formulario.reset();
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al enviar el formulario: " + error.message);
    } finally {
      btnRegistrar.disabled = false;
      btnRegistrar.textContent = "Registrar";
    }
  });
});

const inputCedula = document.getElementById("documento");
const mensaje = document.getElementById("mensaje");
const inputNombre = document.getElementById("nombre");
const inputTelefono = document.getElementById("telefono");
const inputCorreo = document.getElementById("correo");
const inputCiudad = document.getElementById("ciudad");
const inputDireccion = document.getElementById("direccion");

if (inputCedula) {
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

            document.getElementById("btnRegistrar").style.display = "none";

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
              (opt) => opt.value === ciudadCliente
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
                true
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
