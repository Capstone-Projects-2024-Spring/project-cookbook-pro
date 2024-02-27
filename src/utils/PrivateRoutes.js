/**
 * PrivateRoutes Component - A React component for rendering private routes.
 * @module PrivateRoutes
 * @see {@link https://reactrouter.com/web/api/Outlet|react-router-dom Outlet}
 * @see {@link AuthContext} - The context used for authentication.
 */

import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * PrivateRoutes functional component.
 * Renders an Outlet if the user is authenticated, otherwise redirects to the login page.
 *
 * @function PrivateRoutes
 * @returns {JSX.Element} - React component for private routes.
 */
const PrivateRoutes = () => {
  /**
   * Custom hook from AuthContext to access user authentication information.
   * @name useAuth
   * @function
   * @returns {Object} - An object containing user authentication information.
   * @property {Object} user - The authenticated user object.
   */

  const { user } = useAuth();

  /**
   * Conditional rendering based on user authentication status.
   * @returns {JSX.Element} - Outlet component if the user is authenticated, otherwise Navigate to the login page.
   */
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
