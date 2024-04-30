import React, { useState } from "react";
import { UserDataViewerProvider } from "../components/side-container/UserDataViewerContext";
import UserDataViewer from "../components/side-container/UserDataViewer";

const MainLayout = ({ children }) => {
  const [currentCollection, setCurrentCollection] = useState("saved");

  return (
    <UserDataViewerProvider value={{ currentCollection, setCurrentCollection }}>
      <div className="main-container">
        <div className="sidebar-container">
          <UserDataViewer />
        </div>
        <div className="content-container">{children}</div>
      </div>
    </UserDataViewerProvider>
  );
};

export default MainLayout;
