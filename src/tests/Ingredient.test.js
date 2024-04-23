import { Ingredient } from "../customObjects/Ingredient";
//
describe("Ingredient", () => {
  test("should create an instance of Ingredient with correct properties", () => {
    const ingredient = new Ingredient(1, 1, "Test Ingredient", "unit");

    expect(ingredient.amount).toBe(1);
    expect(ingredient.id).toBe(1);
    expect(ingredient.name).toBe("Test Ingredient");
    expect(ingredient.unit).toBe("unit");
    expect(ingredient.isSaved).toBe(false);
  });

  test("should return a string representation of the ingredient", () => {
    const ingredient = new Ingredient(1, 1, "Test Ingredient", "unit");

    expect(ingredient.toString()).toBe("1, 1, Test Ingredient, unit");
  });
});
