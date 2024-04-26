import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem, Button } from "reactstrap";
import RecipeDetails from "../RecipeDetails.jsx";
import { useAuth } from "../../utils/AuthContext.js";
import FirestoreService from "../../firebase/FirebaseService.js";
import EmptyCollectionMessage from "./EmptyCollectionMessage.jsx";
import FirestoreListener from "../../firebase/FirestoreListener.js";

const GeneratedMeals = () => {
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const { user } = useAuth();
  const firestoreListener = new FirestoreListener();

  useEffect(() => {
    if (user) {
      const userGeneratedRecipesPath = `Users/${user.uid}/generatedRecipes`;

      const unsubscribeFromGeneratedRecipes =
        firestoreListener.subscribeToCollection(
          userGeneratedRecipesPath,
          (docs) => {
            const recipes = docs.map((doc) => doc);
            setGeneratedRecipes(recipes);
          }
        );

      // Cleanup function
      return unsubscribeFromGeneratedRecipes;
    }
  }, [user]);

  async function unsaveRecipeFromCurrentUser(
    collectionPath,
    documentId,
    dataType
  ) {
    selectedMeal.isSaved = false;
    try {
      await FirestoreService.deleteDocument(
        collectionPath,
        documentId,
        dataType
      );
      setGeneratedRecipes(
        generatedRecipes.filter((recipe) => recipe.id !== documentId)
      );
      console.log("deleted: ", documentId); // Change recipe.id to documentId
    } catch (error) {
      console.error("Error deleting the document:", error);
    }
  }

  const buttonOptions = (
    <>
      <Button
        color="primary"
        onClick={() => {
          unsaveRecipeFromCurrentUser(
            `Users/${user.uid}/generatedRecipes/`,
            String(selectedMeal.id),
            "gptResponse"
          );
          setSelectedMeal(null);
        }}
      >
        Unsave recipe
      </Button>
      <Button color="secondary" onClick={() => setSelectedMeal(null)}>
        Cancel
      </Button>
    </>
  );

  return (
    <ListGroup className="user-recipe-viewer-list-group">
      {selectedMeal && (
        <RecipeDetails
          meal={selectedMeal}
          isOpen={selectedMeal !== null}
          toggle={() => setSelectedMeal(null)}
          buttonOptions={buttonOptions}
        />
      )}
      {generatedRecipes.length === 0 ? (
        <EmptyCollectionMessage collectionName="Generated Recipes" />
      ) : (
        generatedRecipes.map((recipe, key) => {
          return (
            <ListGroupItem
              action
              onClick={() => setSelectedMeal(recipe)}
              key={key}
            >
              {recipe.name}
            </ListGroupItem>
          );
        })
      )}
    </ListGroup>
  );
};

export default GeneratedMeals;
