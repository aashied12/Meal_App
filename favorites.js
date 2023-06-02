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

  function createFavoriteItem(mealId, mealTitle) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.textContent = mealTitle;

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
