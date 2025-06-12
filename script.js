const list = document.getElementById("shoppingList");
const input = document.getElementById("itemInput");

function saveList() {
  const items = [...list.children].map(li => {
    return {
      text: li.querySelector(".item-text").textContent,
      checked: li.querySelector("input[type='checkbox']").checked
    };
  });
  localStorage.setItem("listaCompra", JSON.stringify(items));
}

function loadList() {
  const saved = JSON.parse(localStorage.getItem("listaCompra") || "[]");
  saved.forEach(item => addItemToDOM(item.text, item.checked));
}

function addItemToDOM(text, checked = false) {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = checked;
  checkbox.addEventListener("change", () => {
    span.classList.toggle("checked", checkbox.checked);
    saveList();
  });

  const span = document.createElement("span");
  span.className = "item-text";
  span.textContent = text;
  if (checked) span.classList.add("checked");

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "❌";
  deleteBtn.onclick = () => {
    li.remove();
    saveList();
  };

  const btnContainer = document.createElement("div");
  btnContainer.className = "buttons";
  btnContainer.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(btnContainer);

  list.appendChild(li);
}

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const value = input.value.trim();
    if (value) {
      addItemToDOM(value);
      saveList();
      input.value = "";
    }
  }
});

loadList();
