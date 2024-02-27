import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import "../css/styles.css";

/**
 * Header component for the application.
 * @component
 */
const Header = () => {
  /**
   * React hook for navigation.
   * @type {function}
   */
  const navigate = useNavigate();

  /**
   * Custom hook for authentication context.
   * @type {object}
   * @property {object} user - The authenticated user.
   * @property {function} logoutUser - Function to log out the user.
   */
  const { user, logoutUser } = useAuth();

  /**
   * Handles the click event for logging out.
   * Navigates to the "/login" route when the user clicks the logout button.
   * @function
   */
  const logoutClick = () => {
    navigate("/login");
  };

  /**
   * Renders the Header component.
   * @returns {JSX.Element} The Header component JSX.
   */
  return (
    <div id="header" className="header">
      <div>
        {/* Logo link */}
        <Link id="header-logo" to="/">
          INSERT LOGO
        </Link>
      </div>
      <div className="links--wrapper">
        {user ? (
          // Display links and logout button when the user is logged in
          <>
            <Link to="/" className="header--link">
              Home
            </Link>
            <Link to="/search" className="header--link">
              Search
            </Link>
            <button onClick={logoutUser} className="btn">
              Logout {user.displayName ? `(${user.displayName})` : ""}
            </button>
          </>
        ) : (
          // Display login button when the user is not logged in
          <Link className="btn" to="/login">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

/**
 * Exports the Header component as the default export.
 * @exports Header
 */
export default Header;
