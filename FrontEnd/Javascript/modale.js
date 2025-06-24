const openModal = document.querySelector("#openModal")
const closeModal = document.querySelector(".closeModal")
const modal = document.querySelector(".modal")


closeModal.addEventListener("click", () => {
    modal.classList.remove("open")
})

openModal.addEventListener("click", () => {
    modal.classList.add("open")
})
