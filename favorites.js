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
