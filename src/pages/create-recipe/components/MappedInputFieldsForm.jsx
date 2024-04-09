import React from "react";

const MappedInputFieldsForm = ({ fields, formData, onChange }) => {
  return (
    <div>
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            placeholder={field.name}
            value={formData[field.name] || ""}
            min={field.min}
            max={field.max}
            onChange={onChange}
          />
        </div>
      ))}
    </div>
  );
};

export default MappedInputFieldsForm;
