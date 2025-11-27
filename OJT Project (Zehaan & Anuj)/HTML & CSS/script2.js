//importing function from api.js
import { getAllMeals } from './api.js';


const recommendedContainer = document.querySelector(".recommended-card-container");


//generating HTML
function displayMeals(meals){
    recommendedContainer.innerHTML = '';


    const max = meals.length-8;
    console.log(max);
    const randomNumber = Math.floor(Math.random() * max);
    console.log(randomNumber)
    
    
    // Limit to 8 items for design purposes
    const mealsToShow = meals.slice(randomNumber, randomNumber+8);
    // const mealsToShow = meals;


    mealsToShow.forEach(meal => {
        ////instruction
        // const shortDescription = meal.strInstructions
        //     ? meal.strInstructions.substring(0, 100) + "..."
        //     : "No description available";


        ////area
        const area = meal.strArea ? meal.strArea: "Information on area not available..."




        const cardHTML = `
            <div class="recommended-card">
                <a href="#">
                    <div class="img-box" style="background-image: url('${meal.strMealThumb}'); background-size: cover; background-position: center;"></div>
                </a>
                <div class="fav-bg">
                    <a href="#">
                        <svg class="fav-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black">
                           <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                        </svg>
                    </a>
                </div>
                <h3>${meal.strMeal}</h3>
                <p>${area}</p>
                <a href="details.html?id=${meal.idMeal}"><button>See Full Details</button></a>
            </div>
        `;


        recommendedContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}


// 2. Main controller function
async function init() {
    console.log("Fetching meals...");
    const meals = await getAllMeals(); // Call the API file
   
    if(meals.length > 0){
        displayMeals(meals); // Update the UI
    } else {
        recommendedContainer.innerHTML = '<p>No meals found.</p>';
    }
}


// Start the app
init();



