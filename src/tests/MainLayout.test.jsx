import React from "react";
import { render, screen } from "@testing-library/react";
import MainLayout from "../pages/MainLayout";

jest.mock("../components/side-container/UserDataViewer", () => () => (
  <div>Mocked UserDataViewer</div>
));

describe("MainLayout", () => {
  test("renders sidebar and content containers with children", () => {
    const childComponent = <div>Child Component</div>;
    render(<MainLayout>{childComponent}</MainLayout>);

    expect(screen.getByText("Mocked UserDataViewer")).toBeInTheDocument();
    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });

  test("renders without children", () => {
    render(<MainLayout />);

    expect(screen.getByText("Mocked UserDataViewer")).toBeInTheDocument();
    expect(screen.getByRole("div", { name: "" })).toBeInTheDocument();
  });
});
