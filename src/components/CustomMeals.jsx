import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem, Button } from "reactstrap";
import RecipeDetails from "./RecipeDetails.jsx";
import { useAuth } from "../utils/AuthContext.js";
import FirestoreService from "../firebase/FirebaseService.js";
import FirestoreListener from "../firebase/FirestoreListener.js";

const CustomMeals = () => {
  const [savedRecipes, setSavedRecipes] = useState([""]);
  const [showDetails, setShowDetails] = useState(false);
  const [meal, setMeal] = useState();

  const { user } = useAuth();
  const firestoreListener = new FirestoreListener();

  const toggle = (recipe) => {
    setMeal(recipe);
    setShowDetails(!showDetails);
  };

  useEffect(() => {
    const userSavedRecipesPath = `Users/${user.uid}/CustomRecipes`;

    const unsubscribeCustomRecipes = firestoreListener.subscribeToCollection(
      userSavedRecipesPath,
      (docs) => {
        const recipes = docs.map((doc) => doc);
        setSavedRecipes(recipes);
      }
    );

    // Cleanup function
    return unsubscribeCustomRecipes;
  }, [user.uid]);

  async function unsaveRecipeFromCurrentUser(
    collectionPath,
    documentId,
    dataType
  ) {
    meal.isSaved = false;
    try {
      await FirestoreService.deleteDocument(
        collectionPath,
        documentId,
        dataType
      );
    } catch (error) {
      console.error("Error deleting the document:", error);
    }
  }

  let recipeDetails;

  const buttonOptions = (
    <>
      <Button
        color="primary"
        onClick={() => {
          unsaveRecipeFromCurrentUser(
            `Users/${user.uid}/CustomRecipes/`,
            String(meal.id),
            "recipe"
          );
          //close the modal and remove the recipe
          toggle();
        }}
      >
        Unsave recipe
      </Button>
      <Button color="secondary" onClick={toggle}>
        Cancel
      </Button>
    </>
  );

  if (showDetails) {
    recipeDetails = (
      <RecipeDetails
        meal={meal}
        showDetails={showDetails}
        toggle={toggle}
        buttonOptions={buttonOptions}
      />
    );
  }

  return (
    <ListGroup>
      {recipeDetails}
      {savedRecipes.map((recipe, key) => {
        return (
          <ListGroupItem action onClick={() => toggle(recipe)} key={key}>
            {recipe.name}
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
};

export default CustomMeals;
