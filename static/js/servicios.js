  var pc = document.getElementById("camposPC");
    var imp = document.getElementById("camposIMP");
    var ton = document.getElementById("camposTON");

    // Ocultar todos
    pc.style.display = "none";
     imp.style.display = "block";
    ton.style.display = "none";

    
    
    function mostrarCampos() {
    var tipoServicio = document.getElementById("tipoServicio").value;

  
    // Mostrar el seleccionado
    if (tipoServicio === "PC") {
        pc.style.display = "block";
        imp.style.display = "none";
        ton.style.display = "none";

    } else if (tipoServicio === "IMP") {
        imp.style.display = "block";
        pc.style.display = "none";
    } else if (tipoServicio === "TON") {
        ton.style.display = "block";
        pc.style.display = "none";
        imp.style.display = "none";
    }
}