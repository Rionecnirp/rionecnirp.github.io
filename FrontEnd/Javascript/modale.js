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
}

function fermerModal() {
    modal.classList.remove("open")
}

function retourArriereModal() {
    modalWork.style.display = "none"
    modalGallery.style.display = ""
}

function changementModal() {
    modalWork.style.display = ""
    modalGallery.style.display = "none"
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