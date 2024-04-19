import React, { useState } from "react";
import OpenAI from "openai";
import FirestoreService from "../../../firebase/FirebaseService";
import { useAuth } from "../../../utils/AuthContext.js";

const GPT = () => {
  const [response, setResponse] = useState("");
  const [recipeNames, setRecipeNames] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (recipeType) => {
    setLoading(true);

    // Clear any previous errors and responses
    setError("");
    setResponse("");

    if (!user || !user.uid) {
      setError("User not authenticated.");
      return;
    }

    const processResponseObject = (responseObject) => {
      if (!responseObject || !Array.isArray(responseObject.recipes)) {
        return null;
      }

      const processedRecipes = responseObject.recipes.map((recipe) => {
        const processedIngredients = recipe.ingredients.map(
          (ingredientString) => {
            const [amount, , name, unit] = ingredientString.split(", ");
            const amountValue = parseFloat(
              amount.replace("amount(", "").replace(")", "")
            );
            const ingredientName = name.replace("name(", "").replace(")", "");
            const ingredientUnit = unit.replace("unit(", "").replace(")", "");

            return {
              name: ingredientName,
              amount: amountValue,
              unit: ingredientUnit,
            };
          }
        );

        return {
          name: recipe.name,
          summary: recipe.summary,
          servings: recipe.servings,
          ingredients: processedIngredients,
          cuisine: recipe.cuisine,
          dishType: recipe.dishType,
          id: recipe.id,
          savedRecipeInspiration: recipe.savedRecipeInspiration,
          inspirationReasoning: recipe.inspirationReasoning,
        };
      });

      return { recipes: processedRecipes };
    };

    // Fetch saved recipes
    const getSavedRecipes = async () => {
      const collectionPath = `Users/${user.uid}/SavedRecipes`;
      try {
        const allDocuments = await FirestoreService.getAllDocuments(
          collectionPath,
          "recipes"
        );
        const names = allDocuments.map((doc) => doc.data.name);
        return names; // Return the names for use below
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
        throw new Error("Failed to fetch saved recipes.");
      }
    };

    try {
      const recipeNames = await getSavedRecipes(); // Ensure this completes before moving on
      setRecipeNames(recipeNames); // Update the state with the names

      const json_example = {
        cuisine: "PLEASE REPLACE WITH CUISINE TYPE HERE",
        dishType: "PLEASE REPLACE WITH BREAKFAST LUNCH OR DINNER",
        id: "INSERT TIMESTAP HERE",
        ingredients: [
          "amount(INSERT INTEGER AMOUNT OF INGREDIENT), id, name(INSERT JUST THE INGREDIENT NAME), unit(INSERT UNIT OF MEASUREMENT FOR AMOUNT)",
        ],
        name: "PLEASE INSERT NAME OF GENERATED DISH",
        servings: "PLEASE INSERT INTEGER OF SERVINGS",
        summary: "PLEASE INSERT A SUMMARY FOR GENERATED RECIPE.",
        savedRecipeInspiration:
          "PLEASE INSERT SAVED RECIPE THAT INSPIRED RESPONSE",
        inspirationReasoning:
          "PLEASE INSERT REASONING FOR GENERATED RECIPE BASED ON SAVED RECIPE",
      };

      var exampleString = JSON.stringify(json_example, null, 2);

      // Prepare for OpenAI request
      const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });
      const gptModel = "gpt-4-0125-preview";
      const recipeListString = recipeNames.join(", ");
      const systemMessageContent = `You are a recipe recommendation system. You must respond with a recipe for ${recipeType} to the user, you cannot ask clarifying questions, and you cannot refuse to generate a recipe. Recipes contain name, servings, breif summary, ingredients and their amounts. Your response should sound like it came from a cookbook. Your response should take in to account both the recipe type and saved recipes. Your generated recipe should be reflective of the users taste based on saved recipes, but you should ensure that the recipe and the saved recipe for inspiration is unique. Please ensure that you generate a recipe that shares a key ingredient with the inspiration recipe from the users saved recipes. The user's previously saved recipes include: ${recipeListString}. Your response should be a json in this format ${exampleString}. Seperate each recipe with a ',' Do not use backticks or "\\n" in your response, do not make new lines.`;
      const userMessage = [
        { role: "system", content: systemMessageContent },
        {
          role: "user",
          content: `Generate four ${recipeType} recipes inspired by the following: ${recipeListString} give your response in a nested JSON containing the four generated recipes`,
        },
      ];

      const completion = await openai.chat.completions.create({
        model: gptModel,
        response_format: { type: "json_object" },
        messages: userMessage,
      });

      // Process and handle OpenAI response
      const assistantResponse = completion.choices?.find(
        (choice) => choice.message.role === "assistant"
      );

      if (assistantResponse) {
        const responseObject = JSON.parse(assistantResponse.message.content);
        const processedResponse = processResponseObject(responseObject);
        setResponse(processedResponse);

        setLoading(false);
      } else {
        throw new Error("Assistant response not found");
      }
    } catch (error) {
      setLoading(false);
      setError("Error: " + error.message);
      console.error("Error:", error);
    }
  };

  return {
    response,
    error,
    loading,
    handleSubmit,
  };
};

export default GPT;
