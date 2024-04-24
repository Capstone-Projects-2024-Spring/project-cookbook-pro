import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CheeserSearchComponent from "../pages/create-recipe/components/CheeserSearchComponent";
import ingredientsMap from "../customObjects/IngredientMap";
import "@testing-library/jest-dom";
//
describe("CheeserSearchComponent", () => {
  test("renders search input and filters ingredients based on search term", () => {
    const onIngredientSelect = jest.fn();
    render(<CheeserSearchComponent onIngredientSelect={onIngredientSelect} />);

    const searchInput = screen.getByPlaceholderText(
      "Search for ingredients..."
    );
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "appl" } });
    expect(screen.getAllByRole("listitem", { name: /.*/i })).toHaveLength(30);

    fireEvent.change(searchInput, { target: { value: "pineappl" } });
    expect(screen.getAllByRole("listitem", { name: /.*/i })).toHaveLength(9);
  });

  test("calls onIngredientSelect when an ingredient is clicked", () => {
    const onIngredientSelect = jest.fn();
    render(<CheeserSearchComponent onIngredientSelect={onIngredientSelect} />);

    const searchInput = screen.getByPlaceholderText(
      "Search for ingredients..."
    );
    fireEvent.change(searchInput, { target: { value: "appl" } });

    const listItems = screen.getAllByRole("listitem");
    const firstAppleItem = listItems.find((item) =>
      item.textContent.toLowerCase().includes("appl")
    );

    fireEvent.click(firstAppleItem);

    expect(onIngredientSelect).toHaveBeenCalledWith({
      id: expect.any(String),
      name: "honey crisp apples",
    });
  });

  test("does not render ingredient list when search term is less than 3 characters", () => {
    const onIngredientSelect = jest.fn();
    render(<CheeserSearchComponent onIngredientSelect={onIngredientSelect} />);

    const searchInput = screen.getByPlaceholderText(
      "Search for ingredients..."
    );
    fireEvent.change(searchInput, { target: { value: "ap" } });

    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
  });

  test("renders empty ingredient list when no matching ingredients are found", () => {
    const onIngredientSelect = jest.fn();
    render(<CheeserSearchComponent onIngredientSelect={onIngredientSelect} />);

    const searchInput = screen.getByPlaceholderText(
      "Search for ingredients..."
    );
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
    expect(screen.queryByText("Banana")).not.toBeInTheDocument();
  });
});
