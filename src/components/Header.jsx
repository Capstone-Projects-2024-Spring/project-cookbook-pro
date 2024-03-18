import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import "../css/styles.css";
import FirestoreListener from "../firebase/FirestoreListener.js";

const Header = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [firestoreListener, setFirestoreListener] = useState(null);
  const [documentData, setDocumentData] = useState(null);

  useEffect(() => {
    setFirestoreListener(new FirestoreListener());
  }, []);

  useEffect(() => {
    if (user && firestoreListener) {
      const documentPath = `Users/${user.uid}/SavedRecipes/654959`;
      const unsubscribe = firestoreListener.subscribeToDocument(
        documentPath,
        (snapshot) => {
          setDocumentData(snapshot.data());
        }
      );

      // Cleanup function
      return unsubscribe;
    }
  }, [user, firestoreListener]);

  const logoutClick = () => {
    navigate("/login");
  };

  const handleLogData = () => {
    if (documentData) {
      console.log(documentData);
    }
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
            <button onClick={handleLogData} className="btn">
              Log Document Data
            </button>
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
