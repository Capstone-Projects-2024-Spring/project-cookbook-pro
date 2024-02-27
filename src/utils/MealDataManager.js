// MealDataManager will handle generating meal data from two sources:
// 1. The Spoonacular API
// 2. The FirebaseDB
// Ingredients as well as Meals will be handled by this manager (for now)
import { Recipe } from "../customObjects/Recipe.js";
import { Ingredient } from "../customObjects/Ingredient.js";
import PutRecipe from "../firebase/putRecipe.js";

/**
 * Class representing a manager for handling meal data from Spoonacular API and FirebaseDB.
 */
class MealDataManager {
  /**
   * Constructor for MealDataManager class.
   * Initializes Spoonacular API URL and API key.
   */
  constructor() {
    // https://spoonacular.com/food-api/console#Dashboard
    this.spoonacularURL = new URL("https://api.spoonacular.com/recipes");
    this.spoonacularApi = process.env.REACT_APP_SPOONACULAR_API_KEY;
  }

  /**
   * Query Spoonacular API for recipes based on the given search query and offset.
   *
   * @param {String} query - The search query entered in the search bar (food).
   * @param {Number} offset - The offset used for infinite scroll.
   * @returns {Promise<Object>} - A promise that resolves to an object containing search results list and total results count.
   */
  async queryRecipeFromSpoonacular(query, offset) {
    const searchQuery = new URLSearchParams();
    /*
      addRecipeInformation  boolean  false   If set to true, you get more information about the recipes returned.
      offset                number   0       The number of results to skip (between 0 and 900).
      number                number   10      The number of expected results (between 1 and 100).
      fillIngredients       boolean  false   Add information about the ingredients and whether they are used or missing in relation to the query.
    */
    searchQuery.append("apiKey", this.spoonacularApi);
    searchQuery.append("query", query);
    searchQuery.append("addRecipeInformation", true);
    searchQuery.append("offset", offset);
    searchQuery.append("number", 20);
    searchQuery.append("fillIngredients", true);

    const fullUrl = `${
      this.spoonacularURL
    }/complexSearch?${searchQuery.toString()}`;

    /*
      using the search params from above we get these properties of a recipe
      recipe keys=["vegetarian","vegan","glutenFree","dairyFree","veryHealthy","cheap","veryPopular","sustainable","lowFodmap","weightWatcherSmartPoints","gaps","preparationMinutes","cookingMinutes","aggregateLikes","healthScore","creditsText","sourceName","pricePerServing","extendedIngredients","id","title","readyInMinutes","servings","sourceUrl","image","imageType","summary","cuisines","dishTypes","diets","occasions","analyzedInstructions","spoonacularScore","spoonacularSourceUrl","usedIngredientCount","missedIngredientCount","missedIngredients","likes","usedIngredients","unusedIngredients"]
    */

    try {
      const response = await fetch(fullUrl);
      const data = await response.json();
      console.log(data);

      const searchResultsList = data.results.map((recipe) => {
        // Parse each ingredient to fit our custom ingredient object
        const mappedIngredients = recipe.extendedIngredients.map(
          (ingredient) => {
            const ing = new Ingredient(
              ingredient.amount,
              ingredient.id,
              ingredient.nameClean ? ingredient.nameClean : ingredient.name,
              ingredient.unit
            );
            return ing;
          }
        );

        const mappedResult = new Recipe(
          recipe.cuisines,
          recipe.dishTypes,
          recipe.id,
          recipe.image,
          mappedIngredients,
          recipe.analyzedInstructions,
          recipe.title,
          recipe.servings,
          recipe.summary
        );

        PutRecipe("recipes", mappedResult);

        return mappedResult;
      });

      // Return the number of matching meals from Spoonacular for infinite scroll
      return {
        resultsList: searchResultsList,
        totalResults: data.totalResults,
      };
    } catch (error) {
      console.error("Error fetching Recipe data:", error);
      throw error;
    }
  }
}

export default MealDataManager;
