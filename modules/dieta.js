import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGOcsBPRahcBvQFd1ojtjM7GDf5z60h0g",
  authDomain: "lista-de-la-compra-ca0b3.firebaseapp.com",
  databaseURL: "https://lista-de-la-compra-ca0b3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lista-de-la-compra-ca0b3",
  storageBucket: "lista-de-la-compra-ca0b3.firebasestorage.app",
  messagingSenderId: "578424079603",
  appId: "1:578424079603:web:b02306aff56ce27b436386"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);
const dbRef = ref(db, "dieta");

export function init() {
  const table = document.getElementById("dieta");

  // Resalta el día actual
  const day = new Date().getDay(); // 1 = lunes ... 5 = viernes
  if (day >= 1 && day <= 5) {
    const colIndex = day - 1;
    for (let row of table.rows) {
      const cell = row.cells[colIndex];
      if (cell) cell.classList.add("hoy");
    }
  }

  // Cargar datos desde Firebase
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    document.querySelectorAll("#dieta td").forEach(cell => {
      const dia = cell.dataset.dia;
      const tipo = cell.dataset.tipo;
      const valor = data?.[dia]?.[tipo] || "🍽️";
      cell.textContent = valor;
    });
  });

  // Editar celdas
  document.querySelectorAll("#dieta td").forEach(cell => {
    cell.addEventListener("click", () => {
      const dia = cell.dataset.dia;
      const tipo = cell.dataset.tipo;
      const nuevo = prompt(`Nuevo valor para ${tipo} de ${dia}:`, cell.textContent);
      if (nuevo !== null) {
        const celdaRef = ref(db, `dieta/${dia}/${tipo}`);
        set(celdaRef, nuevo);
      }
    });
  });
}
