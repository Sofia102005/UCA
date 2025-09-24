const messagesDiv = document.getElementById("messages");
const userList = document.getElementById("userList");

function fixChatHeight() {
    document.querySelector(".chat-container").style.height = window.innerHeight + "px";
}
window.addEventListener("resize", fixChatHeight);
fixChatHeight();

// Movil

const chatMain = document.getElementById("chatMain");
const backToUsers = document.getElementById("backToUsers");
const chatUserName = document.getElementById("chatUserName");
const sidebar = document.getElementById("userSidebar");


export function addMessage(user, text, isSelf = false) {
    const msgEl = document.createElement("div");
    msgEl.classList.add("message");
    if (isSelf) msgEl.classList.add("self");
    msgEl.innerHTML = `<strong>${user}: </strong>${text}`;
    messagesDiv.appendChild(msgEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

export function addSystemMessage(text) {
    const msgEl = document.createElement("div");
    msgEl.classList.add("message", "system");
    msgEl.innerHTML = `<em>⚙️ ${text}</em>`;
    messagesDiv.appendChild(msgEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

export function updateUserList(users) {
    userList.innerHTML = "";
    const moniEst = users.filter(u => u.rol && u.rol.toLowerCase() === 'monitor' || u.rol.toLowerCase() === 'estudiante');

    moniEst.forEach(u => {
        const li = document.createElement("li");
        li.classList.add("user-item");

        li.innerHTML = `
            <div class="user-avatar">
                <img src="${u.img}" alt="${u.name}" class="avatar-img">
                <span class="status ${u.connected ? "online" : "offline"}"></span>
            </div>
            <div class="user-info">
                <span class="user-name">${u.name}</span>
                <small class="user-role">${u.rol}</small>
            </div>
        `;
        li.addEventListener("click", () => {
        // mostrar chat en móvil
        chatUserName.textContent = "Chat";
        chatMain.classList.add("active");
        sidebar.classList.add("hide");
    });
        userList.appendChild(li);
    });
}

// botón atrás
backToUsers.addEventListener("click", () => {
  chatMain.classList.remove("active");
  sidebar.classList.remove("hide");
});

export function showUserList(list, show) {
    if (show) {
        list.classList.add("active");
    }
}

export function clearUser () {
    localStorage.removeItem("user");
}

export function redirectToLogin() {
    window.location.href = "./login.html";
}
