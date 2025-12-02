const API_BASE = "https://blogme.vercel.app/api/auth";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("recuperarForm");
    const pistaContainer = document.getElementById("pistaContainer");
    const nuevaPassContainer = document.getElementById("nuevaPassContainer");
    const textoPista = document.getElementById("textoPista");

    // 1️⃣ Obtener pista
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("emailRec").value;

        try {
            const res = await fetch(`${API_BASE}/get-pista`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const json = await res.json();

            if (!res.ok) {
                alert(json.error);
                return;
            }

            textoPista.textContent = "Pista: " + json.pistaTexto;
            pistaContainer.style.display = "block";

        } catch (error) {
            alert("Error de conexión con el servidor.");
        }
    });

    // 2️⃣ Validar respuesta
    document.getElementById("btnValidar").addEventListener("click", async () => {
        const email = document.getElementById("emailRec").value;
        const respuesta = document.getElementById("respuestaRec").value;

        try {
            const res = await fetch(`${API_BASE}/validar-respuesta`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, respuesta })
            });

            const json = await res.json();

            if (!res.ok) {
                alert(json.error);
                return;
            }

            // Si es correcta → permitir cambiar contraseña
            nuevaPassContainer.style.display = "block";

        } catch (error) {
            alert("Error de conexión.");
        }
    });

    // 3️⃣ Cambiar contraseña
    document.getElementById("btnCambiarPass").addEventListener("click", async () => {
        const email = document.getElementById("emailRec").value;
        const nueva = document.getElementById("newPass").value;

        if (nueva.length < 8 || !/[!@#$%^&*()_+\-.,?]/.test(nueva)) {
            alert("Contraseña inválida. Debe tener 8 caracteres y un símbolo.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/cambiar-pass`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, nueva })
            });

            const json = await res.json();

            if (!res.ok) {
                alert(json.error);
                return;
            }

            alert("Contraseña actualizada correctamente.");
            window.location.href = "login.html";

        } catch (error) {
            alert("Error de conexión.");
        }
    });

});
