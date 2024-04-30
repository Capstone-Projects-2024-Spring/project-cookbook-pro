import React, { useState, useEffect, useContext } from "react";
import RecipeBox from "./components/RecipeBox.jsx";
import IngredientBox from "./components/IngredientBox.jsx";
import CheeserSearchComponent from "./components/CheeserSearchComponent.jsx";
import { useAuth } from "../../utils/AuthContext.js";
import { Recipe } from "../../customObjects/Recipe.js";
import { Ingredient } from "../../customObjects/Ingredient.js";
import FirestoreService from "../../firebase/FirebaseService.js";
import "./create-recipe.css";

const CreateRecipes = () => {
  const [recipeFormData, setRecipeFormData] = useState({
    servings: "1",
  });
  const [ingredients, setIngredients] = useState([
    {
      id: `i-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      amount: "1",
      name: "",
      unit: "",
    },
  ]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [invalidRecipeFields, setInvalidRecipeFields] = useState([]);
  const [invalidIngredientFields, setInvalidIngredientFields] = useState([]);

  const { user } = useAuth();

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

  const handleIngredientSelect = (ingredient) => {
    const updatedIngredient = {
      ...ingredient,
      amount: ingredient.amount || "1",
    };
    setSelectedIngredient(updatedIngredient);
  };

  const handleIngredientSubmit = (formData, id) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.id === id ? formData : ingredient
      )
    );
  };

  const addIngredient = () => {
    const newIngredient = {
      id: `i-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      amount: "1",
      name: "",
      unit: "",
    };
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
  };

  const removeIngredient = (id) => {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== id)
    );
  };

  const handleSubmitRecipe = async () => {
    if (!user) {
      alert("Please log in to submit a recipe.");
      return;
    }

    // Validate recipe form data
    const missingRecipeFields = [];
    if (!recipeFormData.cuisine) missingRecipeFields.push("cuisine");
    if (!recipeFormData.dishType) missingRecipeFields.push("dishType");
    if (!recipeFormData.name) missingRecipeFields.push("name");
    if (
      !recipeFormData.servings ||
      isNaN(recipeFormData.servings) ||
      parseInt(recipeFormData.servings) <= 0
    )
      missingRecipeFields.push("servings");
    if (!recipeFormData.summary) missingRecipeFields.push("summary");

    setInvalidRecipeFields(missingRecipeFields);

    // Validate ingredient data
    const missingIngredientFields = ingredients.reduce(
      (missing, ingredient, index) => {
        const missingFields = [];
        if (!ingredient.amount)
          missingFields.push(`ingredients[${index}].amount`);
        if (!ingredient.name) missingFields.push(`ingredients[${index}].name`);
        if (!ingredient.unit) missingFields.push(`ingredients[${index}].unit`);

        return [...missing, ...missingFields];
      },
      []
    );

    setInvalidIngredientFields(missingIngredientFields);

    if (
      missingRecipeFields.length === 0 &&
      missingIngredientFields.length === 0
    ) {
      const newRecipeId = `c-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const ingredientObjects = ingredients.map((ingredient) => {
        const ingredientId =
          ingredient.id ||
          `i-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        return new Ingredient(
          ingredient.amount,
          ingredientId,
          ingredient.name,
          ingredient.unit
        );
      });

      const recipeObject = new Recipe(
        recipeFormData.cuisine,
        recipeFormData.dishType,
        newRecipeId,
        "",
        ingredientObjects,
        [],
        recipeFormData.name,
        recipeFormData.servings,
        recipeFormData.summary
      );

      const collectionPath = `Users/${user.uid}/CustomRecipes`;
      const dataType = "recipe";

      try {
        await FirestoreService.createDocument(
          collectionPath,
          newRecipeId,
          recipeObject,
          dataType
        );

        // Reset the recipe creation
        setRecipeFormData({
          servings: "1",
        });

        setIngredients([
          {
            amount: "1",
            name: "",
            unit: "",
          },
        ]);

        setSelectedIngredient(null);

        alert("Custom Recipe created successfully!");
      } catch (error) {
        console.error("Error creating document:", error);
      }
    }
  };

  return (
    <div id="recipe-creation-container">
      <CheeserSearchComponent
        onIngredientSelect={handleIngredientSelect}
        onClear={selectedIngredient === null}
      />
      <div id="form-containers">
        <RecipeBox
          recipeFormData={recipeFormData}
          setRecipeFormData={setRecipeFormData}
          handleSubmitRecipe={handleSubmitRecipe}
          invalidFields={invalidRecipeFields}
        />
        <IngredientBox
          ingredients={ingredients}
          setIngredients={setIngredients}
          handleIngredientSubmit={handleIngredientSubmit}
          addIngredient={addIngredient}
          removeIngredient={removeIngredient}
          selectedIngredientData={selectedIngredient}
          setSelectedIngredientData={setSelectedIngredient}
          invalidFields={invalidIngredientFields}
        />
      </div>
    </div>
  );
};

export default CreateRecipes;
