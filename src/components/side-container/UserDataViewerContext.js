import React, { createContext, useState } from "react";

export const UserDataViewerContext = createContext();

export const UserDataViewerProvider = ({ children }) => {
  const [currentCollection, setCurrentCollection] = useState("saved");

  return (
    <UserDataViewerContext.Provider
      value={{ currentCollection, setCurrentCollection }}
    >
      {children}
    </UserDataViewerContext.Provider>
  );
};
