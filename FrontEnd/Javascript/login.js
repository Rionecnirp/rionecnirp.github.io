

const email = document.querySelector("#email").value
const mdp = document.querySelector("#mdp").value
const connexion =document.querySelector(".login-form")

console.log(connexion)

connexion.addEventListener("submit", (event) => {
    event.preventDefault()

    try {
        const envoiIdentifiant = fetch ("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify({
                email,
                mdp
            }),
        })
        

        const retourIdentifiant = envoiIdentifiant.json()

        if (retourIdentifiant.ok) {
            sessionStorage.setItem("token", retourIdentifiant.token); 
            window.location.href = "../HTML/index.html"; 
        } else {
            alert("Email ou mot de passe incorrect.");
        }
    
    } catch (error) {
    console.error("Erreur lors de la connexion :", error)
    alert("Une erreur est survenue. Veuillez réessayer.")
    }
    console.log("coucou")
})


