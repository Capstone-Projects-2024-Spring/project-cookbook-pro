import React from "react";

const FlexibleForm = ({ fields, formData, onChange }) => {
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
            onChange={onChange}
          />
        </div>
      ))}
    </div>
  );
};

export default FlexibleForm;
