const API_KEY = "1";
const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');


// function to fetch and display cooking description
export async function getAllMeals(){
    // try{
    //     //fetching data from the mealdbapi
    //     const response = await fetch(`https://www.themealdb.com/api/json/v1/${API_KEY}/search.php?f=a`);


    //     //check if the response is successful
    //     if(!response.ok){
    //         throw new Error(`HTTP error! status:${response.status}`);
    //     }


    //     const data = await response.json();


    //     // const recipe = data.recipe;


    //     console.log(data);


    //     // const car
    // }catch(error){
    //  //Handle any errors during fetch or processing
    //  console.error('Error fetching recipe:', error.message);
    // }  


    try{
        // array of fetch promises => 1 for each letter
        const fetchPromises = letters.map(async (letter) => {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/${API_KEY}/search.php?f=${letter}`);
           
            //checking if the response is successful
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }


            return response.json();
        });


        //waiting for all the responses to finish
        console.log(fetchPromises);
        
        const results = await Promise.all(fetchPromises);


        //combining the results
        //since some letters might return {meals : null},
        //so we will be using (data.meals || []) to avoid the errors
        const allMeals = results.flatMap(data => data.meals || []);


        console.log(`Successfully fetched ${allMeals.length} meals.`);
        console.log(allMeals);


        return allMeals;
    }catch(error){
        console.error('Error fetching recipes:', error.message);
        return []
    }




}


await getAllMeals();