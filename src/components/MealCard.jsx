import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
} from "reactstrap";
import RecipeDetails from "./RecipeDetails";
import PutRecipe from "../firebase/putRecipe.js";

/**
 * Functional component representing a meal card.
 *
 * @component
 * @param {Object} props - React component properties.
 * @param {Object} props.meal - The meal object to display on the card.
 */
const MealCard = ({ meal }) => {
  /**
   * State hook to manage the visibility of recipe details modal.
   * @type {[boolean, Function]}
   */
  const [showDetails, setShowDetails] = useState(false);

  /**
   * Toggles the visibility of recipe details modal.
   */
  const toggle = () => {
    setShowDetails(!showDetails);
  };

  /**
   * Saves the meal recipe into the user's data and closes the modal.
   */
  function saveData() {
    /*
        TODO: save recipe into user's data
        TODO: also refactor to remove showDetails and replace the toggle function
        they are extra and we can achieve the same functionality by checking if meal is null or not
    */
    const savedMeal = meal;
    savedMeal.isSaved = true;
    PutRecipe("savedRecipes", savedMeal);
    toggle(); //close modal
  }

  /**
   * Style object for the card width.
   * @type {Object}
   */
  const width = { width: "18rem" };

  /**
   * Style object for the card border.
   * @type {Object}
   */
  const cardStyle = {
    border: "2px outset #FFA6A6",
  };

  /**
   * JSX for the buttons in the card.
   * @type {JSX.Element}
   */
  const buttonOptions = (
    <>
      <Button color="primary" onClick={saveData}>
        Save Recipe
      </Button>
      <Button color="secondary" onClick={toggle}>
        Close
      </Button>
    </>
  );

  /**
   * Renders the meal card component.
   * @returns {JSX.Element} - JSX for the meal card.
   */
  return (
    <Card
      className={"m-2 p-3 flex-fill shadow-sm"}
      style={Object.assign(width, cardStyle)}
    >
      <CardTitle>
        <h5 className="text-truncate m-2 p-0">{meal.name}</h5>
      </CardTitle>
      <CardImg
        className="m-0 border"
        src={meal.image}
        alt={`${meal.name} image`}
      />
      <CardBody>
        <CardText className="text-truncate m-2 p-0">
          {String(meal.summary).replace(/<[^>]*>/g, "")}
        </CardText>
        <Button color="primary" onClick={toggle}>
          Details
        </Button>
        <RecipeDetails
          meal={meal}
          showDetails={showDetails}
          toggle={toggle}
          buttonOptions={buttonOptions}
        />
        <Button onClick={() => PutRecipe("quickOrder", meal)}>
          Add to Quick Order
        </Button>
      </CardBody>
    </Card>
  );
};

export default MealCard;
