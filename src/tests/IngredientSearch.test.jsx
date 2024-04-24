import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import IngredientSearch from "../pages/create-recipe/components/IngredientSearch";
import MealDataManager from "../utils/MealDataManager";
import "@testing-library/jest-dom";

jest.mock("../utils/MealDataManager");

describe("IngredientSearch", () => {
  test("renders search input and search button", () => {
    render(<IngredientSearch />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Search Ingredients" })
    ).toBeInTheDocument();
  });

  test("updates search query when input value changes", () => {
    render(<IngredientSearch />);

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "apple" } });

    expect(searchInput.value).toBe("apple");
  });

  test("calls searchIngredients and updates ingredients when search button is clicked", async () => {
    const mockResults = [
      { id: "1", name: "Apple" },
      { id: "2", name: "Banana" },
    ];
    MealDataManager.prototype.searchIngredients.mockResolvedValueOnce({
      results: mockResults,
    });

    render(<IngredientSearch />);

    const searchButton = screen.getByRole("button", {
      name: "Search Ingredients",
    });
    fireEvent.click(searchButton);

    expect(MealDataManager.prototype.searchIngredients).toHaveBeenCalledWith(
      expect.any(String),
      10
    );

    await screen.findByText("Apple");
    await screen.findByText("Banana");
  });
});
