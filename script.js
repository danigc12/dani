const list = document.getElementById("shoppingList");
const input = document.getElementById("itemInput");

function saveList() {
  const items = [...list.children].map(li => li.firstChild.textContent);
  localStorage.setItem("listaCompra", JSON.stringify(items));
}

function loadList() {
  const saved = JSON.parse(localStorage.getItem("listaCompra") || "[]");
  saved.forEach(addItemToDOM);
}

function addItem() {
  const value = input.value.trim();
  if (value) {
    addItemToDOM(value);
    saveList();
    input.value = "";
    input.focus();
  }
}

function addItemToDOM(text) {
  const li = document.createElement("li");
  li.innerHTML = `<span>${text}</span><button onclick="deleteItem(this)">Eliminar</button>`;
  list.appendChild(li);
}

function deleteItem(btn) {
  const li = btn.parentElement;
  list.removeChild(li);
  saveList();
}

loadList();
