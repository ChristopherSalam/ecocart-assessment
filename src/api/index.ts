import axios, { AxiosResponse } from 'axios';
import express, { Request } from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import Menu from '../interfaces/Menu';
import Meal from '../interfaces/Meal';
import Ingredient from '../interfaces/Ingredient';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  const main_ingredient = req.query.ingredient || 'chicken_breast'
  const endpoint = 'https://www.themealdb.com/api/json/v1/1/'
  const ingredient_endpoint = endpoint + 'filter.php?i=';
  const id_endpoint = endpoint + 'lookup.php?i=';
  const query_message = 'There\'s no meals returned with this ingredient.'

  // Used a single get to get a meal list and then called a batch query with meal ids
  axios({
    method: "get",
    url: ingredient_endpoint + main_ingredient,
  }).then((response) => {
    let meals = response.data.meals;
    console.log(meals)

    if (!meals) return res.json({ message: query_message });

    try {
      let endpoints: Array<string> = [], transformedData;
      meals.map(function(meal: Menu){
        endpoints.push(id_endpoint + meal.idMeal)
      });
      Promise.all(endpoints.map((e : any) => axios.get(e))).then(
        axios.spread((...menu) => {
          let formatedData: Array<Meal> = []
          menu.map(function(mealInfo: AxiosResponse){
            let mealRaw = mealInfo.data.meals[0]
            let ingredients: Array<Ingredient> = [];

            for (let i = 1; i <= 20; i++) {
              if (mealRaw["strIngredient" + i]) {
                ingredients.push({
                  ingredient: mealRaw["strIngredient" + i],
                  measurement: mealRaw["strMeasure" + i] 
                });
              } else {
                break;
              }
            }

            // Meal
            formatedData.push({
              "id": mealRaw.idMeal,
              "name": mealRaw.strMeal,
              "instructions": mealRaw.strInstructions,
              "tags": mealRaw.strTags ? mealRaw.strTags.split(',') : [],
              "thumbUrl": mealRaw.strMealThumb,
              "youtubeUrl": mealRaw.strYoutube,
              "ingredients": ingredients
            });
          })

          res.json({ 
            message: `These are the ${main_ingredient} meals in our database!`,
            meals: formatedData
           });
        })
      )
    } catch (error) {
      if (error) throw new Error(query_message);
    }
  });
});

export default router;
