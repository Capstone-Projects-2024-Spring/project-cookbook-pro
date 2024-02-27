import { doc, getDoc, getFirestore } from "firebase/firestore";
import { firebaseApp } from "./firebaseConfig.js";
import FirebaseConverter from "../managers_and_parsers/FirebaseConverter.js";

/**
 * Firestore database instance.
 * @type {import("firebase/firestore").Firestore}
 */
const db = getFirestore(firebaseApp);

/**
 * FirebaseConverter instance for managing Firestore data conversion.
 * @type {FirebaseConverter}
 */
const fb = new FirebaseConverter();

/**
 * Converter for Firestore recipes data.
 * @type {import("../managers_and_parsers/FirebaseConverter.js").RecipeConverter}
 */
const recipeConverter = fb.recipeConverter;

/**
 * Retrieves recipes from the specified Firestore collection.
 *
 * @param {String} collection - The name of the Firestore collection.
 * @param {String} recipeID - The ID of the recipe to retrieve.
 * @returns {Promise<import("../managers_and_parsers/FirebaseConverter.js").RecipeData|null>} - A promise that resolves to the recipe data, or null if the document doesn't exist.
 * @throws {Error} - Throws an error if there is an issue with Firestore operations.
 */
async function GetRecipes(collection, recipeID) {
  /**
   * Reference to the Firestore document.
   * @type {import("firebase/firestore").DocumentReference}
   */
  const docRef = doc(db, collection, recipeID);

  /**
   * Snapshot of the Firestore document.
   * @type {import("firebase/firestore").DocumentSnapshot}
   */
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    /**
     * Converted data using the recipeConverter.
     * @type {import("../managers_and_parsers/FirebaseConverter.js").RecipeData}
     */
    const data = recipeConverter.fromFirestore(docSnap);
    return data;
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    return null;
  }
}

export default GetRecipes;
