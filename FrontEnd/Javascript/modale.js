/* ----- Gestion Déplacement Modales ----- */

const modal = document.querySelector(".modal")
const openModal = document.querySelector("#openModal")
const closeModalGallery = document.querySelector("#closeModalGallery")
const closeModalWork = document.querySelector("#closeModalWork")
const modalGallery = document.querySelector(".modalGallery")
const modalWork = document.querySelector(".modalWork")
const returnModal = document.querySelector(".returnModal")
const ajoutPhoto = document.querySelector("#AjoutPhoto")

/* Je place le display "none" ici et pas dans une classe par simplicité.
*/
modalWork.style.display = "none"

/* Je vais regrouper les 4 fonctions ci dessous en un commentaire :
1) ouvrirModal ajoute la class "open" à la modale pour l'activer et lance la fonction
displayWorksModal pour initialiser la gallerie dans la modale.
2) fermerModal retire la classe "open" à la modale pour la désactiver. En plus de cela
on lance la fonction retourArriereModal et resetPhoto au cas où pour revenir à la situation de départ
3) changementModal permet d'aller à la seconde modale, en la rendant visible et en dissimulant
la première modale. C'est à ce moment qu'on lance categorieModules pour créer les catégories du formulaire d'envoi d'images.
4) retourArriereModal fait la même chose que changementModal, mais en inversé.
Au lieu de lancer categorieModules, on lance resetPhoto à la place.
*/

function ouvrirModal() {
    modal.classList.add("open")
    displayWorksModal(window.allWorks)
}

function fermerModal() {
    modal.classList.remove("open")
    retourArriereModal()
    resetPhoto()
}

function changementModal() {
    modalWork.style.display = ""
    modalGallery.style.display = "none"
    categorieModules()
}

function retourArriereModal() {
    modalWork.style.display = "none"
    modalGallery.style.display = ""
    resetPhoto()
}

/* Les EventListener suivants servent à :
1) Ouvrir la modale quand on clique sur "modifier".
2) Fermer la modale quand on clique sur la croix (que ce soit dans la 1ère ou seconde modale).
3) Fermer la modale quand on clique en dehors de la modale.
4) Passer à la seconde modale quand on clique sur le bouton d'ajout de photo.
5) Revenir à la première modale en cliquant sur la flèche.
*/

openModal.addEventListener("click", ouvrirModal)
closeModalGallery.addEventListener("click", fermerModal)
closeModalWork.addEventListener("click", fermerModal)
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        fermerModal()
    }
})
ajoutPhoto.addEventListener("click", changementModal)
returnModal.addEventListener("click", retourArriereModal)



/* ----- Modale 1 : Gestion de la gallerie ----- */

/* Cette fonction est similaire à displayWorks qui se trouve dans script.js
1) On vide le div par sécurité, puis pour chaque projet :
2) On crée les éléments nécessaires (figure, img) et on les place dans le bon ordre.
A cela on rajoute un bouton de suppression, où on place un EventListener dessus :
3) Quand on clique sur le bouton, on envoie une demande de suppression pour la figure spécifique (grâce à l'id)
4) Si ça marche, on modifie le tableau de tous les projets
pour qu'il n'y ait plus la figure supprimée, on ferme la modale et on réaffiche les projets.
*/

function displayWorksModal(works) {
    const galleryContent = document.querySelector(".galleryContent")
    galleryContent.innerHTML = ""
    works.forEach(({ id, imageUrl, title }) => {
        const figure = document.createElement("figure")
        figure.innerHTML = `
            <img src="${imageUrl}" alt="${title}">
            <button class="deleteButton"><i class="fa-solid fa-trash-can"></i></button>
        `
        galleryContent.appendChild(figure)

        const deleteButton = figure.querySelector(".deleteButton")
        deleteButton.addEventListener("click", async () => {
            try {
                const token = sessionStorage.getItem("token")
                const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (response.ok) {
                    window.allWorks = window.allWorks.filter(work => work.id !== id)
                    figure.remove()
                    fermerModal()
                    displayWorks(allWorks)
                    displayWorksModal(allWorks)
                } else {
                    console.error("Erreur lors de la suppression", response.status)
                }
            } catch (error) {
                console.error("Erreur lors de la requête DELETE :", error)
            }
        })
    })
}



/* ----- Modale 2 : Gestion du formulaire d'envoi d'images ----- */

const titreInput = document.querySelector("#title")
const menuCategoriesIdInput = document.querySelector("#category")
const nouvelleImageInput = document.querySelector("#file")
const boutonEnvoiPhoto = document.querySelector(".boutonEnvoyer")
const formulaireEnvoiPhoto = document.querySelector(".formAddWork")
const imagePreview = document.querySelector(".preview")
const modalAddPhoto = document.querySelector(".modalAddPhoto")

/* Création des catégories pour la modale d'ajout de photo :
1) on récupère les catégories dans un json.
2) on récupère le sélecteur dans le formulaire d'envoi d'image.
3) On crée une catégorie "vide" comme option de départ, puis on crée une option par catégorie existante .
*/

