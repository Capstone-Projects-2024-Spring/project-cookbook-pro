/**
 * Convert to and from Firebase and JSON recipe object.
 * @module FirebaseConverter
 */

import { Recipe } from "../customObjects/Recipe.js";
import { Ingredient } from "../customObjects/Ingredient.js";

/**
 * Class representing a FirebaseConverter for handling conversions between Firebase and JSON objects.
 */
class FirebaseConverter {
  /**
   * Create a FirebaseConverter.
   */
  constructor() {}

  /**
   * Firestore data converter for Ingredients.
   * @memberof FirebaseConverter
   * @type {object}
   * @property {function} toFirestore - Convert to Firestore object.
   * @property {function} fromFirestore - Convert to JSON.
   */
  ingredientsConverter = {
    /**
     * Convert Ingredient to Firestore object.
     * @param {Ingredient} ingredient - The Ingredient object.
     * @returns {object} - Firestore object representation of Ingredient.
     */
    toFirestore: (ingredient) => {
      if (!ingredient) {
        console.error("Ingredient is undefined or null");
        return null;
      }

      return {
        amount: ingredient.amount,
        id: ingredient.id,
        name: ingredient.name,
        unit: ingredient.unit,
      };
    },

    /**
     * Convert Firestore snapshot to Ingredient JSON.
     * @param {object} snapshot - Firestore snapshot.
     * @param {object} options - Conversion options.
     * @returns {Ingredient} - Ingredient object.
     */
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new Ingredient(data.amount, data.id, data.name, data.unit);
    },
  };

  /**
   * Firestore data converter for Recipe.
   * @memberof FirebaseConverter
   * @type {object}
   * @property {function} toFirestore - Convert to Firestore object.
   * @property {function} fromFirestore - Convert to JSON.
   */
  recipeConverter = {
    /**
     * Convert Recipe to Firestore object.
     * @param {Recipe} recipe - The Recipe object.
     * @returns {object} - Firestore object representation of Recipe.
     */
    toFirestore: (recipe) => {
      if (!recipe) {
        console.error("Recipe is undefined or null");
        return null;
      }
      return {
        cuisine: recipe.cuisine,
        dishType: recipe.dishType,
        id: recipe.id,
        image: recipe.image,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        name: recipe.name,
        servings: recipe.servings,
        summary: recipe.summary,
        isSaved: recipe.isSaved,
      };
    },

    /**
     * Convert Firestore snapshot to Recipe JSON.
     * @param {object} snapshot - Firestore snapshot.
     * @returns {Recipe} - Recipe object.
     */
    fromFirestore: (snapshot) => {
      const data = snapshot.data();
      return new Recipe(
        data.cuisine,
        data.dishType,
        data.id,
        data.image,
        data.ingredients,
        data.instructions,
        data.name,
        data.servings,
        data.summary,
        data.isSaved
      );
    },
  };
}

export default FirebaseConverter;
