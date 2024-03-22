import React from "react";
import RecipeCreationForm from "./components/RecipeCreationForm";
import UserRecipesViewer from "../../components/UserRecipesViewer";

const CreateRecipe = () => {
  return (
    <div className="recipe-creation-page">
      <div className="saved-meals-container">
        <UserRecipesViewer />
      </div>
      <RecipeCreationForm />
    </div>
  );
};

export default CreateRecipe;
