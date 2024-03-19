import React, { useState } from 'react';

const MacroGoalForm = () => {
  const [formData, setFormData] = useState({
    caloriesGoal: '',
    proteinGoal: '',
    carbGoal: '',
    fatGoal: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const inputStyle = {
    textAlign: 'center', 
    width: '100%', 
    boxSizing: 'border-box'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Calorie Goal:
        <input
          style={inputStyle}
          type="number"
          name="caloriesGoal"
          value={formData.caloriesGoal}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Protein Goal:
        <input
          style={inputStyle}
          type="number"
          name="proteinGoal"
          value={formData.proteinGoal}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Carbohydrate Goal:
        <input
          style={inputStyle}
          type="number"
          name="carbGoal"
          value={formData.carbGoal}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Fat Goal:
        <input
          style={inputStyle}
          type="number"
          name="fatGoal"
          value={formData.fatGoal}
          onChange={handleChange}
        />
      </label>
      <br />
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default MacroGoalForm;
