import { doc, setDoc } from "firebase/firestore";
import { firestoreDb } from "./firebaseConfig.js";
import FirebaseConverter from "../utils/FirebaseConverter.js";

const fb = new FirebaseConverter();
const recipeConverter = fb.recipeConverter;
const ingredientsConverter = fb.ingredientsConverter;
/**
 * Firebase utility class for converting data.
 * @typedef {Object} FirebaseConverter
 * @property {function} recipeConverter - Converter for recipes.
 * @property {function} ingredientsConverter - Converter for ingredients.
 */

/**
 * Save a recipe/meal into the specified Firestore collection.
 * @async
 * @param {string} collection - The Firestore collection to save the recipe into.
 * @param {Recipe} recipe - The recipe/meal to save.
 * @throws {Error} If there is an error storing the recipe.
 */
async function PutRecipe(collection, recipe) {
  /**
   * Convert an ingredient using the ingredients converter.
   * @private
   * @param {Ingredient} ingredient - The ingredient to convert.
   * @returns {Object} The converted ingredient.
   * @throws {Error} If there is an error converting the ingredient.
   */
  const convertIngredient = (ingredient) => {
    try {
      return ingredientsConverter.toFirestore(ingredient);
    } catch (error) {
      console.error("Error converting ingredient:", error);
      console.log("Problematic ingredient:", ingredient);
      throw error;
    }
  };

  try {
    // Convert all ingredients in the recipe
    const convertedIngredients = recipe.ingredients.map((ingredient) =>
      convertIngredient(ingredient)
    );

    // Create a new recipe object with converted ingredients
    const recipeWithConvertedIngredients = {
      ...recipe,
      ingredients: convertedIngredients,
    };

    // Get a reference to the Firestore document with the specified ID
    const ref = doc(firestoreDb, collection, String(recipe.id)).withConverter(
      recipeConverter
    );

    // Set the document with the converted recipe data
    await setDoc(ref, recipeWithConvertedIngredients);
  } catch (error) {
    console.error("Error storing recipe:", error);
    throw error;
  }
}

export default PutRecipe;
