const connexion = document.querySelector(".formulaireLogin")
const boutonConnexion = document.querySelector("#boutonConnexion")

/* Connexion avec les identifiants donnés :
1) On crée les variables nécessaires (email, mdp) et on prépare au cas où la ligne qui spécifie un login incorrect.
2) On envoie au serveur les informations contenues dans le formulaire.
3) Elles ne sont pas bonnes, on le dit à l'utilisateur. Sinon on stocke les infos dans un fichier json et on fait un token.
4) Le token servira comme badge pour identifier l'utilisateur et servira sur la page index.html
*/

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

/* On place un eventListener sur le bouton de connexion pour lancer la fonction
*/

connexion.addEventListener( "submit", function(event) {
    event.preventDefault()
    login();
})

/* ----- Fin du code, il n'y a plus rien à voir ----- */