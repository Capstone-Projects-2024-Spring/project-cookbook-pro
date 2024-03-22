import React, { useState } from "react";
import "../macroGoals.css";

const MacroGoalForm = () => {
  const [formData, setFormData] = useState({
    caloriesGoal: "",
    proteinGoal: "",
    carbGoal: "",
    fatGoal: "",
  });

  const [isVisible, setIsVisible] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const inputStyle = {
    textAlign: "center",
    width: "100%",
    boxSizing: "border-box",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Object is returned in console
    setIsVisible(false);
  };

  const handleEdit = () => {
    setIsVisible(true);
  };

  if (!isVisible) {
    return (
      <div style={{ textAlign: "center" }}>
        <p>Goals saved to profile!</p>
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleEdit}>Edit</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <br />
      <h3>Enter your desired macronutrients below:</h3>
      <p>(You'll be able to go back and edit them later!)</p>
      <br />
      <form onSubmit={handleSubmit} className="form-container">
        <label>
          Calorie Goal (cal):
          <input
            style={inputStyle}
            type="number"
            name="caloriesGoal"
            value={formData.caloriesGoal}
            onChange={handleChange}
            className="form-input"
          />
        </label>
        <br />
        <label>
          Protein Goal (g):
          <input
            style={inputStyle}
            type="number"
            name="proteinGoal"
            value={formData.proteinGoal}
            onChange={handleChange}
            className="form-input"
          />
        </label>
        <br />
        <label>
          Carbohydrate Goal (g):
          <input
            style={inputStyle}
            type="number"
            name="carbGoal"
            value={formData.carbGoal}
            onChange={handleChange}
            className="form-input"
          />
        </label>
        <br />
        <label>
          Fat Goal (g):
          <input
            style={inputStyle}
            type="number"
            name="fatGoal"
            value={formData.fatGoal}
            onChange={handleChange}
            className="form-input"
          />
        </label>
        <br />
        <br />
        <button
          type="submit"
          style={{ marginLeft: "auto", marginRight: "auto", display: "block" }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default MacroGoalForm;
