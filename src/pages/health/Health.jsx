import React, { useState, useEffect } from "react";
import DisplayGoals from "./components/DisplayGoals.jsx";
import MacroGoalForm from "./components/MacroGoalForm.jsx";
import { useAuth } from "../../utils/AuthContext.js";
import FirestoreListener from "../../firebase/FirestoreListener.js";
import MealDataManager from "../../utils/MealDataManager.js";
import { NutritionResults } from "../../customObjects/NutritionResults.js";

const Health = ({ recipes }) => {
  const { user } = useAuth();
  const firestoreListener = new FirestoreListener();
  const mealDataManager = new MealDataManager();

  const [showGoals, setShowGoals] = useState(true);
  const [totalNutrients, setTotalNutrients] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sugar: 0,
  });

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

  
  const handleNutritionWidget = (id) => {
    const apiKey = "c70a0f5d5e1f4e18bb55c4bfbc94ab1c";

    fetch(
      `https://api.spoonacular.com/recipes/${id}/nutritionWidget.json?apiKey=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Handle the data from the API response
        const nutrientValues = data.nutrients.map((nutrient) => nutrient.amount);

        // Update the total nutrients
        setTotalNutrients((prevTotal) => ({
          calories: prevTotal.calories + nutrientValues[0],
          protein: prevTotal.protein + nutrientValues[1],
          carbs: prevTotal.carbs + nutrientValues[2],
          fat: prevTotal.fat + nutrientValues[3],
          sugar: prevTotal.sugar + nutrientValues[4],
        }));
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    // Calculate the total nutrients when the component mounts
    recipes.forEach((recipe) => {
      handleNutritionWidget(recipe.id);
    });
  }, []); 



  // const handleNutritionWidget = (recipeId) => {
  //   mealDataManager
  //     .getRecipeDetailsById(recipeId)
  //     .then((recipe) => {

  //       console.log(recipe.nutrition);
  //     })
  //     .catch((error) => {
  //       // Handle any errors
  //       console.error("Error:", error);
  //     });
  // };

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
        {/* Display total nutrients */}
        {totalNutrients && (
        <div>
          <h3>Total Nutrients:</h3>
          <p>Calories: {totalNutrients.calories}</p>
          <p>Protein: {totalNutrients.protein}</p>
          <p>Carbs: {totalNutrients.carbs}</p>
          <p>Fat: {totalNutrients.fat}</p>
          <p>Sugar: {totalNutrients.sugar}</p>
        </div>
      )}
    </div>
  );
};

export default Health;
