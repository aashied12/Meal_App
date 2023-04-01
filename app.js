// API endpoint URLs
const SEARCH_API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const DETAILS_API_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';

// Search input and meals container
const searchInput = document.querySelector('#searchInput');
const mealsContainer = document.querySelector('#meals');

// Favourites list and button
const favouritesList = document.querySelector('#favourites');
const favButton = document.querySelector('#favButton');

// Array to store favourite meals
let favourites = [];

// Function to render meals in the meals container
function renderMeals(meals) {
  mealsContainer.innerHTML = meals.map(meal => `
    <div class="col-md-4">
      <div class="card mb-4 shadow-sm">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
        <div class="card-body">
          <h5 class="card-title">${meal.strMeal}</h5>
          <p class="card-text">${meal.strInstructions.slice(0, 100)}...</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-outline-secondary details-button" data-mealid="${meal.idMeal}" data-toggle="modal" data-target="#mealModal">Details</button>
              <button type="button" class="btn btn-sm btn-outline-secondary favourite-button" data-mealid="${meal.idMeal}">Favourite</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Function to fetch meals from API
async function searchMeals(query) {
  const response = await fetch(SEARCH_API_URL + query);
  const data = await response.json();
  return data.meals;
}

// Function to fetch meal details from API
async function getMealDetails(mealId) {
  const response = await fetch(DETAILS_API_URL + mealId);
  const data = await response.json();
  return data.meals[0];
}

// Function to render meal details in the modal
function renderMealDetails(meal) {
  const modalTitle = document.querySelector('#mealModalLabel');
  const modalBody = document.querySelector('.modal-body');
  const favButton = document.querySelector('#favButton');
  modalTitle.textContent = meal.strMeal;
  modalBody.innerHTML = `
    <img src="${meal.strMealThumb}" class="img-fluid mb-3" alt="${meal.strMeal}">
    <h4>Ingredients:</h4>
    <ul class="list-group">
      ${Array(20).fill().map((_, i) => {
        if (meal[`strIngredient${i+1}`]) {
          return `<li class="list-group-item">${meal[`strIngredient${i+1}`]} - ${meal[`strMeasure${i+1}`]}</li>`;
        }
        return '';
      }).join('')}
    </ul>
    <h4>Instructions:</h4>
    <p>${meal.strInstructions}</p>
  `;
  // Check if meal is already in favourites list
  if (favourites.some(fav => fav.idMeal === meal.idMeal)) {
    favButton.disabled = true;
  } else {
    favButton.disabled = false;
  }
}

// Event listener for search input
searchInput.addEventListener('input', async (event) => {
  const query = event.target.value.trim();
   if (query.length >= 3) {
    const meals = await searchMeals(query);
    renderSearchResults(meals);
  } else {
    searchResults.innerHTML = '';
  }
});

    
    
// Function to handle favourite button click
function handleFavouriteClick(mealId) {
const meal = favourites.find(fav => fav.idMeal === mealId);
if (meal) {
favourites = favourites.filter(fav => fav.idMeal !== mealId);
} else {
favourites.push({ idMeal: mealId });
}
localStorage.setItem('favourites', JSON.stringify(favourites));
renderFavourites();
}

// Function to render favourites list
function renderFavourites() {
favouritesList.innerHTML = favourites.map(fav => <li class="list-group-item"> <a href="#" class="text-danger remove-favourite" data-mealid="${fav.idMeal}">&times;</a> ${fav.idMeal} </li> ).join('');
}

// Event listener for favourites button click
favButton.addEventListener('click', () => {
const favModal = new bootstrap.Modal(document.querySelector('#favouritesModal'));
favModal.show();
});

// Event listener for details button click
document.addEventListener('click', async (event) => {
if (event.target.classList.contains('details-button')) {
const mealId = event.target.dataset.mealid;
const meal = await getMealDetails(mealId);
renderMealDetails(meal);
}
});

// Event listener for favourite button click
document.addEventListener('click', (event) => {
if (event.target.classList.contains('favourite-button')) {
const mealId = event.target.dataset.mealid;
handleFavouriteClick(mealId);
event.target.disabled = true;
}
});

// Event listener for remove favourite click
document.addEventListener('click', (event) => {
if (event.target.classList.contains('remove-favourite')) {
const mealId = event.target.dataset.mealid;
favourites = favourites.filter(fav => fav.idMeal !== mealId);
localStorage.setItem('favourites', JSON.stringify(favourites));
renderFavourites();
}
});

// Load favourites from local storage
const storedFavourites = localStorage.getItem('favourites');
if (storedFavourites) {
favourites = JSON.parse(storedFavourites);
renderFavourites();
}
