console.log("Archivo JS cargado correctamente");

// --- Validación en tiempo real de la cédula ---

const inputCedula = document.getElementById("documento");
const mensaje = document.getElementById("mensaje");

if (inputCedula) {
  inputCedula.addEventListener("input", () => {
    const valor = inputCedula.value.trim();

    console.log(valor);

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
            mensaje.textContent = "⚠️ Esta cédula ya está registrada";
            mensaje.style.color = "red";
          } else {
            mensaje.textContent = "✅ Cédula disponible";
            mensaje.style.color = "green";
          }
        })
        .catch((err) => console.error("Error al validar cédula:", err));
    } else {
      mensaje.textContent = "";
    }
  });
}
