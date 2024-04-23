// MealDataManager will handle generating meal data from two sources:
// 1. The Spoonacular API
// 2. The FirebaseDB
// Ingredients as well as Meals will be handled by this manager (for now)
import { Recipe } from "../customObjects/Recipe.js";
import { Ingredient } from "../customObjects/Ingredient.js";
class MealDataManager {
  constructor() {
    // https://spoonacular.com/food-api/console#Dashboard
    this.spoonacularURL = new URL("https://api.spoonacular.com/recipes");
    this.spoonacularApi = process.env.REACT_APP_SPOONACULAR_API_KEY;
  }

  /**
   *
   * @param {String} query what was entered in the search bar (food)
   * @param {Number} offset used for infinite scroll
   * @returns
   */
  async queryRecipeFromSpoonacular(query, offset) {
    const searchQuery = new URLSearchParams();
    /*
        addRecipeInformation	boolean	false	If set to true, you get more information about the recipes returned.
        offset                number	0	    The number of results to skip (between 0 and 900).
        number  	            number	10	    The number of expected results (between 1 and 100).
        fillIngredients	      boolean	false	Add information about the ingredients and whether they are used or missing in relation to the query.
        */
    searchQuery.append("apiKey", this.spoonacularApi);
    searchQuery.append("query", query); // Assuming query is a string, adjust accordingly
    searchQuery.append("addRecipeInformation", true);
    searchQuery.append("offset", offset); //use this offset for infinite scrolling
    searchQuery.append("number", 20); //ask for 100 recipes instead of 10
    searchQuery.append("fillIngredients", true); //get ingredient info

    const fullUrl = `${
      this.spoonacularURL
    }/complexSearch?${searchQuery.toString()}`;

    /*
        using the search params from above we get these properities of a recipe
        recipe keys=["vegetarian","vegan","glutenFree","dairyFree","veryHealthy","cheap","veryPopular","sustainable","lowFodmap","weightWatcherSmartPoints","gaps","preparationMinutes","cookingMinutes","aggregateLikes","healthScore","creditsText","sourceName","pricePerServing","extendedIngredients","id","title","readyInMinutes","servings","sourceUrl","image","imageType","summary","cuisines","dishTypes","diets","occasions","analyzedInstructions","spoonacularScore","spoonacularSourceUrl","usedIngredientCount","missedIngredientCount","missedIngredients","likes","usedIngredients","unusedIngredients"]
        */

    try {
      const response = await fetch(fullUrl);

      const data = await response.json();
      const searchResultsList = data.results.map((recipe) => {
        // Parse each ingredient to fit out custom ingredient object
        const mappedIngredients = recipe.extendedIngredients
          ? recipe.extendedIngredients.map((ingredient) => {
              const ing = new Ingredient(
                ingredient.amount,
                ingredient.id,
                ingredient.nameClean ? ingredient.nameClean : ingredient.name,
                ingredient.unit
              );
              return ing;
            })
          : [];

        const mappedResult = new Recipe(
          recipe.cuisines || [],
          recipe.dishTypes || [],
          recipe.id,
          recipe.image,
          mappedIngredients,
          recipe.analyzedInstructions || [],
          recipe.title,
          recipe.servings,
          recipe.summary
        );
        return mappedResult;
      });

      //i want the number of matching meals from spoonacular so infinite scroll knows when to stop
      return {
        resultsList: searchResultsList,
        totalResults: data.totalResults,
      };
    } catch (error) {
      console.error("Error fetching Recipe data:", error);
      throw error;
    }
  }

  async searchIngredients(query, number = 25) {
    const searchParams = new URLSearchParams({
      apiKey: this.spoonacularApi,
      query,
      number: number.toString(),
    });

    const url = `https://api.spoonacular.com/food/ingredients/search?${searchParams.toString()}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const searchResults = data.results.map((result) => {
        return new Ingredient(null, result.id, result.name, null, result.image);
      });

      return {
        results: searchResults,
        totalResults: data.totalResults,
      };
    } catch (error) {
      console.error("Error searching for ingredients:", error);
      throw error;
    }
  }
}

export default MealDataManager;
