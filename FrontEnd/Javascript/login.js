const connexion = document.querySelector(".login-form")
const boutonConnexion = document.querySelector("#boutonConnexion")

async function login() {
    const email = document.querySelector("#email").value
    const password = document.querySelector("#mdp").value
    const loginIncorrect = document.querySelector(".login-incorrect")

    try {
        const response = await fetch ("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Accept" : "application/json",
                "Content-type" : "application/json"
            },
            body: JSON.stringify({
                email,
                password
            }),
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error ("Identifiants invalides")
        }

        if (data.token) {
            localStorage.setItem("token", data.token)
            window.location.href = "index.html"
        } else {
            throw new Error("Token manquant dans la réponse du serveur.");
        }
    } catch (error) {
        localStorage.removeItem("token");
        if (loginIncorrect) {
            loginIncorrect.innerHTML = error.message;
        }
        console.error("Erreur lors de la connexion :", error);
    }
}

connexion.addEventListener( "submit", function(event) {
    event.preventDefault()
    login();
})

boutonConnexion.style.cursor = "pointer"
