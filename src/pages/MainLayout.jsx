import React from "react";
import WrappedUserDataViewer from "../components/side-container/UserDataViewer";

const MainLayout = ({ children }) => {
  return (
    <div>
      <div className="main-container">
        <div className="sidebar-container">
          <WrappedUserDataViewer />
        </div>
        {/* This is where our pages (children) get processed through the layout*/}
        <div className="content-container">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
