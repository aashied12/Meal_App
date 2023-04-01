// Get elements from the DOM
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const mealsContainer = document.querySelector('#meals');
const resultHeading = document.querySelector('#result-heading');
const singleMealContainer = document.querySelector('#single-meal');
const favouriteMealsContainer = document.querySelector('#favourite-meals');

// Event listener for search form submit
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Clear previous search results
  mealsContainer.innerHTML = '';

  // Get search query
  const query = searchInput.value.trim();

  // Check if query is not empty
  if (query !== '') {
    // Fetch meals from API
    const meals = await getMealsBySearch(query);

    // Display meals
    displayMeals(meals);
  }
});

// Event listener for meal container click
mealsContainer.addEventListener('click', async (event) => {
  console.log(event.path);
  const mealInfo = event.path.find((item) => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    const meal = await getMealByID(mealID);
    displayMealDetail(meal);
  }
});

// Event listener for favourite button click
mealsContainer.addEventListener('click', async (event) => {
  if (event.target.classList.contains('btn-favourite')) {
    const mealElement = event.target.closest('.meal');
    const mealID = mealElement.getAttribute('data-mealid');

    // Add meal to favourites
    addMealToFavourites(mealID);

    // Update the UI
    updateFavouritesUI();
  }
});

// Get meals by search query
async function getMealsBySearch(query) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  const data = await response.json();
  return data.meals;
}

// Get meal by ID
async function getMealByID(id) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await response.json();
  return data.meals[0];
}

// Display meals
function displayMeals(meals) {
  if (meals === null) {
    resultHeading.innerHTML = `<p>There are no search results. Please try again!</p>`;
  } else {
    resultHeading.innerHTML = `<h2>Search results for '${searchInput.value}':</h2>`;
    meals.forEach((meal) => {
      const mealElement = `
        <div class="meal" data-mealid="${meal.idMeal}">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          <div class="meal-info">
            <h3>${meal.strMeal}</h3>
            <button class="btn-favourite"><i class="far fa-heart"></i></button>
          </div>
        </div>
      `;
      mealsContainer.insertAdjacentHTML('beforeend', mealElement);
    });
  }
}

// Display meal detail
function displayMealDetail(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => response.json())
    .then(data => {
      const meal = data.meals[0];
      const mealDetailContainer = document.getElementById("meal-detail-container");

      // Create HTML elements for the meal detail
      const mealDetail = document.createElement("div");
      mealDetail.classList.add("meal-detail");
      mealDetail.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p>${meal.strInstructions}</p>
        <button class="btn-favourite" data-mealid="${meal.idMeal}">Add to favourites</button>
      `;

      // Add the meal detail to the container
      mealDetailContainer.innerHTML = "";
      mealDetailContainer.appendChild(mealDetail);
    })
    .catch(error => {
      console.error(`Error fetching meal detail: ${error}`);
    });
}

