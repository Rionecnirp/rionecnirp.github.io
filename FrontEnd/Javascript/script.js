/* Point de détail : Pour que les fonctions dans modale.js fonctionnent, allWorks doit être rendues
disponibles pour tous les fichiers js.
*/
const gallery = document.querySelector(".gallery")
const filtersContainer = document.querySelector(".filtres")
window.allWorks = []

/* 
Récupération des travaux depuis l'API :
1) On appelle l'API. Si cela ne fonctionne pas, on prévient.
2) On récupère la réponse et on la place dans un tableau.
3) On montre les images et on génère les filtres par rapport aux catégories présentes dans le tableau.
*/
async function getWorks() {
    try { 
        const response = await fetch ("http://localhost:5678/api/works")   
        if (!response.ok) {
          throw new Error (`HTTP error! status: ${response.status}`)
        } 
        const works = await response.json()
        allWorks = works
        displayWorks (works)
        generateFilters(works)
    } catch (error) {
        console.error("Error Loading works.", error)    
  }
}

/* Présentations des images dans la gallerie :
1) Par sécurité, on vide le div, puis pour chaque projet :
2) On crée les éléments nécessaires (figure, img, légende) et on les place dans le bon ordre.
*/
function displayWorks(works) {
  gallery.innerHTML = ""
  works.forEach(({ imageUrl, title }) => {
    const figure = document.createElement("figure")
    figure.innerHTML = `
      <img src="${imageUrl}" alt="${title}">
      <figcaption>${title}</figcaption>
    `
    gallery.appendChild(figure)
  })
}

/* Création des filtres dépendant des catégories existantes :
1) Par sécurité, on vide le div, puis :
2) On crée un élément Map pour stocker les catégories.
3) On crée la première (vu qu'elle n'existe pas dans les catégories déjà présentes) qui englobe tout les travaux.
4) Puis, on regarde chaque projet, si la catégorie du projet n'existe pas, on la crée.
*/
function generateFilters(works) {
  filtersContainer.innerHTML =""
  const categoriesMap = new Map()
  categoriesMap.set(0, "Tous")
  works.forEach(work => {
    if(!categoriesMap.has(work.category.id)) {
      categoriesMap.set(work.category.id, work.category.name)
    }
  })

/* Création des boutons :
1) On crée un bouton par id de catégorie.
2) On lui place la class "button".
3) Puis on lui place un événement au clic pour retirer et mettre la classe selected sur le bon bouton.
4) Au clic on lance aussi la fonction de filtre.
5) Enfin, on sélectionne le premier bouton par défaut.
*/
categoriesMap.forEach((name, id) => {
    const button = document.createElement("button")
    button.classList.add("filter-btn")
    button.textContent = name
    filtersContainer.appendChild(button)

    button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("selected"))
    button.classList.add("selected")
    filterWorks(id)
    })

    
  })

  const firstButton = filtersContainer.querySelector(".filter-btn")
  if (firstButton) firstButton.classList.add("selected")
}

/* Filtre des projets par catégorie :
1) Si l'id c'est 0, on montre tout.
2) Sinon, on présente les projets uniquement lié à l'id de la catégorie
*/
function filterWorks(categoryId) {
  if (categoryId === 0) {
    displayWorks(allWorks)
  } else {
    const filtered = allWorks.filter(work => work.category.id === categoryId)
    displayWorks(filtered)
  }
}

getWorks() 

/* --- Gestion de ce qui apparait/disparait quand on se connecte/déconnecte --- */

const token = sessionStorage.getItem("token")
const login = document.querySelector("#login")
const logout = document.querySelector("#logout")
const filtres = document.querySelector(".filtres")
const modeEdition = document.querySelector(".edit-mode-barre")

login.style.display = token ? "none" : ""
logout.style.display = token ? "" : "none"
filtres.style.display = token ? "none" : ""
modeEdition.style.display = token ? "" : "none"
openModal.style.display = token ? "" : "none"

logout.addEventListener("click", () => {
    sessionStorage.removeItem("token")
    location.reload()
})

