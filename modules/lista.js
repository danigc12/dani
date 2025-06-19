import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, push, onChildAdded, onChildChanged, onChildRemoved, update, remove } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDGOcsBPRahcBvQFd1ojtjM7GDf5z60h0g",
  authDomain: "lista-de-la-compra-ca0b3.firebaseapp.com",
  databaseURL: "https://lista-de-la-compra-ca0b3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lista-de-la-compra-ca0b3",
  storageBucket: "lista-de-la-compra-ca0b3.firebasestorage.app",
  messagingSenderId: "578424079603",
  appId: "1:578424079603:web:b02306aff56ce27b436386"
};

// Solo inicializa una vez
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);
const dbRef = ref(db, "shoppingList");

export function init() {
  const list = document.getElementById("shoppingList");
  const input = document.getElementById("itemInput");

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const value = input.value.trim();
      if (value) addItem(value);
    }
  });

  onChildAdded(dbRef, (snapshot) => {
    renderItem(snapshot.key, snapshot.val());
  });

  onChildChanged(dbRef, (snapshot) => {
    const li = document.getElementById(snapshot.key);
    if (li) {
      const checkbox = li.querySelector("input[type='checkbox']");
      const span = li.querySelector(".item-text");

      checkbox.checked = snapshot.val().checked;
      span.classList.toggle("checked", snapshot.val().checked);
    }
  });

  onChildRemoved(dbRef, (snapshot) => {
    const li = document.getElementById(snapshot.key);
    if (li) li.remove();
  });

  function addItem(text, checked = false, id = null) {
    const itemId = id || push(dbRef).key;
    const itemRef = ref(db, `shoppingList/${itemId}`);
    set(itemRef, { text, checked });
    input.value = "";
  }

  function updateItem(id, checked) {
    const itemRef = ref(db, `shoppingList/${id}`);
    update(itemRef, { checked });
  }

  function deleteItem(id) {
    const itemRef = ref(db, `shoppingList/${id}`);
    remove(itemRef);
  }

  function renderItem(id, data) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.className = "item-text";
    span.textContent = data.text;
    if (data.checked) span.classList.add("checked");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = data.checked;
    checkbox.addEventListener("change", () => {
      span.classList.toggle("checked", checkbox.checked);
      updateItem(id, checkbox.checked);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = () => deleteItem(id);

    const leftPart = document.createElement("div");
    leftPart.style.display = "flex";
    leftPart.style.alignItems = "center";
    leftPart.style.gap = "0.5rem";
    leftPart.appendChild(checkbox);
    leftPart.appendChild(span);

    const content = document.createElement("div");
    content.style.display = "flex";
    content.style.alignItems = "center";
    content.style.justifyContent = "space-between";
    content.style.width = "100%";
    content.appendChild(leftPart);
    content.appendChild(deleteBtn);

    li.appendChild(content);
    li.id = id;
    list.appendChild(li);
  }
}
