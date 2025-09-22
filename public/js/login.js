import { login } from "./services/api.js";
import { showError, clearError, saveUser, redirectToChat, redirectToAdmin } from "./ui/loginUI.js";

function getSelectedRoleFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('rol');
}

function mapUrlRoleToBackendRole(urlRole) {
    const roleMap = {
        'estudiante': 'user',
        'monitor': 'Monitor',
        'admin': 'admin'
    };
    return roleMap[urlRole] || null;
}

const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("name").value.trim();
    const password = document.getElementById("password").value.trim();
    const selectedRole = getSelectedRoleFromURL();

    clearError();

    try {
        if (!username || !password) {
            showError("Debes ingresar usuario y contraseña");
            return;
        }

        if (selectedRole) {
            console.log(`Rol seleccionado: ${selectedRole}`);
        }

        const data = await login(username, password);

        const user = data.user;
        if (!user || !user.rol) {
            throw new Error("Datos de usuario inválidos del servidor");
        }

        saveUser(user);

        const userRole = user.rol.toLowerCase();
        if (userRole === 'admin') {
            if (selectedRole && selectedRole !== 'admin') {
                if (confirm(`Tu cuenta es de Administrador, pero seleccionaste ${selectedRole}. ¿Continuar al panel admin?`)) {
                    redirectToAdmin();
                } else {
                    return;
                }
            } else {
                redirectToAdmin();
            }
        } else {
            if (selectedRole === 'admin') {
                throw new Error("No tienes permisos de administrador. Selecciona el rol correcto.");
            }
            redirectToChat();
        }

    } catch (err) {
        console.error("Error de login:", err);
        showError(err.message || "Credenciales inválidas");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const selectedRole = getSelectedRoleFromURL();
    if (selectedRole) {
        console.log(`Página cargada con rol seleccionado: ${selectedRole}`);
    }
});
export function redirectToChat() {
    window.location.href = '../login.html';
}
export function redirectToAdmin() {
    window.location.href = '/admin.html';
}

