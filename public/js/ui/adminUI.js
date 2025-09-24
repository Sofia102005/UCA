

export function clearUser () {
    localStorage.removeItem("user");
}

export function redirectToLogin() {
    window.location.href = "./index.html";
}
