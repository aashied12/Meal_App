document.addEventListener('DOMContentLoaded', () => {
  const favoritesList = document.getElementById('favoritesList');

  displayFavorites();

  function displayFavorites() {
    favoritesList.innerHTML = '';
    for (let i = 0; i < localStorage.length; i++) {
      const mealId = localStorage.key(i);
      const mealTitle = localStorage.getItem(mealId);
      const favoriteItem = createFavoriteItem(mealId, mealTitle);
      favoritesList.appendChild(favoriteItem);
    }
  }

  function createFavoriteItem(mealId, mealTitle, mealImage) {
  const listItem = document.createElement('li');
  listItem.classList.add('list-group-item');

  const mealImageElement = document.createElement('img');
  mealImageElement.src = mealImage;
  mealImageElement.alt = mealTitle;
  mealImageElement.classList.add('meal-image');
  listItem.appendChild(mealImageElement);

  const mealTitleElement = document.createElement('span');
  mealTitleElement.classList.add('meal-title');
  mealTitleElement.textContent = mealTitle;
  listItem.appendChild(mealTitleElement);

  const removeButton = document.createElement('button');
  removeButton.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'float-end');
  removeButton.innerHTML = '<i class="bi bi-trash"></i>';
  removeButton.addEventListener('click', () => {
    removeFavorite(mealId);
    listItem.remove();
  });
  listItem.appendChild(removeButton);

  return listItem;
}


  function removeFavorite(mealId) {
    localStorage.removeItem(mealId);
  }
});
