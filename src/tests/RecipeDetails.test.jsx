import React from "react";
import { render, screen } from "@testing-library/react";
import RecipeDetails from "../components/RecipeDetails";

// Mock the reactstrap components
jest.mock("reactstrap", () => ({
  Button: ({ children }) => <button>{children}</button>,
  Modal: ({ isOpen, children }) => (isOpen ? <div>{children}</div> : null),
  ModalHeader: ({ children }) => <div>{children}</div>,
  ModalBody: ({ children }) => <div>{children}</div>,
  ModalFooter: ({ children }) => <div>{children}</div>,
  Container: ({ children }) => <div>{children}</div>,
}));

describe("RecipeDetails", () => {
  const meal = {
    id: 1,
    name: "Test Recipe",
    image: "test.jpg",
    servings: 4,
    ingredients: [
      { amount: 1, unit: "cup", name: "Ingredient 1" },
      { amount: 2, unit: "tbsp", name: "Ingredient 2" },
    ],
    instructions: "Test instructions",
    summary: "Test summary",
    isSaved: true,
  };

  const buttonOptions = (
    <>
      <button>Button 1</button>
      <button>Button 2</button>
    </>
  );

  test("renders recipe details correctly", () => {
    render(
      <RecipeDetails meal={meal} buttonOptions={buttonOptions} isOpen={true} />
    );

    expect(screen.getByText("Test Recipe")).toBeInTheDocument();
    expect(screen.getByAltText("")).toHaveAttribute("src", "test.jpg");
    expect(screen.getByText("servings:")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("ingredients:")).toBeInTheDocument();
    expect(screen.getByText("1 cup Ingredient 1")).toBeInTheDocument();
    expect(screen.getByText("2 tbsp Ingredient 2")).toBeInTheDocument();
    expect(screen.getByText("Button 1")).toBeInTheDocument();
    expect(screen.getByText("Button 2")).toBeInTheDocument();
  });

  test("does not render filtered meal properties", () => {
    render(
      <RecipeDetails meal={meal} buttonOptions={buttonOptions} isOpen={true} />
    );

    expect(screen.queryByText("summary:")).not.toBeInTheDocument();
    expect(screen.queryByText("isSaved:")).not.toBeInTheDocument();
    expect(screen.queryByText("image:")).not.toBeInTheDocument();
    expect(screen.queryByText("instructions:")).not.toBeInTheDocument();
  });

  test("does not render modal when isOpen is false", () => {
    render(
      <RecipeDetails meal={meal} buttonOptions={buttonOptions} isOpen={false} />
    );

    expect(screen.queryByText("Test Recipe")).not.toBeInTheDocument();
  });
});
