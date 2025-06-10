

const email = document.querySelector("#email").value
const mdp = document.querySelector("#mdp").value
const connexion =document.querySelector(".login-form")

connexion.addEventListener("submit", async (event) => {
    event.preventDefault()

    try {
        const envoiIdentifiant = await fetch ("http://localhost:5678/users/login", {
            method: "POST",
            headers: {
                "content-type" : "application/json"
            },
            body: JSON.stringify({
                email,
                mdp
            })
        })
        console.log(envoiIdentifiant)

        const retourIdentifiant = await envoiIdentifiant.json()

        if (retourIdentifiant.ok) {
            // Connexion réussie
            sessionStorage.setItem("token", result.token); 
            window.location.href = "index.html"; 
        } else {
            alert("Email ou mot de passe incorrect.");
        }
    
    } catch {
    console.error("Erreur lors de la connexion :", error)
    alert("Une erreur est survenue. Veuillez réessayer.")
    }
})


