import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, get, update, onValue, push } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

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

const dbDieta = ref(db, "dieta");
const dbRecetas = ref(db, "recetas");

export function init() {
  const table = document.getElementById("dieta");

  // Resaltar día actual
  const day = new Date().getDay();
  if (day >= 1 && day <= 5) {
    const colIndex = day - 1;
    for (let row of table.rows) {
      const cell = row.cells[colIndex];
      if (cell) cell.classList.add("hoy");
    }
  }

  // Actualizar tabla con datos
  onValue(dbDieta, snapshot => {
    const data = snapshot.val();
    document.querySelectorAll("#dieta td").forEach(cell => {
      const dia = cell.dataset.dia;
      const tipo = cell.dataset.tipo;
      cell.textContent = data?.[dia]?.[tipo] || "🍽️";
    });
  });

  // Click en celda: mostrar editor y recetas
  document.querySelectorAll("#dieta td").forEach(cell => {
    cell.addEventListener("click", () => {
      const dia = cell.dataset.dia;
      const tipo = cell.dataset.tipo;
      const valor = cell.textContent;

      document.getElementById("detalle-comida").style.display = "block";
      document.getElementById("detalle-titulo").textContent = `🍽️ ${tipo.toUpperCase()} de ${dia.charAt(0).toUpperCase() + dia.slice(1)}`;
      document.getElementById("input-dieta").value = valor;

      document.getElementById("guardar-dieta").onclick = () => {
        const nuevo = document.getElementById("input-dieta").value;
        if (nuevo) {
          set(ref(db, `dieta/${dia}/${tipo}`), nuevo);
        }
      };

      // Cargar recetas relacionadas
      const recetasRef = ref(db, `recetas/${dia}/${tipo}`);
      onValue(recetasRef, snapshot => {
        const lista = document.getElementById("lista-recetas");
        lista.innerHTML = "";
        const recetas = snapshot.val() || [];
        recetas.forEach(r => {
          const li = document.createElement("li");
          li.textContent = r;
          lista.appendChild(li);
        });
      });

      // Agregar nueva receta
      document.getElementById("agregar-receta").onclick = () => {
        const nueva = document.getElementById("nueva-receta").value.trim();
        if (!nueva) return;
        const recetasRef = ref(db, `recetas/${dia}/${tipo}`);
        get(recetasRef).then(snapshot => {
          const actuales = snapshot.val() || [];
          actuales.push(nueva);
          set(recetasRef, actuales);
          document.getElementById("nueva-receta").value = "";
        });
      };
    });
  });
}
