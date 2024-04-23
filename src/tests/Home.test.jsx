import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../pages/Home";

describe("Home", () => {
  test("renders home page with correct content", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Welcome to CookBook Pro"
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Search" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Recommendations" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Create Recipe" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Calendar" })
    ).toBeInTheDocument();
  });
});
