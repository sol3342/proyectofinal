// URL del backend (tu API real en Vercel)
const API_URL = "https://blogme-pxo7r71ml-sols-projects-e58f8ab7.vercel.app";

document.addEventListener("DOMContentLoaded", () => {

    const registroForm = document.getElementById("registroForm");

    if (registroForm) {
        registroForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombre = document.getElementById("nombre").value;
            const apellidos = document.getElementById("apellidos").value;
            const fecha = document.getElementById("fecha").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const pista = document.getElementById("pista").value;
            const respuesta = document.getElementById("respuesta").value;

            // Validación edad 18+
            const birth = new Date(fecha);
            const today = new Date();
            const age = today.getFullYear() - birth.getFullYear();

            if (age < 18) {
                mostrarNotificacion("Debes tener 18 años o más para registrarte.", false);
                return;
            }

            // Contraseña con símbolo
            if (!/[!@#$%^&*()_+\-.,?]/.test(password)) {
                mostrarNotificacion("La contraseña debe incluir al menos un símbolo.", false);
                return;
            }

            const data = {
                nombre,
                apellidos,
                fechaNacimiento: fecha,
                email,
                password,
                pista,
                respuesta
            };

            try {
                // ⬇⬇⬇ AQUI EL CAMBIO: usar API_URL y no la URL fija
                const res = await fetch(`${API_URL}/api/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const json = await res.json();

                if (!res.ok) {
                    mostrarNotificacion(json.error || "Error al crear la cuenta.", false);
                    return;
                }

                mostrarNotificacion("Cuenta creada con éxito. ¡Bienvenido a BlogMe!", true);

            } catch (error) {
                mostrarNotificacion("No se pudo conectar con el servidor.", false);
            }
        });
    }
});


// NOTIFICACIÓN TIPO MODAL (GLASSMORPHISM)
function mostrarNotificacion(mensaje, exitoso) {
    const modal = document.createElement("div");
    modal.classList.add("modal-notificacion");

    modal.innerHTML = `
        <div class="modal-content ${exitoso ? "success" : "error"}">
            <p>${mensaje}</p>
            <button id="btnEntendido">Entendido</button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("btnEntendido").addEventListener("click", () => {
        modal.remove();
        if (exitoso) {
            window.location.href = "login.html";
        }
    });
}
