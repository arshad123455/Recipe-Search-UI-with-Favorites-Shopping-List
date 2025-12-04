const API_KEY = '5b041ddc04a64e11b66749cd2afdd2a0';
const RECIPE_COUNT = 4; // Fetch 4 at a time
let isLoading = false;
const loadedRecipeIds = new Set();

async function fetchRecipes() {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/random?number=${RECIPE_COUNT}&apiKey=${API_KEY}`);
        const data = await response.json();

        if (data.recipes) {
            // Add to loaded IDs
            data.recipes.forEach(recipe => loadedRecipeIds.add(recipe.id));
            displayRecipes(data.recipes);
        } else {
            console.error('No recipes found');
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

async function fetchMoreRecipes() {
    if (isLoading) return;
    isLoading = true;

    try {
        // Fetch a few more to account for duplicates we might filter out
        const fetchCount = 4;
        const response = await fetch(`https://api.spoonacular.com/recipes/random?number=${fetchCount}&apiKey=${API_KEY}`);
        const data = await response.json();

        if (data.recipes) {
            const newRecipes = data.recipes.filter(recipe => !loadedRecipeIds.has(recipe.id));

            // Add new IDs to Set
            newRecipes.forEach(recipe => loadedRecipeIds.add(recipe.id));

            if (newRecipes.length > 0) {
                appendRecommendedRecipes(newRecipes);
            }
        }
    } catch (error) {
        console.error('Error fetching more recipes:', error);
    } finally {
        isLoading = false;
    }
}

function appendRecommendedRecipes(recipes) {
    const recommendedContainer = document.querySelector('.recommended-card-container');
    if (!recommendedContainer) return;

    recipes.forEach(recipe => {
        const card = createRecipeCard(recipe, 'recommended-card');
        card.classList.add('recipe-card-enter'); // Add animation class
        recommendedContainer.appendChild(card);
    });
}

async function searchRecipes(query) {
    if (!query) return;
    try {
        // complexSearch with addRecipeInformation to get summary and other details
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=${RECIPE_COUNT}&apiKey=${API_KEY}&addRecipeInformation=true`);
        const data = await response.json();

        if (data.results) {
            displaySearchResults(data.results);
        } else {
            console.error('No recipes found');
        }
    } catch (error) {
        console.error('Error searching recipes:', error);
    }
}

function displayRecipes(recipes) {
    const popularContainer = document.querySelector('.popular-card-container');
    const recommendedContainer = document.querySelector('.recommended-card-container');

    // Reset sections visibility just in case
    document.querySelector('.popular').style.display = 'block';
    document.querySelector('.recommended').style.display = 'block';
    if (recommendedContainer) recommendedContainer.parentElement.style.display = 'block';

    // Clear existing content
    if (popularContainer) popularContainer.innerHTML = '';
    if (recommendedContainer) recommendedContainer.innerHTML = '';

    // For initial load, put all 4 in popular, or split? 
    // The user said "call only 4 recipe cards at once". 
    // Let's put the first 4 in Popular, and leave Recommended empty initially until scroll.
    // Or maybe 2 and 2? Let's stick to the request "4 recipe cards at once".
    // I'll put all 4 in Popular initially.

    const popularRecipes = recipes;

    if (popularContainer) {
        popularRecipes.forEach(recipe => {
            const card = createRecipeCard(recipe, 'popular-card');
            popularContainer.appendChild(card);
        });
    }
}


function displaySearchResults(recipes) {
    const popularContainer = document.querySelector('.popular-card-container');
    const recommendedContainer = document.querySelector('.recommended-card-container');
    const popularHeader = document.querySelector('.popular h2');
    const popularSubtext = document.querySelector('.popular .subtext');
    const recommendedSection = document.querySelector('.recommended');

    // Update Header
    if (popularHeader) popularHeader.textContent = 'Search Results';
    if (popularSubtext) popularSubtext.textContent = `Found ${recipes.length} recipes`;

    // Hide Recommended Section
    if (recommendedSection) recommendedSection.style.display = 'none';
    if (recommendedContainer) recommendedContainer.parentElement.style.display = 'none';

    // Clear and populate popular container with search results
    if (popularContainer) {
        popularContainer.innerHTML = '';
        recipes.forEach(recipe => {
            const card = createRecipeCard(recipe, 'popular-card');
            popularContainer.appendChild(card);
        });
    }
}

function createRecipeCard(recipe, className) {
    const card = document.createElement('div');
    card.classList.add(className);

    // Image
    const imgLink = document.createElement('a');
    imgLink.href = `/HTML & CSS/Recipe/recipe.html?id=${recipe.id}`; // Dynamic link with ID
    const imgBox = document.createElement('div');
    imgBox.classList.add('img-box');
    imgBox.style.backgroundImage = `url(${recipe.image})`;
    imgBox.style.backgroundSize = 'cover';
    imgBox.style.backgroundPosition = 'center';
    imgLink.appendChild(imgBox);
    card.appendChild(imgLink);

    // Favorite Icon
    const favBg = document.createElement('div');
    favBg.classList.add('fav-bg');
    const favLink = document.createElement('a');
    favLink.href = '#';

    // Check if recipe is already in favorites
    let favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    const isFavorite = favorites.some(fav => fav.id === recipe.id);
    const fillColor = isFavorite ? 'red' : 'white';

    favLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="${fillColor}"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/></svg>`;

    favLink.addEventListener('click', (e) => {
        e.preventDefault();
        addToFavorites(recipe, favLink.querySelector('svg'));
    });

    favBg.appendChild(favLink);
    card.appendChild(favBg);

    // Title
    const title = document.createElement('h3');
    title.textContent = recipe.title;
    // Truncate title if too long
    if (recipe.title.length > 20) {
        title.textContent = recipe.title.substring(0, 20) + '...';
    }
    card.appendChild(title);

    // Summary (About)
    const summary = document.createElement('p');
    // Remove HTML tags from summary and truncate
    const cleanSummary = recipe.summary ? recipe.summary.replace(/<[^>]*>?/gm, '') : 'No description available.';
    summary.textContent = cleanSummary.length > 50 ? cleanSummary.substring(0, 50) + '...' : cleanSummary;
    card.appendChild(summary);

    // Button
    const btnLink = document.createElement('a');
    btnLink.href = `/HTML & CSS/Recipe/recipe.html?id=${recipe.id}`;
    const btn = document.createElement('button');
    btn.textContent = 'See Full Details';
    btnLink.appendChild(btn);
    card.appendChild(btnLink);

    return card;
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
        alert('Recipe added to favorites!');
        if (svgElement) svgElement.setAttribute('fill', 'red');
    } else {
        alert('Recipe is already in your favorites!');
        // Optional: Remove from favorites if clicked again? 
        // For now, just keeping the alert as per previous behavior, but ensuring it stays red.
        if (svgElement) svgElement.setAttribute('fill', 'red');
    }
}
//creating a function to call only 4 recipe cards at once instead of 40 and calling more of them evrytime the user scrolls down.



// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchRecipes();

    const searchInput = document.querySelector('.search-bar-container input');
    const searchIcon = document.querySelector('.search-bar-container .search-icon');

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchRecipes(searchInput.value);
            }
        });
    }

    if (searchIcon && searchInput) {
        searchIcon.addEventListener('click', () => {
            searchRecipes(searchInput.value);
        });
    }
    // Infinite Scroll Listener
    window.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        // Load more when user is near the bottom (e.g., within 100px)
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            fetchMoreRecipes();
        }
    });
});