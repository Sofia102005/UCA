// ./js/ui/loginUI.js

export function showError(message) {
    const errorEl = document.getElementById("loginError");
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';  // Asegura que se vea
        console.error('Error mostrado en UI:', message);  // Log para depuración
    } else {
        console.warn('Elemento #loginError no encontrado. Usando fallback.');
        // Fallback: Alerta temporal si no hay elemento (remueve en producción)
        alert('Error de login: ' + message);
    }
}

export function clearError() {
    const errorEl = document.getElementById("loginError");
    if (errorEl) {
        errorEl.textContent = "";
        errorEl.style.display = 'none';
    }
}

export function saveUser (user) {
    localStorage.setItem("user", JSON.stringify(user));
    console.log('Usuario guardado en localStorage:', user);  // Log para verificar en consola
}

export function redirectToChat() {
    console.log('Redirigiendo a chat (estudiante/monitor)...');
    window.location.href = "/chat.html";  
}

export function redirectToAdmin() {
    console.log('Redirigiendo a admin...');
    window.location.href = "/admin.html";  
    
}


export function redirectToMonitor() {
    console.log('Redirigiendo a monitor...');
    window.location.href = "/monitor.html";  
}
