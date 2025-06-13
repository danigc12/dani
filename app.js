export async function navigate(view) {
  const res = await fetch(`views/${view}.html`);
  const html = await res.text();
  document.getElementById("app").innerHTML = html;

  // Carga el módulo JS asociado si existe
  try {
    const module = await import(`./modules/${view}.js`);
    if (module.init) module.init(); // si define una función init()
  } catch (e) {
    console.warn(`No se pudo cargar módulo JS para la vista ${view}`);
  }
}

// Exponer navigate globalmente
window.navigate = navigate;
