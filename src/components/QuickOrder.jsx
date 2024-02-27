import React, { useState, useEffect } from "react";
import getListener from "../firebase/setListener.js";
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  Button,
  Input,
} from "reactstrap";

import deleteRecipe from "../firebase/deleteRecipe";
import { Ingredient } from "../customObjects/Ingredient.js";

/**
 * React component representing the Quick Order functionality.
 * @component
 */
const quickOrder = () => {
  /**
   * State hook for storing the list of saved recipes.
   * @type {Array}
   */
  const [savedRecipes, setSavedRecipes] = useState([""]);

  /**
   * State hook for controlling the display of recipe details.
   * @type {boolean}
   */
  const [showDetails, setShowDetails] = useState(false);

  /**
   * State hook for storing the selected meal.
   * @type {Object}
   */
  const [meal, setMeal] = useState();

  /**
   * State hook for storing the user's email.
   * @type {string}
   */
  const [email, setEmail] = useState("");

  /**
   * Subject for the email.
   * @type {string}
   */
  const subject = "Your CookBook Pro shopping list";

  /**
   * Function to generate a mailto link for the email button.
   * @function
   * @returns {string} - Mailto link.
   */
  const mailLinkGenerator = () => {
    let body = "";
    if (savedRecipes != "") {
      let recipeList = "";
      const ingredientMap = new Map();
      savedRecipes.forEach((recipe, index) => {
        recipeList += `%0D%0A${index + 1}: ${recipe.name}`;
        recipe.ingredients.forEach((ingredient) => {
          const newIngredient = new Ingredient(
            ingredient.amount,
            ingredient.id,
            ingredient.name,
            ingredient.unit
          );

          if (ingredientMap.has(newIngredient.id)) {
            const existingIngredient = ingredientMap.get(newIngredient.id);
            existingIngredient.amount += newIngredient.amount;
          } else {
            ingredientMap.set(newIngredient.id, newIngredient);
          }
        });
      });
      body += `This Week's Meals:${recipeList}%0D%0A`;
      body += `%0D%0AIngredients:%0D%0A`;
      ingredientMap.forEach(
        (ingredient) =>
          (body += `[  ] ${ingredient.amount} ${ingredient.unit} ${ingredient.name}\n%0D%0A`)
      );
      body += "%0D%0A";
    }
    return (
      "https://mail.google.com/mail/?view=cm&fs=1&to=" +
      email +
      "&su=" +
      subject +
      "&body=" +
      body
    );
  };

  /**
   * Event handler for input change in the email input field.
   * @function
   * @param {Object} e - Event object.
   */
  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  /**
   * Toggle function to show/hide recipe details.
   * @function
   * @param {Object} recipe - Selected recipe.
   */
  const toggle = (recipe) => {
    setMeal(recipe);
    setShowDetails(!showDetails);
  };

  /**
   * useEffect hook to fetch the listener when the component mounts.
   */
  useEffect(() => {
    /**
     * Function to unsubscribe from the listener.
     * @type {Function}
     */
    const unsubscibe = getListener("quickOrder", setSavedRecipes);
  }, []);

  /**
   * Variable to store button options for the recipe details.
   * @type {JSX.Element}
   */
  let recipeDetails;

  /**
   * Button options JSX for removing a recipe from order.
   * @type {JSX.Element}
   */
  const buttonOptions = (
    <Button
      onClick={() => {
        toggle();
        deleteRecipe("quickOrder", String(meal.id));
      }}
    >
      Remove from order
    </Button>
  );

  /**
   * Conditionally render RecipeDetails component if showDetails is true.
   * @type {JSX.Element|null}
   */
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
   * Render the Quick Order component.
   * @returns {JSX.Element} - Quick Order component JSX.
   */
  return (
    <>
      {recipeDetails}
      <ListGroup>
        <ListGroupItemHeading>Quick Order</ListGroupItemHeading>

        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleInputChange}
          required
        />

        <Button
          target="_blank"
          rel="noopener noreferrer"
          href={mailLinkGenerator()}
        >
          send an email to {email}
        </Button>

        {savedRecipes.map((recipe, key) => {
          return (
            <ListGroupItem action onClick={() => toggle(recipe)} key={key}>
              {recipe.name}
            </ListGroupItem>
          );
        })}
      </ListGroup>
    </>
  );
};

export default quickOrder;
