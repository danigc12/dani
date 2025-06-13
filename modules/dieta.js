export function init() {
  const table = document.getElementById("dieta");

  const day = new Date().getDay(); // 0 = domingo, 1 = lunes, ..., 5 = viernes

  // Si es de lunes (1) a viernes (5)
  if (day >= 1 && day <= 5) {
    const columnIndex = day - 1; // ajustamos al índice de columna

    const filas = table.getElementsByTagName("tr");
    for (let i = 1; i < filas.length; i++) {
      const celdas = filas[i].getElementsByTagName("td");
      if (celdas[columnIndex]) {
        celdas[columnIndex].classList.add("hoy");
      }
    }
  }
}
