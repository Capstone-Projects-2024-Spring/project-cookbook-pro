import React, { useState, useEffect, useContext } from "react";
import { ListGroup, ListGroupItem, Button } from "reactstrap";
import RecipeDetails from "../RecipeDetails.jsx";
import { useAuth } from "../../utils/AuthContext.js";
import FirestoreService from "../../firebase/FirebaseService.js";
import EmptyCollectionMessage from "./EmptyCollectionMessage.jsx";
import FirestoreListener from "../../firebase/FirestoreListener.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faCartShopping,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { UserDataViewerContext } from "./UserDataViewerContext";

const UserDataViewerItems = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const { user } = useAuth();
  const firestoreListener = new FirestoreListener();
  const { currentCollection } = useContext(UserDataViewerContext);

  useEffect(() => {
    if (user) {
      let userRecipesPath;

      if (currentCollection === "custom") {
        userRecipesPath = `Users/${user.uid}/CustomRecipes`;
      } else if (currentCollection === "saved") {
        userRecipesPath = `Users/${user.uid}/SavedRecipes`;
      } else if (currentCollection === "generated") {
        userRecipesPath = `Users/${user.uid}/generatedRecipes`;
      }

      const unsubscribeFromRecipes = firestoreListener.subscribeToCollection(
        userRecipesPath,
        (docs) => {
          const fetchedRecipes = docs.map((doc) => doc);
          setRecipes(fetchedRecipes);
        }
      );

      return unsubscribeFromRecipes;
    }
  }, [user, currentCollection]);

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
      setRecipes(recipes.filter((recipe) => recipe.id !== documentId));
    } catch (error) {
      console.error("Error deleting the document:", error);
    }
  }

  async function saveData(collectionPath, documentId, data, dataType) {
    const savedMeal = data;
    savedMeal.isSaved = true;
    if (savedMeal.instructions === undefined) {
      savedMeal.instructions = "";
    }

    try {
      await FirestoreService.createDocument(
        collectionPath,
        documentId,
        savedMeal,
        dataType
      );
    } catch (error) {
      console.error("Error creating document:", error);
    }
  }

  const buttonOptions = ({ isClicked, cartClick, saveData }) => (
    <>
      <Button
        color="primary"
        onClick={() => {
          let collectionPath;
          if (currentCollection === "custom") {
            collectionPath = `Users/${user.uid}/CustomRecipes/`;
          } else if (currentCollection === "saved") {
            collectionPath = `Users/${user.uid}/SavedRecipes/`;
          } else if (currentCollection === "generated") {
            collectionPath = `Users/${user.uid}/generatedRecipes/`;
          }

          unsaveRecipeFromCurrentUser(
            collectionPath,
            String(selectedMeal.id),
            currentCollection === "generated" ? "gptResponse" : "recipe"
          );
          setSelectedMeal(null);
        }}
      >
        Unsave recipe
      </Button>
      <Button
        className={`primary-color card-button ${isClicked ? "clicked" : ""}`}
        onClick={() => {
          cartClick();
          const sanitizedMeal =
            currentCollection === "generated"
              ? {
                  cuisine: selectedMeal.cuisine,
                  dishType: selectedMeal.dishType,
                  id: selectedMeal.id,
                  image: selectedMeal.image || "",
                  ingredients: selectedMeal.ingredients,
                  instructions: selectedMeal.instructions,
                  name: selectedMeal.name,
                  servings: selectedMeal.servings,
                  summary: selectedMeal.summary,
                  isSaved: selectedMeal.isSaved,
                }
              : selectedMeal;
          saveData(
            `Users/${user.uid}/Cart/`,
            String(sanitizedMeal.id),
            sanitizedMeal,
            "recipe"
          );
        }}
        style={{ width: "7rem" }}
      >
        <div>
          <span className="add-to-cart">Add to Cart</span>
          <span className="added">Added</span>
          <FontAwesomeIcon icon={faCartShopping} />
          <FontAwesomeIcon icon={faBox} />
        </div>
      </Button>
      <Button color="secondary" onClick={() => setSelectedMeal(null)}>
        Close
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
          saveData={saveData}
        />
      )}
      {recipes.length === 0 ? (
        <EmptyCollectionMessage
          collectionName={`${
            currentCollection.charAt(0).toUpperCase() +
            currentCollection.slice(1)
          } Recipes`}
          href={
            currentCollection === "saved"
              ? "/search"
              : currentCollection === "custom"
              ? "/create-recipe"
              : "/recommendations"
          }
        />
      ) : (
        recipes.map((recipe, key) => (
          <ListGroupItem
            action
            onClick={() => setSelectedMeal(recipe)}
            key={key}
          >
            {recipe.name}
          </ListGroupItem>
        ))
      )}
    </ListGroup>
  );
};

export default UserDataViewerItems;
