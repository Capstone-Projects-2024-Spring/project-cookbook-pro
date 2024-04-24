import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MappedInputFieldsForm from "../pages/create-recipe/components/MappedInputFieldsForm";
import "@testing-library/jest-dom";

describe("MappedInputFieldsForm", () => {
  const fields = [
    { name: "field1", label: "Field 1", type: "text" },
    { name: "field2", label: "Field 2", type: "number", min: 0, max: 100 },
  ];
  const formData = { field1: "value1", field2: 50 };
  const onChange = jest.fn();

  test("renders input fields with correct attributes", () => {
    render(
      <MappedInputFieldsForm
        fields={fields}
        formData={formData}
        onChange={onChange}
      />
    );

    const field1Input = screen.getByLabelText("Field 1");
    expect(field1Input).toHaveAttribute("type", "text");
    expect(field1Input).toHaveAttribute("value", "value1");

    const field2Input = screen.getByLabelText("Field 2");
    expect(field2Input).toHaveAttribute("type", "number");
    expect(field2Input).toHaveAttribute("min", "0");
    expect(field2Input).toHaveAttribute("max", "100");
    expect(field2Input).toHaveAttribute("value", "50");
  });

  test("calls onChange handler when input value changes", () => {
    render(
      <MappedInputFieldsForm
        fields={fields}
        formData={formData}
        onChange={onChange}
      />
    );

    const field1Input = screen.getByLabelText("Field 1");
    fireEvent.change(field1Input, { target: { value: "new value" } });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test("renders input fields with empty values when formData is empty", () => {
    render(
      <MappedInputFieldsForm
        fields={fields}
        formData={{}}
        onChange={onChange}
      />
    );

    const field1Input = screen.getByLabelText("Field 1");
    expect(field1Input).toHaveAttribute("value", "");

    const field2Input = screen.getByLabelText("Field 2");
    expect(field2Input).toHaveAttribute("value", "");
  });

  test("renders input fields with placeholder attribute", () => {
    render(
      <MappedInputFieldsForm
        fields={fields}
        formData={formData}
        onChange={onChange}
      />
    );

    const field1Input = screen.getByLabelText("Field 1");
    expect(field1Input).toHaveAttribute("placeholder", "field1");

    const field2Input = screen.getByLabelText("Field 2");
    expect(field2Input).toHaveAttribute("placeholder", "field2");
  });
});
