import React, { useState, useEffect } from "react";
import DisplayGoals from "./components/DisplayGoals.jsx";
import MacroGoalForm from "./components/MacroGoalForm.jsx";
import { useAuth } from "../../utils/AuthContext.js";
import FirestoreListener from "../../firebase/FirestoreListener.js";

const Health = () => {
  const { user } = useAuth();
  const firestoreListener = new FirestoreListener();

  const [showGoals, setShowGoals] = useState(true);

  useEffect(() => {
    if (user) {
      const path = `Users/${user.uid}/Health/${user.uid}.HealthGoals`;
      const callback = (snapshot) => {
        if (snapshot.exists()) {
          setShowGoals(true);
        } else {
          setShowGoals(false);
        }
      };

      firestoreListener.subscribeToDocument(path, callback);

      return () => {
        firestoreListener.unsubscribe();
      };
    }
  }, []);


 

  return (
    <div>
      {showGoals ? (
        <div>
          <DisplayGoals onEdit={() => setShowGoals(false)}/>
        </div>
      ) : (
        <div>
          <MacroGoalForm onSubmit={() => setShowGoals(true)}/>
        </div>
      )}
      <br/>
      <br/>
    </div>
    
  );
};

export default Health;
