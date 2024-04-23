import React from "react";
import { createRoot } from "react-dom/client";
import App from "../App";

jest.mock("react-dom/client", () => ({
  createRoot: jest.fn().mockReturnValue({
    render: jest.fn(),
  }),
}));

jest.mock("../App", () => () => <div>Mocked App</div>);

describe("index.js", () => {
  test("renders the application", () => {
    require("../index");
    expect(createRoot).toHaveBeenCalledWith(document.getElementById("root"));
    expect(createRoot().render).toHaveBeenCalledWith(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
});
