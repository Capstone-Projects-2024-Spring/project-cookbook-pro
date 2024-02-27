import { collection, query, onSnapshot, Unsubscribe } from "firebase/firestore";
import { firestoreDb } from "./firebaseConfig.js";

/**
 * Retrieves data from a Firestore collection and updates the state using the provided setter.
 *
 * @param {ReactUseStateFunction} setter - The state setter function to update the state with the fetched data.
 * @param {string} collectionName - The name of the Firestore collection to listen to.
 * @returns {Unsubscribe} - The unsubscribe function to stop listening to changes in the Firestore collection.
 */
function getListener(collectionName, setter) {
  // Create a query for the specified collection
  const q = query(collection(firestoreDb, collectionName));

  // Set up a snapshot listener to the Firestore collection
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const recipes = [];

    // Process each document in the collection
    querySnapshot.forEach((doc) => {
      // Exclude documents with id 0
      if (doc.data().id !== 0) {
        recipes.push(doc.data());
      }
    });

    // Update the state with the fetched data
    setter(recipes);
  });

  // Return the unsubscribe function
  return unsubscribe;
}

export default getListener;
