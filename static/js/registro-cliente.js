// --- Validación en tiempo real de la cédula ---

const inputCedula = document.getElementById("documento");
const mensaje = document.getElementById("mensaje");

const nombreInput = document.getElementById('nombre');


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

             console.log(data)

            mensaje.textContent = "⚠️ Esta cédula ya está registrada";
            mensaje.style.color = "red";
            inputCedula.style.border = '2px solid red';

             nombreInput.value = data.cliente.nombre;

          } else {

            mensaje.textContent ='';
             inputCedula.style.border = ''; 
            
          }
        })
        .catch((err) => console.error("Error al validar cédula:", err));
    } else {
      mensaje.textContent = "";
    }
  });
}
