import { getUsers, updateUser } from "./services/api.js";

const monitorContainer = document.getElementById("monitorContainer");
const monitorModal = document.getElementById("monitorModal");

async function loadMonitor() {
  try {
    const data = await getUsers();
    const users = Array.isArray(data) ? data : Object.values(data);

    const monitors = users.filter(u => u.rol && u.rol.toLowerCase() === 'monitor');

    if (!monitors.length) {
      monitorContainer.innerHTML = "<p>No hay monitores para mostrar.</p>";
      return;
    }
    renderUser(monitors);
  } catch (err) {
    console.error("Error cargando monitores:", err);
    monitorContainer.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

function renderUser(users) {
  monitorModal.hidden = true;
  monitorContainer.innerHTML = "";

  users.forEach(user => {
    const imgSrc = user.img;
    const div = document.createElement("div");
    div.classList.add("user");
    div.innerHTML = `
      <img src="${imgSrc}">
      <div class="user-body">
        <h2>${user.name}</h2>
        <p><strong>Correo:</strong> ${user.email}</p>
        <p><strong>Rol:</strong> ${user.rol}</p>
        <button type="button" class="detailsButton" id="${user.id}">Editar</button>
      </div>
    `;
    monitorContainer.appendChild(div);

    div.querySelector(".detailsButton").addEventListener("click", () => {
      openModal(user, imgSrc);
    });
  });
}

function openModal(user, imgSrc) {
  monitorModal.hidden = false;

  monitorModal.innerHTML = `
    <div class="modal-content">
      <img src="${imgSrc}" alt="${user.name}" class="user-img"> 
      
      <label>Nombre:</label>
      <input type="text" id="nameInput" value="${user.name}">
      
      <label>Correo:</label>
      <input type="text" id="emailInput" value="${user.email}">
      
      <label>Rol:</label>
      <select id="rolSelect">
        <option value="Monitor" ${user.rol === 'Monitor' ? 'selected' : ''}>Monitor</option>
        <option value="admin" ${user.rol === 'admin' ? 'selected' : ''}>Admin</option>
        <option value="user" ${user.rol === 'user' ? 'selected' : ''}>User</option>
      </select>
      
      <button type="button" id="saveButton">Guardar</button>
      <button type="button" id="closeButton">Cerrar</button>
    </div>
  `;

  document.getElementById("closeButton").addEventListener("click", () => {
    monitorModal.hidden = true;
  });

  document.getElementById("saveButton").addEventListener("click", async () => {
    const newName = document.getElementById("nameInput").value;
    const newEmail = document.getElementById("emailInput").value;
    const newRol = document.getElementById("rolSelect").value;

    try {
      await updateUser(user.id, {
        name: newName,
        email: newEmail,
        rol: newRol
      });
      alert("Monitor actualizado correctamente");
      monitorModal.hidden = true;
      loadMonitor();
    } catch (err) {
      console.error("Error actualizando monitor:", err);
      alert("No se pudo actualizar el monitor.");
    }
  });
}

document.addEventListener("DOMContentLoaded", loadMonitor);
