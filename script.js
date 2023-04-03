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
const mealInfo = event.target.closest('.meal').querySelector('.meal-info');
if (mealInfo) {
const mealID = mealInfo.getAttribute('data-mealid');
  console.log("mealID",mealID);
const meal = await getMealByID(mealID);
  console.log("meal",meal);
displayMealDetail(mealID);
}
});
// Event listener for favourite button click
favouriteMealsContainer.addEventListener('click', async (event) => {
if (event.target.classList.contains('btn-favourite')) {
const mealElement = event.target.closest('.meal');
const mealID = mealElement.getAttribute('data-mealid');
addMealToFavourites(mealID);
// Update the UI
updateFavouritesUI();
}
});
// Get meals by search query
async function getMealsBySearch(query) {
  console.log(query);
const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
const data = await response.json();
return data.meals;
}
// Get meal by ID
async function getMealByID(id) {
  console.log("Inside getMealByID");
const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${id}`);
const data = await response.json();
return data.meals || [];
}
// Display meals
function displayMeals(meals) {
  // Check if any meals were found
  if (meals === null || meals.length === 0) {
    resultHeading.innerHTML = `<p>No meals found for search query.</p>`;
    return;
  }
  // Clear previous search results
  mealsContainer.innerHTML = '';
  // Display search results heading
  resultHeading.innerHTML = `<h2>Search results for '${searchInput.value}':</h2>`;
  // Display meals
  meals.forEach((meal) => {
    // Create HTML elements for the meal
    const mealElement = document.createElement('div');
    mealElement.classList.add('meal');
    mealElement.innerHTML = `
      <div class="meal-img">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      </div>
      <div class="meal-info" data-mealid="${meal.idMeal}">
        <h3>${meal.strMeal}</h3>
        <button class="btn-favourite" data-mealid="${meal.idMeal}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" width="18px" height="18px">
            <path d="M12 21.35L5.16 17.1C2.48 15.48 1 13.06 1 10.5 1 6.36 4.36 3 8.5 3c2.02 0 3.89.82 5.5 2.15C16.61 3.82 18.48 3 20.5 3 24.64 3 28 6.36 28 10.5c0 2.56-1.48 5-3.16 6.6L12 21.35z"/>
          </svg>
        </button>
      </div>
    `;
    // Add the meal to the container
    mealsContainer.appendChild(mealElement);
  });
}

// Display meal detail
function displayMealDetail(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => response.json())
    .then(data => {
      const meal = data.meals ? data.meals[0] : null;
      if (!meal) {
        throw new Error(`No meal found with ID ${mealId}`);
      }
      const mealDetails = {
        id: meal.idMeal,
        name: meal.strMeal,
        image: meal.strMealThumb,
        instructions: meal.strInstructions,
      };
      // Store the meal details in the session storage
      sessionStorage.setItem("mealDetails", JSON.stringify(mealDetails));
      // Redirect to the meal details page
      window.location.href = "meal-details.html";
    })
    .catch(error => {
      console.error(error);
    });
}

// Get the meal details from the session storage
const mealDetails = JSON.parse(sessionStorage.getItem("mealDetails"));
if (!mealDetails) {
  throw new Error("No meal details found");
}
// Display the meal details
const mealDetailContainer = document.getElementById("meal-detail-container");
mealDetailContainer.innerHTML = `
  <div class="meal-detail">
    <h2>${mealDetails.name}</h2>
    <img src="${mealDetails.image}" alt="${mealDetails.name}">
    <p>${mealDetails.instructions}</p>
    <button class="btn-favourite" data-mealid="${mealDetails.id}">Add to favourites</button>
  </div>
`;



// Add meal to favourites
function addMealToFavourites(mealID) {
  // Get favourite meals from local storage
  const favouriteMeals = JSON.parse(localStorage.getItem('favouriteMeals')) || [];
  // Check if meal is already in favourites
  const existingMeal = favouriteMeals.find((meal) => meal.idMeal === mealID);
  if (existingMeal) {
    return;
  }
  // Fetch meal details and add to favourites
  getMealByID(mealID)
    .then((meal) => {
      favouriteMeals.push(meal);
      // Save favourite meals to local storage
      localStorage.setItem('favouriteMeals', JSON.stringify(favouriteMeals));
    })
    .catch((error) => {
      console.error(`Error adding meal to favourites: ${error}`);
    });
}
function updateFavouritesUI() {
  // Get favourites from local storage
  const favouriteMeals = JSON.parse(localStorage.getItem('favouriteMeals')) || [];
  // Clear previous favourites
  favouriteMealsContainer.innerHTML = '';
  // Add favourites to UI
  if (favouriteMeals.length > 0) {
    favouriteMeals.forEach((mealID) => {
      getMealByID(mealID)
        .then((meal) => {
          const favouriteMealElement = `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info">
                <h3>${meal.strMeal}</h3>
                <button class="btn-unfavourite" data-mealid="${meal.idMeal}"><i class="fas fa-heart"></i></button>
              </div>
            </div>
          `;
          favouriteMealsContainer.insertAdjacentHTML('beforeend', favouriteMealElement);
        })
        .catch((error) => {
          console.error(`Error fetching meal detail: ${error}`);
        });
    });
  } else {
    const noFavouritesElement = `
      <p>You haven't added any favourites yet.</p>
    `;
    favouriteMealsContainer.innerHTML = noFavouritesElement;
  }
}
