import React, { useState, useEffect } from "react";
import getListener from "../firebase/setListener.js";
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  Button,
} from "reactstrap";

import RecipeDetails from "./RecipeDetails";
import deleteRecipe from "../firebase/deleteRecipe.js";

/**
 * React component for displaying saved meals.
 * @component
 * @returns {JSX.Element} JSX element representing the saved meals component.
 */
const SavedMeals = () => {
  /**
   * State for storing the saved recipes.
   * @type {Array.<string>}
   */
  const [savedRecipes, setSavedRecipes] = useState([""]);

  /**
   * State for managing the visibility of recipe details modal.
   * @type {boolean}
   */
  const [showDetails, setShowDetails] = useState(false);

  /**
   * State for storing the currently selected meal for details display.
   * @type {Object|undefined}
   */
  const [meal, setMeal] = useState();

  /**
   * Toggles the visibility of the recipe details modal.
   * @param {Object} recipe - The selected recipe.
   */
  const toggle = (recipe) => {
    setMeal(recipe);
    setShowDetails(!showDetails);
  };

  /**
   * Effect hook to set up a listener for saved recipes when the component mounts.
   */
  useEffect(() => {
    /**
     * Function to unsubscribe from the saved recipes listener.
     * @function
     */
    const unsubscribe = getListener("savedRecipes", setSavedRecipes);

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Removes the saved recipe and closes the modal.
   */
  function unsaveRecipe() {
    meal.isSaved = false;
    // Close the modal and remove the recipe
    toggle();
    deleteRecipe("savedRecipes", String(meal.id));
  }

  /**
   * JSX element representing the buttons for recipe actions.
   * @type {JSX.Element}
   */
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

  /**
   * JSX element representing the recipe details component.
   * @type {JSX.Element|undefined}
   */
  let recipeDetails;

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

  /**
   * JSX element representing the list of saved recipes.
   * @type {JSX.Element}
   */
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

export default SavedMeals;
