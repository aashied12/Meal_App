// Get elements from the DOM
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const mealsContainer = document.querySelector('#meals');
const resultHeading = document.querySelector('#result-heading');
const singleMealContainer = document.querySelector('#single-meal');

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
        <div class="meal">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          <div class="meal-info" data-mealid="${meal.idMeal}">
            <h3>${meal.strMeal}</h3>
          </div>
        </div>
      `;
      mealsContainer.insertAdjacentHTML('beforeend', mealElement);
    });
  }
}

// Display meal detail
function displayMealDetail(meal) {
  // Create an array of ingredients and their measures
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }

 // Create HTML for meal detail
function createMealDetailHTML(meal) {
const mealDetail = document.createElement('div');
mealDetail.classList.add('meal-detail');

// Create HTML for meal name and image
const nameAndImage = document.createElement('div');
nameAndImage.classList.add('name-and-image');
nameAndImage.innerHTML = <img src="${meal.strMealThumb}" alt="${meal.strMeal}"> <h2>${meal.strMeal}</h2> ;
mealDetail.appendChild(nameAndImage);

// Create HTML for meal information
const information = document.createElement('div');
information.classList.add('information');
information.innerHTML = <h3>Instructions</h3> <p>${meal.strInstructions}</p> <h3>Ingredients</h3> ;
mealDetail.appendChild(information);
  
  
// Create HTML for meal ingredients
const ingredients = document.createElement('ul');
ingredients.classList.add('ingredients');
for (let i = 1; i <= 20; i++) {
if (meal[strIngredient${i}]) {
const ingredient = document.createElement('li');
ingredient.textContent = ${meal[strIngredient${i}]} - ${meal[strMeasure${i}]};
ingredients.appendChild(ingredient);
} else {
break;
}
}
information.appendChild(ingredients);

return mealDetail;
}

// Add event listener for meal click
mealsContainer.addEventListener('click', async (event) => {
if (event.target.classList.contains('meal')) {
const mealId = event.target.dataset.id;
const meal = await getMealById(mealId);
const mealDetailHTML = createMealDetailHTML(meal);
mealsContainer.innerHTML = '';
mealsContainer.appendChild(mealDetailHTML);
}
});

// Event listener for search input
searchInput.addEventListener('input', async (event) => {
const query = event.target.value.trim();
if (query.length > 0) {
const meals = await searchMeals(query);
renderMeals(meals);
} else {
mealsContainer.innerHTML = '';
}
});

// Initialize page with popular meals
(async function () {
const popularMeals = await getPopularMeals();
renderMeals(popularMeals);
})();
