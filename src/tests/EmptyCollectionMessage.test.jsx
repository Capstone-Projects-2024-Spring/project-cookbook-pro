import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EmptyCollectionMessage from "../components/side-container/EmptyCollectionMessage";

describe("EmptyCollectionMessage", () => {
  test("renders collection name and link when href is provided", () => {
    render(
      <MemoryRouter>
        <EmptyCollectionMessage collectionName="Test Collection" href="/test" />
      </MemoryRouter>
    );

    expect(screen.getByText("No Test Collection")).toBeInTheDocument();
    expect(screen.getByText("Want to add one?")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/test");
  });

  test("renders only collection name when href is not provided", () => {
    render(<EmptyCollectionMessage collectionName="Test Collection" />);

    expect(screen.getByText("No Test Collection")).toBeInTheDocument();
    expect(screen.queryByText("Want to add one?")).not.toBeInTheDocument();
  });
});
