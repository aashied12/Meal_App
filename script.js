document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const mealResults = document.getElementById('mealResults');
  const favoritesButton = document.getElementById('favoritesButton');
  
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
      const meals = await searchMeals(searchTerm);
      displayMeals(meals);
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
    heartButton.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'mx-2');
    heartButton.innerHTML = '<i class="bi bi-heart"></i>';
    heartButton.dataset.mealId = meal.idMeal;
    titleContainer.appendChild(heartButton);

    const description = document.createElement('p');
    description.classList.add('card-text');
    description.textContent = meal.strInstructions.substring(0, 150) + '...';
    cardBody.appendChild(description);

    return card;
  }

  function handleAddToFavorites(event) {
    if (event.target.tagName === 'BUTTON') {
      const mealId = event.target.dataset.mealId;
      const mealCard = event.target.closest('.card');
      const mealTitle = mealCard.querySelector('.card-title').textContent;
      addFavorite(mealId, mealTitle);
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

  // Function to retrieve the favorites from local storage
  function getFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites;
  }

  // Function to display the favorites on the favorites page
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

  // Function to create a favorite item element
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

