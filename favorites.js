document.addEventListener('DOMContentLoaded', () => {
  const favoritesList = document.getElementById('favoritesList');

  displayFavorites();

  function displayFavorites() {
  favoritesList.innerHTML = '';

  // Retrieve the favorites from local storage and parse the JSON string
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Iterate over the favorite meals and create the list items
  for (let i = 0; i < favorites.length; i++) {
    const meal = favorites[i];
    const mealId = meal.idMeal;
    const mealTitle = meal.strMeal;
    const mealImage = meal.strMealThumb;

    const favoriteItem = createFavoriteItem(mealId, mealTitle, mealImage);
    favoritesList.appendChild(favoriteItem);
  }
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



  function removeFavorite(mealId) {
    localStorage.removeItem(mealId);
  }
});
