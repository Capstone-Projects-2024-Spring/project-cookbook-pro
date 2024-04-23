import React from "react";
import { render, screen } from "@testing-library/react";
import GeneratedRecipeItem from "../pages/recommendations/components/GeneratedRecipeItem";

describe("GeneratedRecipeItem", () => {
  const recipe = {
    name: "Test Recipe",
    summary: "Test summary",
    servings: 4,
    cuisine: "Test cuisine",
    dishType: "Test dish type",
    id: 1,
    savedRecipeInspiration: "Test inspiration",
    inspirationReasoning: "Test reasoning",
    ingredients: [
      { name: "Ingredient 1", amount: 1, unit: "cup" },
      { name: "Ingredient 2", amount: 2, unit: "tbsp" },
    ],
  };

  test("renders recipe details correctly", () => {
    render(<GeneratedRecipeItem recipe={recipe} />);

    expect(screen.getByText("Name: Test Recipe")).toBeInTheDocument();
    expect(screen.getByText("Summary: Test summary")).toBeInTheDocument();
    expect(screen.getByText("Servings: 4")).toBeInTheDocument();
    expect(screen.getByText("Cuisine: Test cuisine")).toBeInTheDocument();
    expect(screen.getByText("Dish Type: Test dish type")).toBeInTheDocument();
    expect(screen.getByText("ID: 1")).toBeInTheDocument();
    expect(
      screen.getByText("Saved Recipe Inspiration: Test inspiration")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Inspiration Reasoning: Test reasoning")
    ).toBeInTheDocument();
    expect(screen.getByText("- Ingredient 1 (1 cup)")).toBeInTheDocument();
    expect(screen.getByText("- Ingredient 2 (2 tbsp)")).toBeInTheDocument();
  });
});
