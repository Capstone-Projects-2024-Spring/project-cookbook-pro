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
 
var SignUp = () => {
  const [userName, isUserName] = useState("");
  const [userEmail, isUserEmail] = useState("");
  const [signupError, isSignUpError] = useState("");
  const [userPassword, isUserPassword] = useState("");

  const auth = getAuth();
  useEffect(() => {
    document.title = "CookBook-Pro: SignUp";
    document.body.classList.add("loginPage");
    document.body.style.backgroundColor = "#CFDEF3";
  }, []);
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
