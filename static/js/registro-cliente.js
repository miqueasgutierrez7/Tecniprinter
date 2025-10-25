// --- Validación en tiempo real de la cédula ---

const inputCedula = document.getElementById("documento");
const mensaje = document.getElementById("mensaje");

const inputNombre = document.getElementById('nombre');
const inputTelefono = document.getElementById('telefono');
const inputCorreo = document.getElementById('correo');
const inputCiudad = document.getElementById('ciudad');
const inputDireccion = document.getElementById('direccion');

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

             console.log(data)


               document.getElementById('btnRegistrar').style.display = 'none';



            mensaje.textContent = "⚠️ Este Numero de Documento ya está registrado";
            mensaje.style.color = "red";
            inputCedula.style.border = '2px solid red';

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
            const opcion = Array.from(inputCiudad.options).find(opt => opt.value === ciudadCliente);

            if (opcion) {
              // Si existe la ciudad en la lista, seleccionarla
              inputCiudad.value = ciudadCliente;

              if ($(inputCiudad).hasClass('selectpicker')) {
    $(inputCiudad).selectpicker('refresh');
  }

            } else {

              
              // Si no existe, crear una nueva opción y seleccionarla
              const nuevaOpcion = new Option(ciudadCliente, ciudadCliente, true, true);
              inputCiudad.add(nuevaOpcion);
            }


        x


          } else {


             inputNombre.value = '';
             inputTelefono.value = '';
             inputCorreo.value = '';
             inputDireccion.value = '';


            document.getElementById('btnRegistrar').style.display = '';
    document.getElementById("nombre").disabled = false;
    document.getElementById("telefono").disabled = false;
    document.getElementById("correo").disabled = false;
    document.getElementById("ciudad").disabled = false;
    document.getElementById("direccion").disabled = false;

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
