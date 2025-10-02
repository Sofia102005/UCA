
import { getUsers, updateUser, createUser } from "./services/api.js";
import { clearUser, redirectToLogin} from "./ui/adminUI.js";


const monitorContainer = document.getElementById("monitorContainer");
const monitorModal = document.getElementById("monitorModal");
const createUserModal = document.getElementById("createUserModal");
const logout = document.getElementById("btn-primary");

const rolFilter = document.getElementById("rolFilter");
const nameFilter = document.getElementById("nameFilter");

let allUsers = []; // guardamos todos los usuarios


// Verificar usuario
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) redirectToLogin();

document.getElementById("openCreateModal").addEventListener("click", () => {
  openCreateUserModal();
});

async function loadMonitor() {
  try {
    const data = await getUsers();
    allUsers = Array.isArray(data) ? data : Object.values(data);


    if (!allUsers.length) {
      userContainer.innerHTML = "<p>No hay usuarios para mostrar.</p>";
      return;
    }


    applyFilters();

  } catch (err) {
    console.error("Error cargando usuarios:", err);
    userContainer.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

function applyFilters() {

  let filteredUsers = [...allUsers];

  // Filtro por rol
 const selectedRol = rolFilter.value.toLowerCase();
if (selectedRol !== "all") {
  filteredUsers = filteredUsers.filter(user => user.rol.toLowerCase() === selectedRol);
}

  // Filtro por nombre
  const nameQuery = nameFilter.value.toLowerCase().trim();
  if (nameQuery) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(nameQuery)
    );
  }

  renderUser(filteredUsers);
}


rolFilter.addEventListener("change", applyFilters);
nameFilter.addEventListener("input", applyFilters);


function renderUser(users) {
  monitorModal.hidden = true;
  monitorContainer.innerHTML = "";

  users.forEach(user => {
    const imgSrc = user.img;
    const div = document.createElement("div");
    div.classList.add("user");

    // Botón de acción según id
    let buttonHTML;
    if (user.id === 1) {
      buttonHTML = `<button type="button" class="detailsButton" disabled style="background:#ccc;cursor:not-allowed;">No editable</button>`;
    } else {
      buttonHTML = `<button type="button" class="detailsButton" data-id="${user.id}">Editar</button>`;
    }
    div.innerHTML = `
      <img src="${imgSrc}">
      <div class="user-body">
        <h2>${user.name}</h2>
        <p><strong>Correo:</strong> ${user.email}</p>
        <p><strong>Rol:</strong> ${user.rol}</p>
        ${buttonHTML}
      </div>
    `;
    monitorContainer.appendChild(div);

    // Evento de click solo si no es admin principal
    if (user.id !== 1) {
      div.querySelector(".detailsButton").addEventListener("click", () => {
        openModal(user, imgSrc);
      });
    }
  });
}

function openModal(user, imgSrc) {
  
  monitorModal.hidden = false;
  monitorModal.innerHTML = `
    <div class="modal" id="editModal">
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
        <option value="Admin" ${user.rol === 'Admin' ? 'selected' : ''}>Admin</option>
        <option value="Estudiante" ${user.rol === 'Estudiante' ? 'selected' : ''}>Estudiante</option>
      </select>

      <label>Imagen URL:</label>
      <input type="text" id="imgInput" value="${user.img}">

      <label>Contraseña:</label>
      <input type="text" id="passwordInput" value="${user.password}">

      <div class="modal-buttons">
      <button type="button" id="closeButton">Cerrar</button>
      <button type="button" id="saveButton">Guardar</button>
      
      </div>
    </div>
    </div>`

    ;

  document.getElementById("closeButton").addEventListener("click", () => {
    monitorModal.hidden = true;
  });

  document.getElementById("saveButton").addEventListener("click", async () => {
    const newName = document.getElementById("nameInput").value;
    const newEmail = document.getElementById("emailInput").value;
    const newRol = document.getElementById("rolSelect").value;
    const newpass = document.getElementById("passwordInput").value;
    const newImg = document.getElementById("imgInput").value;

    try {
      await updateUser(user.id, {
        name: newName,
        email: newEmail,
        rol: newRol,
        password: newpass,
        img: newImg
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
        <option value="Admin">Admin</option>
        <option value="Estudiante">Estudiante</option>
      </select>

      <label>URL Imagen:</label>
      <input type="text" id="newImg" placeholder="http://...">

      <div class="modal-buttons">

      <button type="button" id="createCloseBtn">Cerrar</button>
      <button type="button" id="createSaveBtn">Crear</button>
      
      </div>
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

logout.addEventListener("click", function() {
    clearUser();
    redirectToLogin();
});

document.addEventListener("DOMContentLoaded", loadMonitor);

