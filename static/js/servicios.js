function mostrarCampos() {
  let tipo = document.getElementById("tipoServicio").value;
  document.getElementById("camposPC").classList.add("d-none");
  document.getElementById("camposIMP").classList.add("d-none");
  document.getElementById("camposTON").classList.add("d-none");

  if (tipo === "PC") document.getElementById("camposPC").classList.remove("d-none");
  if (tipo === "IMP") document.getElementById("camposIMP").classList.remove("d-none");
  if (tipo === "TON") document.getElementById("camposTON").classList.remove("d-none");

}