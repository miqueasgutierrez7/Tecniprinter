document.addEventListener("DOMContentLoaded", () => {

  const pc = document.getElementById("camposPC");
  const imp = document.getElementById("camposIMP");
  const ton = document.getElementById("camposTON");
  const tipoServicio = document.getElementById("tipoServicio");

  // ---- Funciones ----
  function ocultarCampos() {
    pc.style.display = "none";
    imp.style.display = "none";
    ton.style.display = "none";
  }

  function mostrarCampos() {
    ocultarCampos();

    if (tipoServicio.value === "PC") {
      pc.style.display = "block";
    } else if (tipoServicio.value === "IMP") {
      imp.style.display = "block";
    } else if (tipoServicio.value === "TON") {
      ton.style.display = "block";
    }
  }

  // Mostrar al cargar si hay valor seleccionado
  mostrarCampos();

  // Escuchar cambios
  tipoServicio.addEventListener("change", mostrarCampos);

  // =========================
  // REGISTRO AJAX
  // =========================
  const formulario = document.getElementById("formulario");
  const btnRegistrar = document.getElementById("btnRegistrar");

  if (!formulario) return;

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    btnRegistrar.disabled = true;
    btnRegistrar.textContent = "Registrando...";

    const formData = new FormData(formulario);

    try {
      const response = await fetch("/registrar/", {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRFToken": document.querySelector(
            "[name=csrfmiddlewaretoken]"
          ).value,
        },
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire("Éxito", data.message, "success");

        if (typeof tabla !== "undefined") {
          tabla.ajax.reload(null, false);
        }

        formulario.reset();
        ocultarCampos();
      } else {
        Swal.fire("Error", data.message, "error");
      }

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo registrar", "error");
    } finally {
      btnRegistrar.disabled = false;
      btnRegistrar.textContent = "Registrar";
    }
  });
});
