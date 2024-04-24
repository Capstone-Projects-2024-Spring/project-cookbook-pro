import React from "react";
import { render, screen } from "@testing-library/react";
import Order from "../pages/order-history/components/Order";
import "@testing-library/jest-dom";

describe("Order component", () => {
  test("renders order details with recipe names and ingredients", () => {
    const recipeNames = ["Recipe 1", "Recipe 2"];
    const ingredients = [
      { name: "Ingredient 1", amount: 1, unit: "cup" },
      { name: "Ingredient 2", amount: 2, unit: "tbsp" },
      "Ingredient 3",
    ];
    const orderId = 1;

    render(
      <Order
        recipeNames={recipeNames}
        ingredients={ingredients}
        orderId={orderId}
      />
    );

    expect(screen.getByText(`Order Details ${orderId}`)).toBeInTheDocument();
    expect(screen.getByText("Recipe Names")).toBeInTheDocument();
    expect(screen.getByText("Ingredients")).toBeInTheDocument();

    recipeNames.forEach((recipe) => {
      expect(screen.getByText(recipe)).toBeInTheDocument();
    });

    ingredients.forEach((ingredient) => {
      if (typeof ingredient === "object") {
        expect(
          screen.getByText(
            `${ingredient.name} (${ingredient.amount} ${ingredient.unit})`
          )
        ).toBeInTheDocument();
      } else {
        expect(screen.getByText(ingredient)).toBeInTheDocument();
      }
    });
  });

  test("renders order details without recipe names and ingredients", () => {
    const orderId = 2;

    render(<Order orderId={orderId} />);

    expect(screen.getByText(`Order Details ${orderId}`)).toBeInTheDocument();
    expect(screen.getByText("Recipe Names")).toBeInTheDocument();
    expect(screen.getByText("Ingredients")).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  test("renders order details with empty recipe names and ingredients", () => {
    const recipeNames = [];
    const ingredients = [];
    const orderId = 3;

    render(
      <Order
        recipeNames={recipeNames}
        ingredients={ingredients}
        orderId={orderId}
      />
    );

    expect(screen.getByText(`Order Details ${orderId}`)).toBeInTheDocument();
    expect(screen.getByText("Recipe Names")).toBeInTheDocument();
    expect(screen.getByText("Ingredients")).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});
