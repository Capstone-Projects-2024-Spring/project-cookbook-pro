import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
} from "reactstrap";
import RecipeDetails from "../RecipeDetails.jsx";
import FirestoreService from "../../firebase/FirebaseService.js";
import { useAuth } from "../../utils/AuthContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faCartShopping,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const MealCard = ({ meal }) => {
  //selected meal is initally set to null
  const [selectedMeal, setSelectedMeal] = useState(null);
  const { user } = useAuth();
  const [isClicked, setIsClicked] = useState(false);
  const [isSavedClicked, setIsSavedClicked] = useState(false);

  async function saveData(collectionPath, documentId, data, dataType) {
    const savedMeal = meal;
    savedMeal.isSaved = true;
    //savedMeal.instructions kept showing up as null, preventing the recipes from being saved
    if (savedMeal.instructions === undefined) {
      savedMeal.instructions = "";
    }

    // Build the path here with the context provided by the current user
    try {
      await FirestoreService.createDocument(
        collectionPath,
        documentId,
        data,
        dataType
      );
    } catch (error) {
      console.error("Error creating document:", error);
    }
  }

  const cartClick = () => {
    setIsClicked(true);
  };

  const savedClick = () => {
    setIsSavedClicked(true);
  };

  const width = { width: "18rem" };
  const height = { wh: "18rem" };


  const cardStyle = {
    border: "2px outset #FFA6A6",
  };

  const minWidth = { minWidth: "20rem"};

  //button options for RecipeDetails
  const buttonOptions = (
    <>
      {user && (
        <Button
          color="primary"
          onClick={() => {
            saveData(
              `Users/${user.uid}/SavedRecipes/`,
              String(meal.id),
              meal,
              "recipe"
            );
            setSelectedMeal(null); //setting selected meal = null closes the RecipeDetails component
          }}
        >
          Save Recipe
        </Button>
      )}
      <Button
        color="secondary"
        onClick={() => setSelectedMeal(null)} //setting selected meal = null closes the RecipeDetails component
      >
        Close
      </Button>
    </>
  );

  return (
    <Card
      className={"card-color m-2 p-3 flex-fill shadow-sm"}
      style={Object.assign(width, cardStyle, minWidth)}
    >
      <CardTitle>
        <h5 className="meal-title text-truncate m-2 p-0">{meal.name}</h5>
      </CardTitle>
      <CardImg
        className="m-0 imageBorder"
        src={meal.image}
        alt={`${meal.name} image`}
      />
      <CardBody>
        <Button
          className="secondary-color card-button"
          onClick={() => {
            setSelectedMeal({ ...meal });
          }}
        >
          Details
        </Button>
        {
          selectedMeal && (
            <RecipeDetails
              meal={selectedMeal}
              buttonOptions={buttonOptions}
              isOpen={selectedMeal !== null}
            />
          ) /* if selectedMeal is not null, render the RecipeDetails component */
        }
        {user && (
          <>
            <Button
              className={`thirdary-color card-button ${isSavedClicked ? "clicked" : ""}`}
              onClick={() => {
                savedClick();
                saveData(
                  `Users/${user.uid}/SavedRecipes/`,
                  String(meal.id),
                  meal,
                  "recipe"
                );
              }}
              style={{ width: "3.6rem" }}
            >
              <div>
                <span class="add-to-saved">Save</span>
                <span class="saved">Saved</span>
                <FontAwesomeIcon icon={faCheck} />
              </div>
            </Button>

            <Button
              className={`primary-color card-button ${isClicked ? "clicked" : ""}`}
              onClick={() => {
                cartClick();
                saveData(
                  `Users/${user.uid}/Cart/`,
                  String(meal.id),
                  meal,
                  "recipe"
                );
              }}
              style={{ width: "7rem" }}
            >
              <div>
                <span class="add-to-cart">Add to Cart</span>
                <span class="added">Added</span>
                <FontAwesomeIcon icon={faCartShopping} />
                <FontAwesomeIcon icon={faBox} />
              </div>
            </Button>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default MealCard;
