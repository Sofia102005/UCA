
import { getUsers, updateUser, createUser } from "./services/api.js";

const monitorContainer = document.getElementById("monitorContainer");
const monitorModal = document.getElementById("monitorModal");
const createUserModal = document.getElementById("createUserModal");

  document.getElementById("openCreateModal").addEventListener("click", () => {
    openCreateUserModal();
  });

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
    <h2>Editar Monitor</h2>
      <img src="${imgSrc}" alt="${user.name}" class="user-img"> 
      
      <label>Nombre:</label>
      <input type="text" id="nameInput" value="${user.name}">
      
      <label>Correo:</label>
      <input type="text" id="emailInput" value="${user.email}">
      
      <label>Rol:</label>
      <select id="rolSelect">
        <option value="Monitor" ${user.rol === 'Monitor' ? 'selected' : ''}>Monitor</option>
        <option value="admin" ${user.rol === 'admin' ? 'selected' : ''}>Admin</option>
        <option value="user" ${user.rol === 'estudiante' ? 'selected' : ''}>User</option>
      </select>
      
      <button type="button" id="saveButton">Guardar</button>
      <button type="button" id="closeButton">Cerrar</button>
    </div>`
  ;

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


function openCreateUserModal() {

  createUserModal.hidden = false;

  createUserModal.innerHTML = `
    <div class="modal-content">
      <h2>Crear nuevo usuario</h2>

      <label>Nombre:</label>
      <input type="text" id="newName" placeholder="Nombre">

      <label>Correo:</label>
      <input type="email" id="newEmail" placeholder="Correo">

      <label>Contraseña:</label>
      <input type="password" id="newPassword" placeholder="Contraseña">

      <label>Rol:</label>
      <select id="newRol">
        <option value="Monitor">Monitor</option>
        <option value="admin">Admin</option>
        <option value="user">Estudiante</option>
      </select>

      <label>URL Imagen:</label>
      <input type="text" id="newImg" placeholder="http://...">

      <button type="button" id="createSaveBtn">Crear</button>
      <button type="button" id="createCloseBtn">Cerrar</button>
    </div>
  `;

  // cerrar modal
  document.getElementById("createCloseBtn").addEventListener("click", () => {
    createUserModal.hidden = true;
  });

  // guardar usuario
  document.getElementById("createSaveBtn").addEventListener("click", async () => {
    const name = document.getElementById("newName").value.trim();
    const email = document.getElementById("newEmail").value.trim();
    const password = document.getElementById("newPassword").value.trim();
    const rol = document.getElementById("newRol").value;
    const img = document.getElementById("newImg").value.trim();

    if (!name || !email || !password) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      await createUser({ name, email, password, rol, img });
      alert("Usuario creado correctamente");
      createUserModal.hidden = true;
      loadMonitor(); // recargar lista
    } catch (err) {
      console.error("Error creando usuario:", err);
      alert("No se pudo crear el usuario");
    }
  });
}


document.addEventListener("DOMContentLoaded", loadMonitor);

