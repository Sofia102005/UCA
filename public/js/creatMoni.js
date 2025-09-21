import { createUser, updateUser} from "./services/api.js";
import { resetForm } from "./ui/ui.js";

const form = document.getElementById("userForm");
const submitBtn = document.getElementById("submitBtn");
let editingId = null;

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.querySelector("#name").value;
    const email = form.querySelector("#email").value.trim();
    const rol = form.querySelector("#rol").value;
    const password = form.querySelector("#password").value;

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
            await updateUser(editingId, { name, email, rol, password});
            editingId = null;
        } else {
            await createUser({  name, email, rol, password});
        }

        resetForm(form, submitBtn);
        loadUsers();
    } catch (err) {
        console.error("Error guardando monitor:", err);
        alert("No se pudo guardar el monitor.");
    }
});