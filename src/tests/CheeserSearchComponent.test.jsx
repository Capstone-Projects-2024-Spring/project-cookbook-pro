import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CheeserSearchComponent from "./CheeserSearchComponent";
import ingredientsMap from "../../../customObjects/IngredientMap";

describe("CheeserSearchComponent", () => {
  test("renders search input and filters ingredients based on search term", () => {
    const onIngredientSelect = jest.fn();
    render(<CheeserSearchComponent onIngredientSelect={onIngredientSelect} />);

    const searchInput = screen.getByPlaceholderText(
      "Search for ingredients..."
    );
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "appl" } });
    expect(screen.getByText("Apple")).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "bana" } });
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  test("calls onIngredientSelect when an ingredient is clicked", () => {
    const onIngredientSelect = jest.fn();
    render(<CheeserSearchComponent onIngredientSelect={onIngredientSelect} />);

    const searchInput = screen.getByPlaceholderText(
      "Search for ingredients..."
    );
    fireEvent.change(searchInput, { target: { value: "appl" } });

    fireEvent.click(screen.getByText("Apple"));
    expect(onIngredientSelect).toHaveBeenCalledWith({
      id: expect.any(String),
      name: "Apple",
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
