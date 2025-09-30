// js/ui/chatUI.js
function fixChatHeight() {
  const cont = document.querySelector(".chat-container");
  if (cont) cont.style.height = window.innerHeight + "px";
}
window.addEventListener("resize", fixChatHeight);
fixChatHeight();

// DOM refs (comprobamos existencia)
const chatMain = document.getElementById("chatMain");
const chatForm = document.getElementById("chatForm");
const backToUsers = document.getElementById("backToUsers");
const chatUserName = document.getElementById("chatUserName");
const sidebar = document.getElementById("userSidebar");
const userList = document.getElementById("userList");
const messagesDiv = document.getElementById("messages");
const chatHeader = document.getElementById("chat-header");

let selectedUser = null;
const chats = {}; 

export function getSelectedUser() {
  return selectedUser;
}

// Añadir y almacenar mensaje (remitente, texto, isSelf, to)
export function addMessage(user, text, isSelf = false, to = null) {
  // determinar con quién es la conversación (other)
  const other = isSelf ? (to || user) : user;
  if (!other) return;

  if (!chats[other]) chats[other] = [];
  chats[other].push({ user, text, isSelf });

  // si estamos viendo esa conversación, renderizar
  if (selectedUser && selectedUser.name === other) {
    renderMessages(other);
  }
}

// Mensaje de sistema (no privado)
export function addSystemMessage(text) {
  const msgEl = document.createElement("div");
  msgEl.classList.add("message", "system");
  msgEl.innerHTML = `<em></em>`;
  if (messagesDiv) messagesDiv.appendChild(msgEl);
  requestAnimationFrame(() => {
    if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}

function renderMessages(other) {
  
  if (!messagesDiv) return;
  messagesDiv.innerHTML = "";
  const list = chats[other] || [];
  list.forEach((m) => {
    const msgEl = document.createElement("div");
    msgEl.classList.add("message");
    if (m.isSelf) msgEl.classList.add("self");
    msgEl.innerHTML = `<strong>${m.user}: </strong>${m.text}`;
    messagesDiv.appendChild(msgEl);
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Actualizar lista de usuarios (viene del servidor)
export function updateUserList(users = [], currentUser = null) {
  if (!userList) return;

  userList.innerHTML = "";

 // Tomar currentUser de parámetro o de localStorage
  if (!currentUser) {
    currentUser = JSON.parse(localStorage.getItem("user")) || {};
  }

  // Normalizar rol del usuario actual
  const myRol = (currentUser.rol || "").toLowerCase();

  // Filtro seguro (solo monitores o estudiantes, ignora indefinidos)
  let filtered = users.filter(u => u.rol && (u.rol.toLowerCase() === "monitor" || u.rol.toLowerCase() === "estudiante"));

  // Si soy estudiante, mostrar solo monitores
  if (myRol === "estudiante") {
    filtered = filtered.filter(u => u.rol.toLowerCase() === "monitor");
  }

  // Si soy monitor, mostrar solo estudiantes
  if (myRol === "monitor") {
    filtered = filtered.filter(u => u.rol.toLowerCase() === "estudiante");
  }



  filtered.forEach(u => {
    const li = document.createElement("li");
    li.classList.add("user-item");
    li.innerHTML = `
      <div class="user-avatar">
        <img src="${u.img || '/public/images/default-avatar.png'}" alt="${u.name}" class="avatar-img">
        <span class="status ${u.connected ? "online" : "offline"}"></span>
      </div>
      <div class="user-info">
        <span class="user-name">${u.name}</span>
        <small class="user-role">${u.rol || ''}</small>
      </div>
    `;
    li.addEventListener("click", () => openChat(u));
    userList.appendChild(li);
  });


}

// abrir chat con usuario
function openChat(user) {

    
  selectedUser = user;
  
  if (chatUserName) chatUserName.textContent = user.name;
  // mostrar chat (en móvil oculta sidebar)
  if (chatMain) chatMain.classList.add("active");
  if (chatForm) chatForm.classList.add("active");
  if (sidebar) sidebar.classList.remove("hide");

  renderMessages(user.name);
}

// botón atrás (móvil)
if (backToUsers) {
  backToUsers.addEventListener("click", () => {
    selectedUser = null;
    if (chatUserName) chatUserName.textContent = "Selecciona un usuario";
    if (sidebar) sidebar.classList.remove("hide");
    if (chatMain) chatMain.classList.remove("active");
    if (chatForm) chatForm.classList.remove("active");

    messagesDiv.innerHTML = "";


  });
}

// Mostrar/ocultar lista (usado por botones toggle si existen)
export function showUserList(listElement, show) {
 userList.innerHTML = "";

  // Obtener rol actual (monitor o estudiante)
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const myRole = currentUser.role;

  // Filtrar según el rol
  const filteredUsers = users.filter(u => u.role !== myRole);

  filteredUsers.forEach(u => {
    const li = document.createElement("li");
    li.classList.add("user-item");
    li.textContent = u.name + " (" + u.role + ")";
    li.addEventListener("click", () => openChat(u));
    userList.appendChild(li);
  });



  if (!listElement) return;
  if (show) listElement.classList.remove("hide");
  else listElement.classList.add("hide");
}

// utilidades
export function clearUser() {
  localStorage.removeItem("user");
}
export function redirectToLogin() {
  window.location.href = "./index.html";
}
