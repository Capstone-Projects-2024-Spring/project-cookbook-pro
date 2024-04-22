import React, { useState, useEffect } from "react";
import { useAuth } from "../../../utils/AuthContext.js";
import FirestoreListener from "../../../firebase/FirestoreListener.js";
import "../macroGoals.css"

const DisplayGoals = ({ onEdit }) => {
  
  const [goals, setGoals] = useState({});
  const { user } = useAuth();
  const firestoreListener = new FirestoreListener();

  useEffect(() => {
    if (user) {
      const path = `Users/${user.uid}/Health/${user.uid}.HealthGoals`; 
      const callback = (snapshot) => {
        if (snapshot.exists()) {
          setGoals(snapshot.data());
        } else {
          setGoals(null);
        }
      };

      firestoreListener.subscribeToDocument(path, callback);

      return () => {
        firestoreListener.unsubscribe();
      };
    }
  }, [user]);

  return (
    <div className="macro-goals-display-container">
      <h2>Your Daily Goals</h2>
      <ul>
        <li>Calorie Goal (cal): {goals?.calories || "N/A"}</li>
        <li>Protein Goal (g): {goals?.protein || "N/A"}</li>
        <li>Carbohydrate Goal (g): {goals?.carbs || "N/A"}</li>
        <li>Fat Goal (g): {goals?.fat || "N/A"}</li>
        <li>Sugar Goal (g): {goals?.sugar || "N/A"}</li>
      </ul>
      <br/>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
}

export default DisplayGoals;
