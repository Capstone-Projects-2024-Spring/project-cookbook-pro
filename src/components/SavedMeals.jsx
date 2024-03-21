import React, { useState, useEffect } from "react";
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  Button,
} from "reactstrap";
import RecipeDetails from "./RecipeDetails";
import { useAuth } from "../utils/AuthContext";
import FirestoreService from "../firebase/FirebaseService.js";
import FirestoreListener from "../firebase/FirestoreListener.js";

const savedMeals = () => {
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
    const userSavedRecipesPath = `Users/${user.uid}/SavedRecipes`;

    const unsubscribeFromSavedRecipes = firestoreListener.subscribeToCollection(
      userSavedRecipesPath,
      (docs) => {
        const recipes = docs.map((doc) => doc);
        setSavedRecipes(recipes);
      }
    );

    // Cleanup function
    return unsubscribeFromSavedRecipes;
  }, [user.uid]);

  async function unsaveRecipe() {
    meal.isSaved = false;
    //close the modal and remove the recipe
    toggle();
    try {
      const collectionPath = `Users/${user.uid}/SavedRecipes/`;
      await FirestoreService.deleteDocument(
        collectionPath,
        String(meal.id),
        "recipe"
      );
    } catch (error) {
      console.error("Error deleting the document:", error);
    }
  }

  let recipeDetails;

  const buttonOptions = (
    <>
      <Button color="primary" onClick={unsaveRecipe}>
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
      <ListGroupItemHeading>My Recipes</ListGroupItemHeading>
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
 
export default savedMeals;
