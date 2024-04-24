import MealDataManager from "../utils/MealDataManager";
import { Recipe } from "../customObjects/Recipe";
import { Ingredient } from "../customObjects/Ingredient";
import "@testing-library/jest-dom";

jest.mock("../customObjects/Recipe");
jest.mock("../customObjects/Ingredient");

describe("MealDataManager", () => {
  let mealDataManager;

  beforeEach(() => {
    mealDataManager = new MealDataManager();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("queryRecipeFromSpoonacular", () => {
    test("should return recipes and total results", async () => {
      const mockResponse = {
        results: [
          {
            extendedIngredients: [
              { amount: 1, id: 1, name: "Ingredient 1", unit: "unit" },
              { amount: 2, id: 2, name: "Ingredient 2", unit: "unit" },
            ],
            cuisines: ["cuisine1"],
            dishTypes: ["dishType1"],
            id: 1,
            image: "image1.jpg",
            analyzedInstructions: ["instruction1", "instruction2"],
            title: "Recipe 1",
            servings: 2,
            summary: "Recipe summary",
          },
        ],
        totalResults: 1,
      };

      global.fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await mealDataManager.queryRecipeFromSpoonacular(
        "query",
        0
      );

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(Recipe).toHaveBeenCalledTimes(1);
      expect(Ingredient).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        resultsList: expect.any(Array),
        totalResults: mockResponse.totalResults,
      });
    });

    test("should handle API request failure", async () => {
      global.fetch.mockRejectedValueOnce(new Error("API request failed"));

      await expect(
        mealDataManager.queryRecipeFromSpoonacular("query", 0)
      ).rejects.toThrow("API request failed");
    });

    test("should handle missing data in API response", async () => {
      const mockResponse = {
        results: [
          {
            // Missing some required properties
            id: 1,
            title: "Recipe 1",
          },
        ],
        totalResults: 1,
      };

      global.fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await mealDataManager.queryRecipeFromSpoonacular(
        "query",
        0
      );

      expect(result).toEqual({
        resultsList: expect.any(Array),
        totalResults: mockResponse.totalResults,
      });
    });
  });

  describe("searchIngredients", () => {
    test("should return ingredients and total results", async () => {
      const mockResponse = {
        results: [
          { id: 1, name: "Ingredient 1", image: "image1.jpg" },
          { id: 2, name: "Ingredient 2", image: "image2.jpg" },
        ],
        totalResults: 2,
      };

      global.fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await mealDataManager.searchIngredients("query");

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(Ingredient).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        results: expect.any(Array),
        totalResults: mockResponse.totalResults,
      });
    });

    test("should handle API request failure", async () => {
      global.fetch.mockRejectedValueOnce(new Error("API request failed"));

      await expect(mealDataManager.searchIngredients("query")).rejects.toThrow(
        "API request failed"
      );
    });

    test("should handle missing data in API response", async () => {
      const mockResponse = {
        results: [
          {
            // Missing some required properties
            id: 1,
          },
        ],
        totalResults: 1,
      };

      global.fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await mealDataManager.searchIngredients("query");

      expect(result).toEqual({
        results: expect.any(Array),
        totalResults: mockResponse.totalResults,
      });
    });
  });
});
