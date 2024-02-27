/**
 * React component for user registration (Sign Up).
 * @module SignUp
 */

import React, { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestoreDb } from "../firebase/firebaseConfig.js";
import "../css/LoginSignUp.css";
import "./Home.jsx";

/**
 * Functional component representing the SignUp page.
 * @returns {JSX.Element} SignUp component
 */
var SignUp = () => {
  /**
   * State for storing the user's name.
   * @type {[string, function]}
   */
  const [userName, isUserName] = useState("");

  /**
   * State for storing the user's email.
   * @type {[string, function]}
   */
  const [userEmail, isUserEmail] = useState("");

  /**
   * State for storing any signup error message.
   * @type {[string, function]}
   */
  const [signupError, isSignUpError] = useState("");

  /**
   * State for storing the user's password.
   * @type {[string, function]}
   */
  const [userPassword, isUserPassword] = useState("");

  /**
   * Firebase authentication instance.
   * @type {Object}
   */
  const auth = getAuth();

  /**
   * Side effect hook to update document title and body class.
   */
  useEffect(() => {
    document.title = "CookBook-Pro: SignUp";
    document.body.classList.add("loginPage");
    document.body.style.backgroundColor = "#CFDEF3";
  }, []);

  /**
   * Handles form submission to create a new user account.
   * @param {Event} e - The form submission event.
   * @returns {Promise<void>} Promise that resolves after form submission.
   */
  const inputCredentials = async (e) => {
    e.preventDefault();
    await createUserWithEmailAndPassword(auth, userEmail, userPassword)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const isUID = user.uid;
        const docSnap = await getDoc(doc(firestoreDb, "Users", isUID));
        if (!docSnap.exists()) {
          await setDoc(doc(firestoreDb, "Users", isUID), { recipeID: [""] });
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        isSignUpError(errorMessage);
        console.log(errorCode, errorMessage);
      });

    await updateProfile(auth.currentUser, {
      displayName: document.getElementById("isName").value,
    })
      .then(() => {
        console.log(auth.currentUser);
        document.location.href = "/";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  /**
   * Renders the SignUp component.
   * @returns {JSX.Element} SignUp component
   */
  return (
    <div className="SignUp">
      <h1 className="Title">Sign Up</h1>
      <br />
      <form>
        <label className="FullName">
          Name<br></br>
        </label>
        <input
          value={userName}
          onChange={(e) => isUserName(e.target.value)}
          className="getFullName"
          type="text"
          id="isName"
          name="isName"
        />
        <br />
        <label className="Email">
          Email<br></br>
        </label>
        <input
          value={userEmail}
          onChange={(e) => isUserEmail(e.target.value)}
          className="getEmail"
          type="text"
          id="isEmail"
          name="isEmail"
        />
        <br />
        <label className="Password">
          Password<br></br>
        </label>
        <input
          value={userPassword}
          onChange={(e) => isUserPassword(e.target.value)}
          className="getPassword"
          type="password"
          id="isPassword"
          name="isPassword"
        />
        {signupError ? (
          <label className="isInvalid">{signupError}</label>
        ) : null}
        <br />
        <br />
        <input
          className="isSubmission"
          type="button"
          id="isSubmit"
          onClick={(e) => inputCredentials(e)}
          value={"Sign Up"}
        />
      </form>
    </div>
  );
};

export default SignUp;