import React, { useState, useEffect } from "react";
import { useAuth } from "../../../utils/AuthContext.js";
import { Recipe } from "../../../customObjects/Recipe.js";
import { Ingredient } from "../../../customObjects/Ingredient.js";
import FirestoreService from "../../../firebase/FirebaseService.js";
import MappedInputFieldsForm from "./MappedInputFieldsForm.jsx";

const RecipeCreationForm = ({ selectedIngredient }) => {
  const [recipeFormData, setRecipeFormData] = useState({});
  const [ingredients, setIngredients] = useState([
    {
      amount: "",
      id: Date.now(),
      name: "",
      unit: "",
    },
  ]);
  const [selectedIngredientData, setSelectedIngredientData] = useState(null);

  useEffect(() => {
    if (selectedIngredient) {
      // Check if the selectedIngredient already exists in the ingredients array
      const existingIngredient = ingredients.find(
        (ingredient) => ingredient.id === selectedIngredient.id
      );

      if (existingIngredient) {
        // If the selectedIngredient already exists, update its properties
        setIngredients((prevIngredients) =>
          prevIngredients.map((ingredient) =>
            ingredient.id === selectedIngredient.id
              ? selectedIngredient
              : ingredient
          )
        );
      } else {
        // If the selectedIngredient doesn't exist, add it to the ingredients array
        setIngredients((prevIngredients) => [
          ...prevIngredients,
          selectedIngredient,
        ]);
      }
    }
  }, [selectedIngredient]);

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
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.id === id ? formData : ingredient
      )
    );
  };

  const addIngredient = () => {
    const newIngredient = {
      amount: "",
      id: Date.now(),
      name: "",
      unit: "",
    };
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
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
    //prevents user from submitted recipe if they're not logged in
    if (!user) {
      alert("Please log in to submit a recipe.");
      return;
    }
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
              fields={ingredientFields.map((field) =>
                field.name === "id" && ingredient.id === Date.now()
                  ? { ...field, disabled: true }
                  : field
              )}
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
            {/* Only render the "Remove Ingredient" button if there is more than one ingredient 
                or, if the current ingredient is not the initial empty ingredient */}
            {(ingredients.length > 1 ||
              ingredient.id !== ingredients[0].id) && (
              <button
                type="button"
                onClick={() => removeIngredient(ingredient.id)}
              >
                Remove Ingredient
              </button>
            )}
          </div>
        ))}
        {selectedIngredientData && (
          <div id="selected-ingredient-container">
            <h3>Selected Ingredient</h3>
            <MappedInputFieldsForm
              fields={ingredientFields}
              formData={selectedIngredientData}
              onChange={(e) =>
                setSelectedIngredientData({
                  ...selectedIngredientData,
                  [e.target.name]: e.target.value,
                })
              }
              onSubmit={() => {
                if (!selectedIngredientData.id) {
                  // If selectedIngredientData doesn't have an ID, it means it's a new ingredient
                  addIngredient(selectedIngredientData);
                } else {
                  // Otherwise, it's an existing ingredient, so submit the changes
                  handleIngredientSubmit(
                    selectedIngredientData,
                    selectedIngredientData.id
                  );
                }
              }}
            />
          </div>
        )}
        <button type="button" onClick={addIngredient}>
          Add New Ingredient
        </button>
      </div>
    </div>
  );
};

export default RecipeCreationForm;
