// sélection élément HTML qui va contenir tous les projets
const gallery = document.querySelector(".gallery");
// sélection conteneur Filtres ( Boutons)
const filtersContainer = document.querySelector(".filtres");
// Variable stockant les projets récupérés depuis l'API
let allWorks = [];

// Récupération des travaux depuis API
async function getWorks() {
    try {
        // Appel API    
        const response = await fetch ("http://localhost:5678/api/works");
        // Vérification réponse valide, sinon affichage message d'erreur   
        if (!response.ok) throw new Error (`HTTP error! status: ${response.status}`);
        // Transforme la réponse JSON en tableau
        const works = await response.json();
        // Stockage projets dans variable globale
        allWorks = works;
        // Affichage des Projets
        displayWorks (works);
        // génération des filtres à partir des catégéories présentes 
        generateFilters(works);
    } catch (error) {
        // En cas d'erreur affichage message d'erreur
        console.error("Error Loading works.", error)    
  }
}

// Fonction pour affichage des projets dans la galerie
function displayWorks(works) {
  // Vide d'abord la galerie pour éviter les doublons
  gallery.innerHTML = "";
  // Pour chaque projet (work), création d'un bloc <figure>
  works.forEach(work => {
    const figure = document.createElement("figure");
    // Création image du projet
    const img = document.createElement("img");
    // URL de l’image
    img.src = work.imageUrl; 
    // Génération "alt"
    img.alt = work.title;    
    // Création de la légende 
    const caption = document.createElement("figcaption");
    caption.textContent = work.title;
    // Ajout <img> et <caption>
    figure.appendChild(img);
    figure.appendChild(caption);
    // Ajout <figure> complet
    gallery.appendChild(figure);
  });
}

// Génération filtres dynamique
function generateFilters(works) {
  // Vide HTML pour éviter les doublons
  filtersContainer.innerHTML ="";
  // Création Map pour stockage catégories 
  const categoriesMap = new Map();
  // Ajout manuel catégorie "Tous" avec ID 0
  categoriesMap.set(0, "Tous");
  // Parcours tous les projets 
  works.forEach(work => {
    // Si la catégorie n'est pas enregistrée dans Map, ajout    
    if(!categoriesMap.has(work.category.id)) {
      categoriesMap.set(work.category.id, work.category.name);
    }
  });


// Créer un bouton pour chaque catégorie
categoriesMap.forEach((name, id) => {
    const button = document.createElement("button");
    // Ajout class
    button.classList.add("filter-btn");
    // Nom de la catégorie part bouton
    button.textContent = name;

    button.addEventListener("click", () => {
    // Retire la classe "selected" de tous les boutons
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("selected"));
    // "selected" uniquement sur le bouton cliqué
    button.classList.add("selected");
    // Filtre les projets selon l’ID de la catégorie
    filterWorks(id);
    });

    // Ajoute le bouton au conteneur
    filtersContainer.appendChild(button);
  });

  // Par défaut sélectionne le premier bouton ("Tous")
  const firstButton = filtersContainer.querySelector(".filter-btn");
  if (firstButton) firstButton.classList.add("selected");
}

// Filtrer les projets selon une catégorie
function filterWorks(categoryId) {
  // Si clique sur "Tous", affiche tous les projets
  if (categoryId === 0) {
    displayWorks(allWorks);
  } else {
  // Sinon, filtre les projets par catégorie
    const filtered = allWorks.filter(work => work.category.id === categoryId);
    displayWorks(filtered);
  }
}

getWorks(); 

