import React, { useState } from "react";
import RecipeCreationForm from "./components/RecipeCreationForm";
import IngredientSearch from "./components/IngredientSearch";
import CheeserSearchComponent from "./components/CheeserSearchComponent";

const CreateRecipes = () => {
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const handleIngredientSelect = (ingredient) => {
    setSelectedIngredient(ingredient);
    // You can do something with the selected ingredient here
  };

  return (
    <div id="recipe-creation-page">
      <RecipeCreationForm
        selectedIngredient={selectedIngredient}
        handleIngredientSelect={handleIngredientSelect}
      />
      <IngredientSearch selectedIngredient={selectedIngredient} />
      <CheeserSearchComponent onIngredientSelect={handleIngredientSelect} />
      {selectedIngredient && (
        <div>
          Selected ingredient: {selectedIngredient.name} (ID:{" "}
          {selectedIngredient.id})
        </div>
      )}
    </div>
  );
};

export default CreateRecipes;
