import React, { useState } from "react";
import { useAuth } from "../../../utils/AuthContext.js";
import { Recipe } from "../../../customObjects/Recipe.js";
import { Ingredient } from "../../../customObjects/Ingredient.js";
import FirestoreService from "../../../firebase/FirebaseService.js";
import MappedInputFieldsForm from "./MappedInputFieldsForm.jsx";

const RecipeCreationForm = () => {
  const [recipeFormData, setRecipeFormData] = useState({});
  const [ingredients, setIngredients] = useState([{ id: Date.now() }]);
  const recipeFields = [
    {
      name: "cuisine",
      label: "Cuisine",
      type: "text",
      placeholder: "Enter cuisine type",
    },
    {
      name: "dishType",
      label: "Dish Type",
      type: "text",
      placeholder: "Enter dish type",
    },
    { name: "id", label: "ID", type: "text", placeholder: "Enter recipe ID" },
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter recipe name",
    },
    {
      name: "servings",
      label: "Servings",
      type: "number",
      placeholder: "Enter number of servings",
    },
    {
      name: "summary",
      label: "Summary",
      type: "textarea",
      placeholder: "Enter recipe summary",
    },
  ];
  const ingredientFields = [
    {
      name: "amount",
      label: "Amount",
      type: "text",
      placeholder: "Enter amount",
    },
    {
      name: "id",
      label: "ID",
      type: "text",
      placeholder: "Enter ingredient ID",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter ingredient name",
    },
    { name: "unit", label: "Unit", type: "text", placeholder: "Enter unit" },
  ];

  const { user } = useAuth();

  const handleIngredientSubmit = (formData, id) => {
    console.log("Ingredient Form Data:", formData);
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.id === id ? formData : ingredient
      )
    );
  };

  const addIngredient = () => {
    setIngredients((prevIngredients) => [
      ...prevIngredients,
      { id: Date.now() },
    ]);
  };

  const removeIngredient = (id) => {
    if (ingredients.length === 1) {
      // Display an alert or message to the user
      alert("You must have at least one ingredient for the recipe.");
      return;
    }

    setIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== id)
    );
  };

  async function handleSubmitRecipe() {
    const ingredientObjects = ingredients.map(
      (ingredient) =>
        new Ingredient(
          ingredient.amount,
          ingredient.id,
          ingredient.name,
          ingredient.unit
        )
    );

    const recipeObject = new Recipe(
      recipeFormData.cuisine,
      recipeFormData.dishType,
      recipeFormData.id,
      "", // image is an empty string for now
      ingredientObjects,
      [], // instructions is an empty array for now
      recipeFormData.name,
      recipeFormData.servings,
      recipeFormData.summary
    );

    // Write the new Recipe to the User's CustomRecipes collection
    console.log("Recipe Object:", recipeObject);

    const collectionPath = `Users/${user.uid}/CustomRecipes`;
    const documentId = recipeObject.id;
    const dataType = "recipe";
    try {
      await FirestoreService.createDocument(
        collectionPath,
        documentId,
        recipeObject,
        dataType
      );
    } catch (error) {
      console.error("Error creating document:", error);
    }
  }

  return (
    <div className="recipe-creation-container">
      <div id="recipe-container">
        Recipe Container
        <MappedInputFieldsForm
          fields={recipeFields}
          formData={recipeFormData}
          onChange={(e) =>
            setRecipeFormData({
              ...recipeFormData,
              [e.target.name]: e.target.value,
            })
          }
        />
        <button type="button" onClick={handleSubmitRecipe}>
          Submit Recipe
        </button>
      </div>
      <div id="ingredient-container">
        Ingredients Container
        {ingredients.map((ingredient, index) => (
          <div key={index}>
            <MappedInputFieldsForm
              fields={ingredientFields}
              formData={ingredient}
              onChange={(e) =>
                setIngredients((prevIngredients) =>
                  prevIngredients.map((prevIngredient, i) =>
                    i === index
                      ? { ...prevIngredient, [e.target.name]: e.target.value }
                      : prevIngredient
                  )
                )
              }
              onSubmit={handleIngredientSubmit}
            />
            {/* Only render the "Remove Ingredient" button if there is more than one ingredient */}
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredient(ingredient.id)}
              >
                Remove Ingredient
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addIngredient}>
          Add New Ingredient
        </button>
      </div>
    </div>
  );
};

export default RecipeCreationForm;
