// Array to store meals
let meals = [];

// Get input and button elements
const mealInput = document.getElementById('mealInput');
const addMealBtn = document.getElementById('addMealBtn');

// Get ul element to display meals
const mealList = document.getElementById('mealList');

// Function to add meal to array and display on the page
function addMeal() {
  // Get input value and clear input field
  const mealName = mealInput.value.trim();
  mealInput.value = '';

  // If meal name is not empty, add it to the array and update the display
  if (mealName) {
    meals.push(mealName);
    updateDisplay();
  }
}

// Function to update the display with the current array of meals
function updateDisplay() {
  // Clear the current display
  mealList.innerHTML = '';

  // If there are no meals, show a message
  if (meals.length === 0) {
    const noMealsMsg = document.createElement('p');
    noMealsMsg.textContent = 'No meals added yet.';
    mealList.appendChild(noMealsMsg);
  } else {
    // Create a list item for each meal and add it to the ul element
    for (let i = 0; i < meals.length; i++) {
      const mealItem = document.createElement('li');
      mealItem.className = 'list-group-item';
      mealItem.textContent = meals[i];
      mealList.appendChild(mealItem);
    }
  }
}

// Event listener for add meal button
addMealBtn.addEventListener('click', addMeal);
