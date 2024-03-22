import React, { useState } from "react";
import SavedMeals from "./SavedMeals";
import CustomMeals from "./CustomMeals";
import { useAuth } from "../utils/AuthContext";
import styled from "styled-components";

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const ToggleButton = styled.button`
  background-color: ${(props) => (props.active ? "#ddd" : "#eee")};
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  outline: none;
`;

const UserRecipesViewer = () => {
  const [currentCollection, setCurrentCollection] = useState("saved");

  const toggleCollection = (collection) => {
    setCurrentCollection(collection);
  };

  const { user } = useAuth();

  return (
    <div>
      <h4>
        {user.displayName
          ? `${user.displayName.split(" ")[0]}'s Recipes`
          : "Your Saved Recipes"}
      </h4>
      <ToggleContainer>
        <ToggleButton
          active={currentCollection === "custom"}
          onClick={() => toggleCollection("custom")}
        >
          Custom
        </ToggleButton>
        <ToggleButton
          active={currentCollection === "saved"}
          onClick={() => toggleCollection("saved")}
        >
          Saved
        </ToggleButton>
      </ToggleContainer>
      {currentCollection === "saved" ? <SavedMeals /> : <CustomMeals />}
    </div>
  );
};

export default UserRecipesViewer;
