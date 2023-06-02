document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const mealResults = document.getElementById('mealResults');

  searchInput.addEventListener('input', handleSearchInput);

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

    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = meal.strMeal;
    cardBody.appendChild(title);

    const description = document.createElement('p');
    description.classList.add('card-text');
    description.textContent = meal.strInstructions.substring(0, 150) + '...';
    cardBody.appendChild(description);

    return card;
  }
});
