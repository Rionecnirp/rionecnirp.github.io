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

