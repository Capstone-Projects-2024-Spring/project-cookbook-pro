import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GeneratedMealCard from "../pages/recommendations/components/GeneratedMealCard";
import OpenAI from "openai";

jest.mock("openai", () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    images: {
      generate: jest.fn().mockResolvedValue({
        data: [{ url: "generated-image-url" }],
      }),
    },
  })),
}));

describe("GeneratedMealCard", () => {
  const recipe = {
    name: "Test Recipe",
    summary: "Test summary",
    savedRecipeInspiration: "Test inspiration",
    inspirationReasoning: "Test reasoning",
    ingredients: [
      { name: "Ingredient 1", amount: 1, unit: "cup" },
      { name: "Ingredient 2", amount: 2, unit: "tbsp" },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders recipe details correctly", () => {
    render(<GeneratedMealCard recipe={recipe} />);

    expect(screen.getByText("Test Recipe")).toBeInTheDocument();
    expect(
      screen.getByText("Inspired by: Test inspiration")
    ).toBeInTheDocument();
    expect(screen.getByText("Test summary")).toBeInTheDocument();
    expect(screen.getByText("Test reasoning")).toBeInTheDocument();
  });

  test("opens and closes recipe details when details button is clicked", () => {
    render(<GeneratedMealCard recipe={recipe} />);

    fireEvent.click(screen.getByText("Details"));
    expect(screen.getByText("Close")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByText("Close")).not.toBeInTheDocument();
  });

  test("generates DALL-E image when button is clicked", async () => {
    render(<GeneratedMealCard recipe={recipe} />);

    fireEvent.click(screen.getByText("Generate DALL-E Image"));
    await waitFor(() =>
      expect(screen.getByAltText("Generated Recipe Image")).toBeInTheDocument()
    );
  });

  test("opens modal when image is clicked and closes it when close button is clicked", async () => {
    render(<GeneratedMealCard recipe={recipe} />);

    fireEvent.click(screen.getByText("Generate DALL-E Image"));
    await waitFor(() =>
      expect(screen.getByAltText("Generated Recipe Image")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByAltText("Generated Recipe Image"));
    expect(screen.getByAltText("Full-size Recipe Image")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Close"));
    expect(
      screen.queryByAltText("Full-size Recipe Image")
    ).not.toBeInTheDocument();
  });

  test("does not render image and modal when image URL is not available", () => {
    render(<GeneratedMealCard recipe={recipe} />);

    expect(
      screen.queryByAltText("Generated Recipe Image")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByAltText("Full-size Recipe Image")
    ).not.toBeInTheDocument();
  });

  test("handles error when generating DALL-E image fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    jest
      .spyOn(OpenAI.prototype.images, "generate")
      .mockRejectedValueOnce(new Error("Generation failed"));

    render(<GeneratedMealCard recipe={recipe} />);

    fireEvent.click(screen.getByText("Generate DALL-E Image"));
    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error generating image:",
        expect.any(Error)
      )
    );

    consoleSpy.mockRestore();
  });

  test("saves recipe when save button is clicked", () => {
    const saveRecipeMock = jest.fn();
    render(<GeneratedMealCard recipe={recipe} onSave={saveRecipeMock} />);

    fireEvent.click(screen.getByText("Save"));

    expect(saveRecipeMock).toHaveBeenCalledTimes(1);
    expect(saveRecipeMock).toHaveBeenCalledWith(recipe);
  });

  test("toggles modal when image is clicked", async () => {
    render(<GeneratedMealCard recipe={recipe} />);

    fireEvent.click(screen.getByText("Generate DALL-E Image"));
    await waitFor(() =>
      expect(screen.getByAltText("Generated Recipe Image")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByAltText("Generated Recipe Image"));
    expect(screen.getByAltText("Full-size Recipe Image")).toBeInTheDocument();

    fireEvent.click(screen.getByAltText("Generated Recipe Image"));
    expect(
      screen.queryByAltText("Full-size Recipe Image")
    ).not.toBeInTheDocument();
  });
});
