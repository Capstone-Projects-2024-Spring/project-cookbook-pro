import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import "../css/styles.css";

const Header = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const logoutClick = () => {
    navigate("/login");
  };

  return (
    <div id="header" className="header">
      <div>
        <Link id="header-logo" to="/">
          INSERT LOGO
        </Link>
      </div>
      <div className="links--wrapper">
        {user ? (
          <>
            <Link to="/" className="header--link">
              Home
            </Link>
            <Link to="/search" className="header--link">
              Search
            </Link>
            <Link to="/recommendations" className="header--link">
              Recommendations
            </Link>
            <button onClick={logoutUser} className="btn">
              Logout {user.displayName ? `(${user.displayName})` : ""}
            </button>
          </>
        ) : (
          <Link className="btn" to="/login">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
