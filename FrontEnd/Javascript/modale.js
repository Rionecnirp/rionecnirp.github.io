const openModal = document.querySelector("#openModal")
const closeModalGallery = document.querySelector("#closeModalGallery")
const closeModalWork = document.querySelector("#closeModalWork")
const modal = document.querySelector(".modal")
const modalGallery = document.querySelector(".modalGallery")
const modalWork = document.querySelector(".modalWork")
const returnModal = document.querySelector(".returnModal")
const ajoutPhoto = document.querySelector("#AjoutPhoto")

modalWork.style.display = "none"

function ouvrirModal() {
    modal.classList.add("open")
    displayWorksModal(window.allWorks)
}

function fermerModal() {
    modal.classList.remove("open")
    retourArriereModal()
    resetPhoto()
}

function retourArriereModal() {
    modalWork.style.display = "none"
    modalGallery.style.display = ""
    resetPhoto()
}

function changementModal() {
    modalWork.style.display = ""
    modalGallery.style.display = "none"
    CategorieModules()
}

closeModalGallery.addEventListener("click", () => {
    fermerModal()
})

closeModalWork.addEventListener("click", () => {
    fermerModal()
})

openModal.addEventListener("click", ouvrirModal)
returnModal.addEventListener("click", retourArriereModal)
ajoutPhoto.addEventListener("click", changementModal)

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        fermerModal()
    }
})



function displayWorksModal(works) {
    const galleryContent = document.querySelector(".galleryContent")
    galleryContent.innerHTML = ""

    works.forEach(({ imageUrl, title }) => {
    const figure = document.createElement("figure")
    figure.innerHTML = `
        <img src="${imageUrl}" alt="${title}">
        <button class="deleteButton"><i class="fa-solid fa-trash-can"></i></button>
    `
    galleryContent.appendChild(figure)
  })
}


/* Création des catégories pour la modale d'ajout de photo :
1) on récupère les catégories dans un json
2) on récupère le sélecteur dans le formulaire d'envoi d'image
3) On crée une option par catégorie existante
*/
async function CategorieModules() {
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

const titreInput = document.querySelector("#title")
const menuCategoriesIdInput = document.querySelector("#category")
const nouvelleImageInput = document.querySelector("#file")
const boutonEnvoiPhoto = document.querySelector(".boutonEnvoyer")
const formulaireEnvoiPhoto = document.querySelector(".formAddWork")

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

titreInput.addEventListener("input", validationChamps)
menuCategoriesIdInput.addEventListener("change", validationChamps)
nouvelleImageInput.addEventListener("change", validationChamps)

formulaireEnvoiPhoto.addEventListener("submit", function(event)  {
    event.preventDefault()
    envoiPhoto()
    fermerModal()
})

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

const imagePreview = document.querySelector(".preview")
const modalAddPhoto = document.querySelector(".modalAddPhoto")

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