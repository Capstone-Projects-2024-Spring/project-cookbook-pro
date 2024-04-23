import React from "react";
import { render, screen } from "@testing-library/react";
import GptResponseRenderer from "../pages/recommendations/components/GptResponseRenderer";

jest.mock("../pages/recommendations/components/GeneratedMealCard", () => () => (
  <div>Mocked GeneratedMealCard</div>
));

describe("GptResponseRenderer", () => {
  test("renders loading message when loading is true", () => {
    render(<GptResponseRenderer response={null} loading={true} />);
    expect(
      screen.getByText("Generating your Recipe Powered by ChatGPT...")
    ).toBeInTheDocument();
  });

  test("renders generated meal cards when response has recipes", () => {
    const response = {
      recipes: [{ name: "Recipe 1" }, { name: "Recipe 2" }],
    };
    render(<GptResponseRenderer response={response} loading={false} />);
    expect(screen.getAllByText("Mocked GeneratedMealCard")).toHaveLength(2);
  });

  test("does not render generated meal cards when response is null", () => {
    render(<GptResponseRenderer response={null} loading={false} />);
    expect(
      screen.queryByText("Mocked GeneratedMealCard")
    ).not.toBeInTheDocument();
  });
});