async function categorieModules() {
    try {
        const recupCategories = await fetch("http://localhost:5678/api/categories")
        const categories = await recupCategories.json()
        const menuCategories = document.querySelector("#category")
        menuCategories.innerHTML = ""

        const emptyOption = document.createElement("option")
        emptyOption.value = ""
        emptyOption.textContent = ""
        emptyOption.selected = true
        emptyOption.disabled = true
        menuCategories.appendChild(emptyOption)

        categories.forEach((cat) => {
            const option = document.createElement("option")
            option.value = cat.id
            option.textContent = cat.name
            menuCategories.appendChild(option)
        })
    } catch (error) {
        console.error ("Erreur chargement des catégories :", error)
    }
}

/* Cette fonction sert à nettoyer le formulaire d'envoi d'images.
1) On vide le titre, la catégorie et on retire le lien de l'image récupérée.
2) On affiche de nouveau tous les éléments dans la boite de choix d'images.
3) On retire la prévisualisation d'images.
*/

function resetPhoto() {
    titreInput.value = ""
    menuCategoriesIdInput.value = ""
    nouvelleImageInput.value = ""
    Array.from(modalAddPhoto.children).forEach(child => {
            if (!child.classList.contains("preview")) {
                child.style.display = ""
            }
        })
    imagePreview.style.display = "none"
}

/* Cet EventListener permet de montrer la prévisualisation de l'image choisie :
1) Au cas où on ne choisit pas une image, rien ne se passe.
2) Sinon, on affiche l'image.
3) Pour ne pas avoir de conflit avec les autres éléments, on choisit tous ceux qui n'ont pas
la classe "preview" et on arrête de les afficher.
*/

nouvelleImageInput.addEventListener("change", () => {
    const nouvelleImage = nouvelleImageInput.files && nouvelleImageInput.files[0]

    if (!nouvelleImage) return

    const reader = new FileReader()
    reader.onload = function (e) {
        imagePreview.src = e.target.result
        imagePreview.style.display = "block"
        Array.from(modalAddPhoto.children).forEach(child => {
            if (!child.classList.contains("preview")) {
                child.style.display = "none"
            }
        })
    }
    reader.readAsDataURL(nouvelleImage)
})

/* Cette fonction sert à débloquer le bouton d'envoi d'image :
1) si titre, menuCategoriesId et nouvelleImage possèdent une valeur, alors
2) On retire l'id qui bloque l'accès au bouton.
3) Dans l'éventualité où un des 3 champs redeviendrait vide, alors cela rebloque le bouton.
*/

function validationChamps() {
    const titre = titreInput.value !== ""
    const menuCategoriesId = menuCategoriesIdInput.value !== ""
    const nouvelleImage = nouvelleImageInput.files.length > 0
    if (titre && menuCategoriesId && nouvelleImage){
        boutonEnvoiPhoto.id = ""
    } else {
        boutonEnvoiPhoto.id = "attenteValidation"
    }
} 

nouvelleImageInput.addEventListener("change", validationChamps)
titreInput.addEventListener("input", validationChamps)
menuCategoriesIdInput.addEventListener("change", validationChamps)

/* Cette fonction sert à envoyer des images au serveur :
1) On récupère les valeurs du titre, de la catégorie et le fichier en lui même.
Dans le cas où on arriverait à envoyer un fichier avec des infos manquantes, on prévient d'une erreur.
2) On crée une variable à laquelle on place les informations de l'image.
3) Puis on l'envoie au serveur sous la forme d'un fichier json.
4) Si ça marche, on ajoute la nouvelle image dans le tableau de projets.
5) Puis on raffraichit les galleries pour montrer la nouvelle image.
*/
async function envoiPhoto() {
    const titre = titreInput.value
    const menuCategoriesId = menuCategoriesIdInput.value
    const nouvelleImage = nouvelleImageInput.files[0]
    const token = sessionStorage.getItem("token")

    if (!titre || !menuCategoriesId || !nouvelleImage) {
        alert("Veuillez remplir tous les champs et sélectionner une image.")
        return
    }

    const formData = new FormData()
    formData.append("title", titre)
    formData.append("category", menuCategoriesId)
    formData.append("image", nouvelleImage)

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method : "POST",
            headers : {
                Authorization : `Bearer ${token}`,
            },
            body : formData,
        })

        if (response.ok) {
            const newWork = await response.json()
            window.allWorks.push(newWork)
            displayWorks(allWorks)
            displayWorksModal(allWorks)
        } else {
            alert(`Erreur lors de l'envoi. Code ${response.status}`)
        }
    } catch (error) {
        alert("Erreur réseau : " + error.message)
    }

}

/* Après avoir cliqué sur le bouton "submit" :
1) On empêche la page de se recharger automatiquement.
2) On lance la fonction d'envoi d'images.
3) On lance la fonction de fermeture de modale.
*/

formulaireEnvoiPhoto.addEventListener("submit", function(event)  {
    event.preventDefault()
    envoiPhoto()
    fermerModal()
})

/* ----- Fin du code, il n'y a plus rien à voir ----- */