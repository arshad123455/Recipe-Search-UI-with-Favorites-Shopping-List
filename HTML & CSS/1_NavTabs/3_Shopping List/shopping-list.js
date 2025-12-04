
document.addEventListener('DOMContentLoaded', () => {
    // Logic for Recipe Details Page
    const addToShoppingListBtn = document.getElementById('add-to-shopping-list-btn');
    if (addToShoppingListBtn) {
        addToShoppingListBtn.addEventListener('click', () => {
            if (window.currentRecipe) {
                addToShoppingList(window.currentRecipe.extendedIngredients);
            } else {
                console.warn('Recipe data not loaded yet.');
                alert('Please wait for the recipe to load.');
            }
        });
    }

    // Logic for Shopping List Page
    const shoppingListContainer = document.getElementById('shopping-list-container');
    if (shoppingListContainer) {
        displayShoppingList();
    }
});

function addToShoppingList(ingredients) {
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

    let addedCount = 0;
    ingredients.forEach(ingredient => {
        // Check if ingredient already exists to avoid duplicates (optional, but good UX)
        // For now, we'll just add everything as requested "all Ingredients must be added"
        // But maybe we should check for exact duplicates?
        // Let's just add them.

        // We'll store the name and maybe the original string
        const item = {
            id: ingredient.id, // spoonacular ingredient id
            name: ingredient.original,
            checked: false
        };

        // Simple check to avoid adding the EXACT same item object multiple times if clicked multiple times
        // But user might want to add same ingredients from different recipes.
        // Let's check if this specific string is already in the list.
        const exists = shoppingList.some(i => i.name === item.name);
        if (!exists) {
            shoppingList.push(item);
            addedCount++;
        }
    });

    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));

    if (addedCount > 0) {
        alert(`${addedCount} ingredients added to your Shopping List!`);
    } else {
        alert('Ingredients are already in your Shopping List.');
    }
}

function displayShoppingList() {
    const shoppingListContainer = document.getElementById('shopping-list-container');
    const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

    shoppingListContainer.innerHTML = '';

    if (shoppingList.length === 0) {
        shoppingListContainer.innerHTML = '<p>Your shopping list is empty.</p>';
        return;
    }

    shoppingList.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'open-notification-box';

        const checkboxDiv = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.checked;
        checkbox.addEventListener('change', () => {
            toggleItemCheck(index);
        });

        checkboxDiv.appendChild(checkbox);

        const textSpan = document.createElement('span');
        textSpan.textContent = item.name;
        if (item.checked) {
            textSpan.classList.add('completed');
        }

        itemDiv.appendChild(checkboxDiv);
        itemDiv.appendChild(textSpan);

        // Remove button
        const removeBtnDiv = document.createElement('div');
        removeBtnDiv.style.marginLeft = 'auto'; // Push to right
        removeBtnDiv.style.cursor = 'pointer';
        removeBtnDiv.style.backgroundColor = 'transparent';
        removeBtnDiv.style.boxShadow = 'none';

        const removeBtn = document.createElement('span');
        removeBtn.className = 'material-icons';
        removeBtn.style.color = 'red';
        removeBtn.textContent = 'delete';
        removeBtn.onclick = () => removeFromShoppingList(index);

        removeBtnDiv.appendChild(removeBtn);
        itemDiv.appendChild(removeBtnDiv);

        shoppingListContainer.appendChild(itemDiv);
    });
}

function toggleItemCheck(index) {
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    if (shoppingList[index]) {
        shoppingList[index].checked = !shoppingList[index].checked;
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
        displayShoppingList(); // Re-render to update styles
    }
}

function removeFromShoppingList(index) {
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    shoppingList.splice(index, 1);
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    displayShoppingList();
}
