import React, { createContext, useState } from "react";

const UserDataViewerContext = createContext();

const UserDataViewerProvider = ({ children }) => {
  const [currentCollection, setCurrentCollection] = useState("saved");

  const contextData = {
    currentCollection,
    setCurrentCollection,
  };

  return (
    <UserDataViewerContext.Provider value={contextData}>
      {children}
    </UserDataViewerContext.Provider>
  );
};

export { UserDataViewerContext, UserDataViewerProvider };
