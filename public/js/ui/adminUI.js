
export function renderUsers(users) {
    const tableBody = document.getElementById("usersTable");
    tableBody.innerHTML = "";

    users.forEach(user => {
        const row = document.createElement("tr");

        // Si es el admin principal (id=1), no mostrar botones
        let actions = "";
        if (user.id !== 1 && user.id !== "1") {
            actions = `
                <button onclick="fillForm(${user.id})">Editar</button>
            `;
        }

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${actions}</td>
        `;

        tableBody.appendChild(row);
    });
}


export function clearUser () {
    localStorage.removeItem("user");
}

export function redirectToLogin() {
    window.location.href = "./index.html";
}
