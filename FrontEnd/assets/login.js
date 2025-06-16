

const email = document.querySelector("#email").value
const mdp = document.querySelector("#mdp").value
const connexion =document.querySelector(".login-form")
const cors = require('cors')

app.use(cors());

app.get('/data', (req, res) => {
  res.json({ message: 'Cette réponse est CORS activé.' });
});

app.listen(5500, () => {
  console.log('Serveur en cours d\'exécution sur le port 5500');
});

connexion.addEventListener("submit", async (event) => {
    event.preventDefault()

    try {
        const envoiIdentifiant = await fetch ("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify({
                email,
                mdp
            }),
        })
        console.log(envoiIdentifiant)

        const retourIdentifiant = await envoiIdentifiant.json()

        if (retourIdentifiant.ok) {
            sessionStorage.setItem("token", result.token); 
            window.location.href = "../index.html"; 
        } else {
            alert("Email ou mot de passe incorrect.");
        }
    
    } catch {
    console.error("Erreur lors de la connexion :", error)
    alert("Une erreur est survenue. Veuillez réessayer.")
    }
})


