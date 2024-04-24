import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NutritionModal from "../pages/calendar/components/NutritionModal";
import "@testing-library/jest-dom";
//
jest.mock("../pages/health/Health", () => () => (
  <div>Mocked Health Component</div>
));

describe("NutritionModal", () => {
  test("renders nutrition report when isOpen is true", () => {
    const closeModal = jest.fn();
    render(<NutritionModal isOpen={true} closeModal={closeModal} />);

    expect(screen.getByText("Nutrition Report")).toBeInTheDocument();
    expect(screen.getByText("Mocked Health Component")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  test("does not render nutrition report when isOpen is false", () => {
    const closeModal = jest.fn();
    render(<NutritionModal isOpen={false} closeModal={closeModal} />);

    expect(screen.queryByText("Nutrition Report")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Mocked Health Component")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Close" })
    ).not.toBeInTheDocument();
  });

  test("calls closeModal when close button is clicked", () => {
    const closeModal = jest.fn();
    render(<NutritionModal isOpen={true} closeModal={closeModal} />);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
