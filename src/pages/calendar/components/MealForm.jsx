import React, { useState, useEffect } from "react";
import "../calendarStyle.css";
import FirestoreListener from "../../../firebase/FirestoreListener.js";
import { useAuth } from "../../../utils/AuthContext.js";

const MealForm = ({ selectedDay, addPlan, closeModal }) => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const { user } = useAuth();
  const firestoreListener = new FirestoreListener();

  useEffect(() => {
    const userSavedRecipesPath = `Users/${user.uid}/SavedRecipes`;

    const unsubscribeFromSavedRecipes = firestoreListener.subscribeToCollection(
      userSavedRecipesPath,
      (docs) => {
        const recipes = docs.map((doc) => doc);
        setSavedRecipes(recipes);
      },
    );

    return () => {
      firestoreListener.stopListening();
    };
  }, [user.uid]);

  const handleAddPlan = (event, recipe) => {
    addPlan(recipe, "false", "1");
    closeModal();
  };

  return (
    <div className="meal-form-container">
      <button type="button" onClick={closeModal} className="exit-button">
        X
      </button>
      <p>Select from your saved recipes.</p>
        <div>
          {savedRecipes.map((recipe, index) => (
            <div key={index} className="meal-entry">
              <img src={recipe.image} alt={""} />
              <p>{recipe.name}</p>
              <button onClick={(event) => handleAddPlan(event, recipe)}>
                Add
              </button>
            </div>
          ))}
        </div>
    </div>
  );
};

export default MealForm;
