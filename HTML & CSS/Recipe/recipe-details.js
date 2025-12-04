const API_KEY = '5b041ddc04a64e11b66749cd2afdd2a0';

let currentRecipe = null;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    console.log('Recipe Details Page Loaded. ID:', recipeId);

    if (recipeId) {
        fetchRecipeDetails(recipeId);
    } else {
        console.error('No recipe ID found in URL');
    }

    // Favorites Button Logic - Attach listener immediately
    const addToFavoritesBtn = document.getElementById('add-to-favorites-btn');
    if (addToFavoritesBtn) {
        console.log('Add to Favorites button found.');
        addToFavoritesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Add to Favorites button clicked.');
            if (currentRecipe) {
                addToFavorites(currentRecipe, addToFavoritesBtn.querySelector('svg'));
            } else {
                console.warn('Recipe data not loaded yet.');
                alert('Please wait for the recipe to load.');
            }
        });
    } else {
        console.error('Add to Favorites button NOT found!');
    }
});

async function fetchRecipeDetails(id) {
    try {
        console.log('Fetching recipe details for ID:', id);
        const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
        const recipe = await response.json();
        console.log('Recipe details fetched:', recipe);
        displayRecipeDetails(recipe);

        // Check if favorite and update icon
        updateFavoriteIcon(recipe.id);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
}

function updateFavoriteIcon(recipeId) {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    const isFavorite = favorites.some(fav => fav.id === recipeId);
    const addToFavoritesBtn = document.getElementById('add-to-favorites-btn');

    if (addToFavoritesBtn) {
        const svg = addToFavoritesBtn.querySelector('svg');
        if (svg) {
            svg.setAttribute('fill', isFavorite ? 'red' : 'white');
        }
    }
}

function displayRecipeDetails(recipe) {
    currentRecipe = recipe; // Store for favorites logic
    window.currentRecipe = recipe; // Expose for shopping list logic

    // Title
    const titleElement = document.getElementById('recipe-title');
    if (titleElement) titleElement.textContent = recipe.title;

    // Image
    const imageElement = document.getElementById('recipe-image');
    if (imageElement) {
        imageElement.style.backgroundImage = `url(${recipe.image})`;
        imageElement.style.backgroundSize = 'cover';
        imageElement.style.backgroundPosition = 'center';
    }

    // Summary
    const summaryElement = document.getElementById('recipe-summary');
    if (summaryElement) {
        summaryElement.innerHTML = recipe.summary; // Summary often contains HTML
    }

    // Ingredients
    const ingredientsList = document.getElementById('recipe-ingredients');
    if (ingredientsList) {
        ingredientsList.innerHTML = '';
        recipe.extendedIngredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = `${ingredient.original}`;
            ingredientsList.appendChild(li);
        });
    }

    // Instructions
    const instructionsContainer = document.getElementById('recipe-instructions');
    if (instructionsContainer) {
        instructionsContainer.innerHTML = '';
        if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
            recipe.analyzedInstructions[0].steps.forEach(step => {
                const p = document.createElement('p');
                p.textContent = `${step.number}. ${step.step}`;
                instructionsContainer.appendChild(p);
            });
        } else if (recipe.instructions) {
            const p = document.createElement('p');
            p.innerHTML = recipe.instructions;
            instructionsContainer.appendChild(p);
        } else {
            instructionsContainer.textContent = 'No instructions available.';
        }
    }
}

function addToFavorites(recipe, svgElement) {
    console.log('Adding to favorites:', recipe);
    let favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];

    // Check if recipe already exists
    const existingIndex = favorites.findIndex(fav => fav.id === recipe.id);

    if (existingIndex === -1) {
        const recipeToSave = {
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            summary: recipe.summary
        };
        favorites.push(recipeToSave);
        localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
        console.log('Recipe added to localStorage.');
        alert('Recipe added to favorites!');
        if (svgElement) svgElement.setAttribute('fill', 'red');
    } else {
        console.log('Recipe already in favorites.');
        alert('Recipe is already in your favorites!');
        if (svgElement) svgElement.setAttribute('fill', 'red');
    }
}
