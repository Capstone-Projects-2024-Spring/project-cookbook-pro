import React, { useState, useEffect } from "react";
import DisplayGoals from "./components/DisplayGoals.jsx";
import MacroGoalForm from "./components/MacroGoalForm.jsx";
import { useAuth } from "../../utils/AuthContext.js";
import FirestoreListener from "../../firebase/FirestoreListener.js";
import MealDataManager from "../../utils/MealDataManager.js";

const Health = ({ recipes }) => {
  const { user } = useAuth();
  const firestoreListener = new FirestoreListener();
  const mealDataManager = new MealDataManager();

  const [showGoals, setShowGoals] = useState(true);
  const [recipeDetails, setRecipeDetails] = useState({});
  const [buttonClicked, setButtonClicked] = useState(false);
  const [totalMacros, setTotalMacros] = useState({
    calories: 0,
    carbohydrates: 0,
    protein: 0,
    sugar: 0,
    fat: 0,
  });

  console.log(recipes);

  useEffect(() => {
    if (user) {
      const path = `Users/${user.uid}/Health/${user.uid}.HealthGoals`;
      const callback = (snapshot) => {
        if (snapshot.exists()) {
          setShowGoals(true);
        } else {
          setShowGoals(false);
        }
      };

      firestoreListener.subscribeToDocument(path, callback);

      return () => {
        firestoreListener.unsubscribe();
      };
    }
  }, []);

  const fetchAllRecipeDetails = async () => {
    const updateTotalMacros = (recipeDetails) => {
      setTotalMacros((prevTotalMacros) => ({
        calories: prevTotalMacros.calories + recipeDetails.calories,
        carbohydrates:
          prevTotalMacros.carbohydrates + recipeDetails.carbohydrates,
        protein: prevTotalMacros.protein + recipeDetails.protein,
        sugar: prevTotalMacros.sugar + recipeDetails.sugar,
        fat: prevTotalMacros.fat + recipeDetails.fat,
      }));
    };

    try {
      setButtonClicked(true);
      for (const recipe of recipes) {
        const recipeDetails = await mealDataManager.fetchRecipeDetails(
          recipe.id
        );
        updateTotalMacros(recipeDetails);
      }
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  return (
    <div>
      {showGoals ? (
        <div>
          <DisplayGoals onEdit={() => setShowGoals(false)} />
        </div>
      ) : (
        <div>
          <MacroGoalForm onSubmit={() => setShowGoals(true)} />
        </div>
      )}
      <br />
      <br />
      <br />
      <br />
      <div>
        <button onClick={fetchAllRecipeDetails} disabled={buttonClicked}>
          Get your Recipe's Macros
        </button>
      </div>
      <br />
      {/* Display total macros */}
      <div>
        <h3>Total Macros:</h3>
        <p>Calories: {totalMacros.calories}</p>
        <p>Carbohydrates: {totalMacros.carbohydrates}</p>
        <p>Protein: {totalMacros.protein}</p>
        <p>Sugar: {totalMacros.sugar}</p>
        <p>Fat: {totalMacros.fat}</p>
      </div>
    </div>
  );
};

export default Health;
