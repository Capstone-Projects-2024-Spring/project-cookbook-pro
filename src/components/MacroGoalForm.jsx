import React, { useState } from "react";
import "../css/HealthForm.css";

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
    <div className="macro-form-container">
      <div id=""></div>
      <br />
      <h3>Enter your desired macronutrients below:</h3>
      <p>(You'll be able to go back and edit them later!)</p>
      <br />
      <div id="form-input-container">
      <form onSubmit={handleSubmit}>
        <label>
          Calorie Goal (cal):
          <input
            type="number"
            name="caloriesGoal"
            value={formData.caloriesGoal}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Protein Goal (g):
          <input
            type="number"
            name="proteinGoal"
            value={formData.proteinGoal}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Carbohydrate Goal (g):
          <input
            type="number"
            name="carbGoal"
            value={formData.carbGoal}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Fat Goal (g):
          <input
            type="number"
            name="fatGoal"
            value={formData.fatGoal}
            onChange={handleChange}
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
    </div>
  );
};

export default MacroGoalForm;
