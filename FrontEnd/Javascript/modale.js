const openModal = document.getElementById("openModal")
const closeModal = document.getElementById("closeModal")
const modal = document.getElementById("modal")

closeModal.addEventListener("click", () => {
    modal.classList.remove("open")
})