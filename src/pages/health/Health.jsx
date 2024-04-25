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

  // const handleNutritionWidget = (id) => {
  //   mealDataManager
  //     .getRecipeNutritionById(id)
  //     .then((data) => {
  //       // API response
  //       console.log(data);
  //     })
  //     .catch((error) => {
  //       // Error Handling
  //       console.error("Error:", error);
  //     });
  // };

  const handleNutritionWidget = (id) => {
    const apiKey = 'c70a0f5d5e1f4e18bb55c4bfbc94ab1c'; // Replace 'YOUR_API_KEY_HERE' with your actual API key
    fetch(`https://api.spoonacular.com/recipes/${id}/nutritionWidget.json?apiKey=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        // Handle the data from the API response
        console.log(data);
      })
      .catch(error => {
        // Handle any errors
        console.error('Error:', error);
      });
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
      <div id="display-nutrition">
        <h3>Recipes:</h3>
        {recipes.map((recipe, index) => (
          <div key={index}>
            <p>Recipe Name: {recipe.name}</p>
            <p>Recipe ID: {recipe.id}</p>
            {/* Display other recipe details */}
            <button onClick={() => handleNutritionWidget(recipe.id)}>
              View Nutrition
            </button>
          </div>
        ))}
      </div>
      <br />
    </div>
  );
};

export default Health;
