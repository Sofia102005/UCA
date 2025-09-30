// js/chat.js
import { connect, sendMessage } from "./web/chatSocket.js";
import { getSelectedUser, addMessage, clearUser, redirectToLogin } from "./ui/chatUI.js";

// Verificar usuario
const user = JSON.parse(localStorage.getItem("user"));
if (!user) redirectToLogin();

// Mostrar nombre en la sidebar (si existe)
const chatUsernameEl = document.getElementById("chat-username");
if (chatUsernameEl) chatUsernameEl.textContent = user.name;

// Referencias DOM
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const logout = document.getElementById("logoutBtn");
const sidebar = document.getElementById("userSidebar");
const toggleBtn = document.getElementById("usersToggle");
const closeBtn = document.getElementById("closeSidebar");

// Conectar al WebSocket
connect(user);

// Enviar mensaje (form)
if (chatForm) {
  chatForm.addEventListener("submit", e => {
    e.preventDefault();
    const message = messageInput.value.trim();
    const selectedUser = getSelectedUser();
    if (!message || !selectedUser) return alert("Selecciona un usuario y escribe un mensaje");

    // enviar al servidor: user.name (remitente), text, to (destinatario por nombre)
    sendMessage(user.name, message, selectedUser.name);

    // mostrar localmente (lo recibirá también si el servidor reenvía al remitente, pero esto evita retraso visual)
    addMessage(user.name, message, true, selectedUser.name);  

    messageInput.value = "";
  });
}

// Cerrar sesión
if (logout) {
  logout.addEventListener("click", function (ev) {
    ev.preventDefault();
    clearUser();
    redirectToLogin();
  });
}

// Si existen botones toggle (opcional)
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    // abre sidebar
    sidebar && sidebar.classList.remove("hide");
  });
}
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    // cierra sidebar
    sidebar && sidebar.classList.add("hide");
  });
}
