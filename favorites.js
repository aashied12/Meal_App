document.addEventListener('DOMContentLoaded', () => {
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

  // Add event listener for remove button clicks
  favoritesList.addEventListener('click', handleRemoveFavorite);

  function handleRemoveFavorite(event) {
    if (event.target.tagName === 'BUTTON') {
      const mealId = event.target.dataset.mealId;
      removeFavorite(mealId);
    }
  }

  function removeFavorite(mealId) {
    // Retrieve the favorites from local storage and parse the JSON string
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Find the index of the meal in the favorites list
    const index = favorites.findIndex((meal) => meal.idMeal === mealId);
    if (index !== -1) {
      // Remove the meal from the favorites list
      favorites.splice(index, 1);

      // Update the favorites in local storage
      localStorage.setItem('favorites', JSON.stringify(favorites));

      // Refresh the favorites list
      displayFavorites();
    }
  }
}


  // Function to create a favorite item element
  function createFavoriteItem(meal) {
  const item = document.createElement('div');
  item.classList.add('favorite-item');

  const image = document.createElement('img');
  image.src = meal.strMealThumb;
  image.alt = meal.strMeal;
  // Add a custom CSS class to the image element
  image.classList.add('favorite-item-image');
  item.appendChild(image);

  const title = document.createElement('h5');
  title.textContent = meal.strMeal;
  item.appendChild(title);

  const removeButton = document.createElement('button');
  removeButton.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'mx-2');
  removeButton.innerHTML = '<i class="bi bi-trash"></i>';
  removeButton.dataset.mealId = meal.idMeal;
  item.appendChild(removeButton);

  return item;
}


  // Update the favorites page on load
  displayFavorites();
});
