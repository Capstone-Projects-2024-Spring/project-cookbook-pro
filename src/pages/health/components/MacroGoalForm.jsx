import React, { useState, useEffect } from "react";
import { useAuth } from "../../../utils/AuthContext.js";
import { GoalForm } from "../../../customObjects/GoalForm.js";
import FirestoreService from "../../../firebase/FirebaseService.js";
import FirestoreListener from "../../../firebase/FirestoreListener.js";
import MappedInputFieldsForm from "../../../pages/create-recipe/components/MappedInputFieldsForm.jsx";
import "../macroGoals.css";

const MacroGoalForm = ({ onSubmit }) => {
  const { user } = useAuth();
  const firestoreListener = new FirestoreListener();

  //const [isInputVisible, setIsInputVisible] = useState(true);
  const [goalFormData, setGoalFormData] = useState({});

  const goalsFields = [
    {
      name: "caloriesGoal",
      label: "Calorie Goal (cal)",
      type: "number",
      placeholder: "Enter Calorie Goal",
      min: 0,
      max: 12000,
    },
    {
      name: "proteinGoal",
      label: "Protein Goal (g)",
      type: "number",
      placeholder: "Enter Protein Goal",
      min: 0,
      max: 1000,
    },
    {
      name: "carbGoal",
      label: "Carbohydrate Goal (g)",
      type: "number",
      placeholder: "Enter Carbohydrate Goal",
      min: 0,
      max: 1000,
    },
    {
      name: "fatGoal",
      label: "Fat Goal (g)",
      type: "number",
      placeholder: "Enter Fat Goal",
      min: 0,
      max: 1000,
    },
    {
      name: "sugarGoal",
      label: "Sugar Goal (g)",
      type: "number",
      placeholder: "Enter Sugar Goal",
      min: 0,
      max: 1000,
    },
  ];

  // Function to create goal form document in Firestore
  async function handleSubmit() {
    // If user is not signed in, prompt them to log in
    if (!user) {
      alert("Please log in to submit Health Information");
      return;
    }

    // Check for negative and zeroed input
    const isValid = goalsFields.every((field) => {
      const value = goalFormData[field.name];
      return (
        value &&
        value.trim() !== "" &&
        parseFloat(value) > 0 &&
        parseFloat(value) <= 10000
      );
    });

    // If input is zero or negative, issue an alert
    if (!isValid) {
      alert("Goals not saved. Please fill out all fields with positive numbers less than or equal to 10,000.");
      return;
    }

    // Goals object
    const goalsObject = new GoalForm(
      goalFormData.caloriesGoal,
      goalFormData.proteinGoal,
      goalFormData.carbGoal,
      goalFormData.fatGoal,
      goalFormData.sugarGoal
    );

    // Firestore stuff
    const collectionPath = `Users/${user.uid}/Health`;
    const documentId = `${user.uid}.HealthGoals`;
    const dataType = "goalsResponse";
    try {
      await FirestoreService.createDocument(
        collectionPath,
        documentId,
        goalsObject,
        dataType
      );

      // Form Visibility
      onSubmit();
    } catch (error) {
      console.error("Error creating document:", error);
    }

    // Log new form data
    console.log(goalFormData);
  }

  return (
    <div className="macro-form-container">
      <br />
      <h3>Enter your desired macronutrients below:</h3>
      <p>(You'll be able to go back and edit them later!)</p>
      <br />
      <div className="input-form-container">
        <MappedInputFieldsForm
          fields={goalsFields}
          formData={goalFormData}
          onChange={(e) =>
            setGoalFormData({
              ...goalFormData,
              [e.target.name]: e.target.value,
            })
          }
        />
        <br />
        <button
          type="button"
          onClick={handleSubmit}
          style={{ marginLeft: "auto", marginRight: "auto", display: "block" }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default MacroGoalForm;
