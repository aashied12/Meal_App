document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const mealResults = document.getElementById('mealResults');
  const favoritesButton = document.getElementById('favoritesButton');
  let searchResults = [];

  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  });

  mealResults.addEventListener('click', handleAddToFavorites);
  favoritesButton.addEventListener('click', redirectToFavorites);

  function redirectToFavorites() {
    window.location.href = 'favorites.html';
  }

  async function handleSearch() {
    const searchTerm = searchInput.value;
    if (searchTerm.trim() !== '') {
      searchResults = await searchMeals(searchTerm); // Store the search results
      displayMeals(searchResults);
    } else {
      mealResults.innerHTML = '';
    }
  }

  async function searchMeals(searchTerm) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
    const data = await response.json();
    return data.meals;
  }

  function displayMeals(meals) {
    mealResults.innerHTML = '';
    if (!meals) {
      mealResults.innerHTML = '<p>No meals found.</p>';
      return;
    }
    meals.forEach(meal => {
      const mealCard = createMealCard(meal);
      mealResults.appendChild(mealCard);
    });
  }

  function createMealCard(meal) {
  const card = document.createElement('div');
  card.classList.add('card', 'mb-3');

  const image = document.createElement('img');
  image.src = meal.strMealThumb;
  image.classList.add('card-img-top');
  card.appendChild(image);

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  card.appendChild(cardBody);

  const titleContainer = document.createElement('div');
  titleContainer.classList.add('d-flex', 'justify-content-between', 'align-items-center');
  cardBody.appendChild(titleContainer);

  const title = document.createElement('h5');
  title.classList.add('card-title');
  title.textContent = meal.strMeal;
  titleContainer.appendChild(title);

  const heartButton = document.createElement('button');
  heartButton.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'mx-2', 'btn-lg');
  heartButton.textContent = 'Add to Favorites';
  heartButton.dataset.mealId = meal.idMeal;
  titleContainer.appendChild(heartButton);

  const mealDetailsButton = document.createElement('button');
  mealDetailsButton.classList.add('btn', 'btn-primary', 'btn-sm', 'mx-2', 'btn-lg');
  mealDetailsButton.textContent = 'Meal-details';
  mealDetailsButton.dataset.mealId = meal.idMeal;
  titleContainer.appendChild(mealDetailsButton);

  // Create the link to the meal detail page
  mealDetailsButton.addEventListener('click', redirectToMealDetail);

  // Check if the meal is already in the favorites list
  const favorites = getFavorites();
  const existingMeal = favorites.find((favorite) => favorite.idMeal === meal.idMeal);
  if (existingMeal) {
    heartButton.textContent = 'Added to Favorites';
    heartButton.classList.remove('btn-outline-danger');
    heartButton.classList.add('btn-success');
  }

  function redirectToMealDetail() {
    window.location.href = `meal-detail.html?id=${meal.idMeal}`;
  }

  return card;
}


   
  function handleAddToFavorites(event) {
    if (event.target.classList.contains('btn-outline-danger')) {
      const mealId = event.target.dataset.mealId;
      const mealCard = event.target.closest('.card');
      const mealTitle = mealCard.querySelector('.card-title').textContent;

      // Check if the meal is already in the favorites list
      const existingMeal = getFavorites().find((meal) => meal.idMeal === mealId);
      if (!existingMeal) {
        addFavorite(mealId, mealTitle);
        event.target.textContent = 'Added to Favorites';
        event.target.classList.remove('btn-outline-danger');
        event.target.classList.add('btn-success');
      }
    }
  }

  function addFavorite(mealId, mealTitle) {
    // Retrieve the favorites from local storage and parse the JSON string
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Check if the meal is already in the favorites list
    const existingMeal = favorites.find((meal) => meal.idMeal === mealId);
    if (!existingMeal) {
      // Retrieve the meal details from the search results
      const meal = searchResults.find((result) => result.idMeal === mealId);

      // Add the meal to the favorites list
      favorites.push(meal);

      // Update the favorites in local storage
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }

  function getFavorites() {
    // Retrieve the favorites from local storage and parse the JSON string
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites;
  }

  function displayFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    const favorites = getFavorites();

    if (favorites.length === 0) {
      favoritesList.innerHTML = '<p>No favorite meals found.</p>';
      return;
    }

    favoritesList.innerHTML = '';
    favorites.forEach((meal) => {
      const favoriteItem = createFavoriteItem(meal);
      favoritesList.appendChild(favoriteItem);
    });
  }

  function createFavoriteItem(meal) {
    const item = document.createElement('div');
    item.classList.add('favorite-item');

    const image = document.createElement('img');
    image.src = meal.strMealThumb;
    image.alt = meal.strMeal;
    item.appendChild(image);

    const title = document.createElement('h5');
    title.textContent = meal.strMeal;
    item.appendChild(title);

    return item;
  }

  // Update the favorites page on load
  displayFavorites();
});
