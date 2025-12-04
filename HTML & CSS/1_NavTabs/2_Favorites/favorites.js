document.addEventListener('DOMContentLoaded', () => {
    const favoritesContainer = document.getElementById('favorites-container');
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];

    console.log('Favorites Page Loaded. Found recipes:', favorites.length);

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p>No favorite recipes added yet.</p>';
        return;
    }

    favorites.forEach(recipe => {
        const card = document.createElement('div');
        card.classList.add('popular-card');

        // Strip HTML tags and truncate summary
        let summary = recipe.summary || '';
        summary = summary.replace(/<[^>]*>?/gm, ''); // Remove HTML tags

        if (summary.length > 100) {
            summary = summary.substring(0, 100) + '...';
        }

        card.innerHTML = `
            <a href="../../Recipe/recipe.html?id=${recipe.id}">
                <div class="img-box" style="background-image: url('${recipe.image}'); background-size: cover; background-position: center;"></div>
            </a>
            <div class="fav-bg">
                 <a href="#" class="remove-fav-btn" data-id="${recipe.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="red"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/></svg>
                </a>
            </div>
            <h3>${recipe.title}</h3>
            <p>${summary}</p>
            <a href="../../Recipe/recipe.html?id=${recipe.id}"><button>See Full Details</button></a>
        `;

        favoritesContainer.appendChild(card);
    });

    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const recipeId = parseInt(btn.getAttribute('data-id'));
            console.log('Removing recipe ID:', recipeId);
            removeFromFavorites(recipeId);
        });
    });
});

function removeFromFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    favorites = favorites.filter(recipe => recipe.id !== id);
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
    location.reload(); // Reload to update the list
}
