document.addEventListener('DOMContentLoaded', () => {
  const mealDetail = document.getElementById('mealDetail');

  // Get the meal ID from the query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const mealId = urlParams.get('id');

  // If the meal ID is available, fetch the meal details and display them
  if (mealId) {
    fetchMealDetails(mealId)
      .then((meal) => displayMealDetails(meal))
      .catch((error) => console.error(error));
  }

  async function fetchMealDetails(mealId) {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const data = await response.json();
    return data.meals[0];
  }

  function displayMealDetails(meal) {
    mealDetail.innerHTML = `
      <div class="card">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
        <div class="card-body">
          <h5 class="card-title">${meal.strMeal}</h5>
          <p class="card-text">Category: ${meal.strCategory}</p>
          <p class="card-text">Area: ${meal.strArea}</p>
          <p class="card-text">Instructions: ${meal.strInstructions}</p>
        </div>
      </div>
    `;
  }

  // Homepage button event listener
  const homepageButton = document.getElementById('homepageButton');
  homepageButton.addEventListener('click', redirectToHomepage);

  function redirectToHomepage() {
    window.location.href = 'index.html';
  }
});
