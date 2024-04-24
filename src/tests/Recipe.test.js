import { Recipe } from "../customObjects/Recipe";
import "@testing-library/jest-dom";
//
describe("Recipe", () => {
  test("should create an instance of Recipe with correct properties", () => {
    const recipe = new Recipe(
      "Test Cuisine",
      "Test Dish Type",
      1,
      "test.jpg",
      ["ingredient1", "ingredient2"],
      "Test Instructions",
      "Test Recipe",
      4,
      "Test Summary"
    );

    expect(recipe.cuisine).toBe("Test Cuisine");
    expect(recipe.dishType).toBe("Test Dish Type");
    expect(recipe.id).toBe(1);
    expect(recipe.image).toBe("test.jpg");
    expect(recipe.ingredients).toEqual(["ingredient1", "ingredient2"]);
    expect(recipe.instructions).toBe("Test Instructions");
    expect(recipe.name).toBe("Test Recipe");
    expect(recipe.servings).toBe(4);
    expect(recipe.summary).toBe("Test Summary");
    expect(recipe.isSaved).toBe(false);
  });

  test("should return a string representation of the recipe", () => {
    const recipe = new Recipe(
      "Test Cuisine",
      "Test Dish Type",
      1,
      "test.jpg",
      ["ingredient1", "ingredient2"],
      "Test Instructions",
      "Test Recipe",
      4,
      "Test Summary"
    );

    expect(recipe.toString()).toBe(
      "Test Cuisine, Test Dish Type, 1, test.jpg, ingredient1,ingredient2, Test Instructions, Test Recipe, 4, Test Summary"
    );
  });

  test("should set isSaved property to true", () => {
    const recipe = new Recipe(
      "Test Cuisine",
      "Test Dish Type",
      1,
      "test.jpg",
      ["ingredient1", "ingredient2"],
      "Test Instructions",
      "Test Recipe",
      4,
      "Test Summary"
    );

    recipe.isSaved = true;
    expect(recipe.isSaved).toBe(true);
  });
});
