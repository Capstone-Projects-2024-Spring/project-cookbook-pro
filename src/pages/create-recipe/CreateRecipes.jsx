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
      <CheeserSearchComponent onIngredientSelect={handleIngredientSelect} />
      <IngredientSearch selectedIngredient={selectedIngredient} />
    </div>
  );
};

export default CreateRecipes;
