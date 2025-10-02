import { getUsers, getUser, createUser, updateUser} from "./services/api.js";
import { renderUsers, resetForm, fillForm } from "./ui/adminUI.js";

const form = document.getElementById("userForm");
const tableBody = document.getElementById("usersTable");
const submitBtn = document.getElementById("submitBtn");
let editingId = null;

tableBody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = Number(btn.dataset.id);

    if (btn.classList.contains("btn-edit")) {
        try {
            if (editingId === id) {
                resetForm(form, submitBtn);
                editingId = null;
                return;
            }
            const user = await getUser(id);
            fillForm(form, user, submitBtn);
            editingId = id;
        } catch (err) {
            console.error("Error cargando user:", err);
            alert("No se pudo cargar el user para edición.");
        }
    }
});

// Envío del form
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.querySelector("#name").value;
    const email = form.querySelector("#email").value.trim();
    const rol = form.querySelector("#rol").value;
    const password = form.querySelector("#password").value;
    const img = form.querySelector("#img").value;

    if (!name) {
        alert("El campo nombre es obligatorio");
        return;
    }
     if (!email) {
        alert("El campo del correo es obligatorio");
        return;
    }

     if (!password) {
        alert("El campo de la contraseña es obligatorio");
        return;
    }


    try {
        if (editingId) {
            await updateUser(editingId, {name, email, rol, password,img });
            editingId = null;
        } else {
            await createUser({name, email, rol, password, img});
        }

        resetForm(form, submitBtn);
        loadUsers();
    } catch (err) {
        console.error("Error guardando monitor:", err);
        alert("No se pudo guardar el monitor.");
    }
});

// Cargar al inicio
async function loadUsers() {
    try {
        const users = await getUsers();
        renderUsers(users, tableBody);
    } catch (err) {
        console.error("Error cargando lista:", err);
        alert("No se pudieron cargar los users.");
    }
}

loadUsers();