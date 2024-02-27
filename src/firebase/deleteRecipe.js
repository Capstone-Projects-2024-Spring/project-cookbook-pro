import { doc, deleteDoc, getFirestore } from "firebase/firestore";
import { firebaseApp } from "./firebaseConfig.js";

/**
 * Firestore database instance.
 * @type {import("firebase/firestore").Firestore}
 */
const db = getFirestore(firebaseApp);

/**
 * Deletes a recipe from the specified collection.
 *
 * @param {string} collection - The name of the collection where the recipe is stored.
 * @param {string} recipeID - The ID of the recipe to be deleted.
 * @returns {Promise<void>} - A promise that resolves once the deletion is complete.
 */
async function deleteRecipe(collection, recipeID) {
  /**
   * Reference to the document to be deleted.
   * @type {import("firebase/firestore").DocumentReference}
   */
  const recipeDocRef = doc(db, collection, recipeID);

  try {
    await deleteDoc(recipeDocRef);
    console.log(`Recipe with ID ${recipeID} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting recipe with ID ${recipeID}:`, error.message);
    throw error;
  }
}

export default deleteRecipe;
