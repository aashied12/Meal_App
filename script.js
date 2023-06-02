document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const mealResults = document.getElementById('mealResults');
  const favoritesList = document.getElementById('favoritesList');

  searchInput.addEventListener('input', handleSearchInput);
  mealResults.addEventListener('click', handleAddToFavorites);

  async function handleSearchInput(event) {
    const searchTerm = event.target.value;
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
    heartButton.classList.add('btn', 'btn-outline-danger', 'btn-sm');
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
      const favoriteItem = createFavoriteItem(mealId, mealTitle);
      favoritesList.appendChild(favoriteItem);
    }
  }

  function createFavoriteItem(mealId, mealTitle) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    listItem.innerHTML = `
      <span>${mealTitle}</span>
      <button class="btn btn-outline-danger btn-sm" data-meal-id="${mealId}">
        <i class="bi bi-trash"></i>
      </button>
    `;
    return listItem;
  }
});
