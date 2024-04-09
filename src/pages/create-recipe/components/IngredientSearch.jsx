import React, { useState } from "react";
import MealDataManager from "../../../utils/MealDataManager";

const IngredientSearch = () => {
  const [ingredients, setIngredients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const mealDataManager = new MealDataManager();

  const handleSearch = async () => {
    try {
      const { results } = await mealDataManager.searchIngredients(
        searchQuery,
        10
      );
      setIngredients(results);
    } catch (error) {
      console.error("Error searching for ingredients:", error);
    }
  };

  return (
    <div id="ingredient-search-container">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search Ingredients</button>
      <ul>
        {ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            <span>{ingredient.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientSearch;
