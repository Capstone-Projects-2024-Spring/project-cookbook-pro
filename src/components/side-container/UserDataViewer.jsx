import React, { useContext } from "react";
import { useAuth } from "../../utils/AuthContext";
import styled from "styled-components";
import { UserDataViewerContext } from "./UserDataViewerContext";
import UserDataViewerItems from "./UserDataViewerItems";

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const ToggleButton = styled.button`
  background-color: ${(props) => (props.active === "true" ? "#ddd" : "#eee")};
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  outline: none;
`;

const UserDataViewer = () => {
  const { currentCollection, setCurrentCollection } = useContext(
    UserDataViewerContext
  );
  const { user } = useAuth();

  const toggleCollection = (collection) => {
    setCurrentCollection(collection);
  };

  return (
    <div>
      <h4 id="user-data-viewer-label">
        {user.displayName
          ? `${user.displayName.split(" ")[0]}'s Recipes`
          : "Your Saved Recipes"}
      </h4>
      <ToggleContainer>
        <ToggleButton
          id="toggle-button-custom"
          active={currentCollection === "custom" ? "true" : undefined}
          onClick={() => toggleCollection("custom")}
          style={{
            fontWeight: currentCollection === "custom" ? "bold" : "normal",
          }}
        >
          Custom
        </ToggleButton>
        <ToggleButton
          id="toggle-button-saved"
          active={currentCollection === "saved" ? "true" : undefined}
          onClick={() => toggleCollection("saved")}
          style={{
            fontWeight: currentCollection === "saved" ? "bold" : "normal",
          }}
        >
          Saved
        </ToggleButton>
        <ToggleButton
          id="toggle-button-generated"
          active={currentCollection === "generated" ? "true" : undefined}
          onClick={() => toggleCollection("generated")}
          style={{
            fontWeight: currentCollection === "generated" ? "bold" : "normal",
          }}
        >
          GPT
        </ToggleButton>
      </ToggleContainer>
      <UserDataViewerItems />
    </div>
  );
};

export default UserDataViewer;
