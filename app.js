// Array to store favourite meals
let favourites = [];

// Get search input and button elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Get search results ul element
const searchResults = document.getElementById('searchResults');

// Function to search for meals and update the display
async function searchMeals() {
  // Get search query and clear input field
  const query = searchInput.value.trim().toLowerCase();
  searchInput.value = '';

  // Make API call to search for meals
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  const data = await response.json();

  // If no results, show message
  if (!data.meals || data.meals.length === 0) {
    searchResults.innerHTML = '<p>No results found.</p>';
    return;
  }

  // Clear current search results
  searchResults.innerHTML = '';

  // Loop through each meal result and add to the display
  data.meals.forEach(meal => {
    const mealItem = document.createElement('li');
    mealItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    mealItem.innerHTML = `
      <span>${meal.strMeal}</span>
      <button class="btn btn-primary" data-mealid="${meal.idMeal}" data-toggle="modal" data-target="#mealModal">Details</button>
      <button class="btn btn-secondary" data-mealid="${meal.idMeal}" onclick="addToFavourites(${meal.idMeal})">Add to Favourites</button>
    `;
    searchResults.appendChild(mealItem);
  });
}

// Function to add meal to favourites array and display success message
function addToFavourites(mealId) {
  const meal = favourites.find(m => m.idMeal === mealId);
  if (!meal) {
    const newMeal = data.meals.find(m => m.idMeal === mealId);
    favourites.push(newMeal);
    localStorage.setItem('favourites', JSON.stringify(favourites));
    alert(`${newMeal.strMeal} has been added to your favourites.`);
  } else {
    alert(`${meal.strMeal} is already in your favourites.`);
  }
}

// Function to display favourite meals
function showFavourites() {
  // Get favourites from local storage
  favourites = JSON.parse(localStorage.getItem('favourites')) || [];

  // If no favourites, show message
  if (favourites.length === 0) {
    searchResults.innerHTML = '<p>No favourites added yet.</p>';
    return;
  }

  // Clear current search results
  searchResults.innerHTML = '';

  // Loop through each favourite meal and add to the display
  favourites.forEach(meal => {
    const mealItem = document.createElement('li');
    mealItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    mealItem.innerHTML = `
      <span>${meal.strMeal}</span>
      <button class="btn btn-primary" data-mealid="${meal.idMeal}" data-toggle="modal" data-target="#mealModal">Details</button>
    `;
    searchResults.appendChild(mealItem);
  });
}

// Event listener for search button
searchBtn.addEventListener('click', searchMeals);

// Event listener for enter key press in search input
searchInput.addEventListener('keyup', e => {
  if (e.keyCode === 13) {
    searchMeals();
  }
});

// Modal event listener to display meal details
$('#mealModal').on('show.bs.modal', async function (event) {
  const button = $(event.relatedTarget);
 
  const mealId = button.data('mealid');
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  const data = await response.json();
  const meal = data.meals[0];

  const modal = $(this);
  modal.find('.modal-title').text(meal.strMeal);
  modal.find('.modal-body').html(`
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="img-fluid mb-2">
    <h5>Ingredients:</h5>
    <ul>
      ${getIngredients(meal).map(ingredient => `<li>${ingredient}</li>`).join('')}
    </ul>
    <h5>Instructions:</h5>
    <p>${meal.strInstructions}</p>
  `);
});

// Function to get ingredients array from meal object
function getIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }
  return ingredients;
}
