const connexion = document.querySelector(".formulaireLogin")
const boutonConnexion = document.querySelector("#boutonConnexion")

async function login() {
    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value
    const loginIncorrect = document.querySelector(".loginIncorrect")

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
            throw new Error ("Adresse e-mail ou mot de passe non valide.")
        }

        if (data.token) {
            sessionStorage.setItem("token", data.token)
            window.location.href = "index.html"
        } else {
            throw new Error("Token manquant dans la réponse du serveur.");
        }
    } catch (error) {
        sessionStorage.removeItem("token");
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
