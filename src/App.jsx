/**
 * @file Main application component using React and React Router.
 * @module App
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./utils/AuthContext";
import "./css/styles.css";
import "bootstrap/dist/css/bootstrap.css";

/**
 * Main application component.
 * @function App
 * @returns {JSX.Element} - The rendered App component.
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          {/* Route for the login page */}
          <Route path="/login" element={<Login />} />

          {/* Route for the signup page */}
          <Route path="/signup" element={<SignUp />} />

          {/* Private routes wrapped in AuthProvider */}
          <Route element={<PrivateRoutes />}>
            {/* Route for the home page */}
            <Route path="/" element={<Home />} />

            {/* Route for the search page */}
            <Route path="/search" element={<Search />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
